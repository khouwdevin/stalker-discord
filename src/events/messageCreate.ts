import { ChannelType, Message } from 'discord.js'
import { checkPermissions, sendTimedMessage } from '../functions'
import { BotEvent } from '../types'
import logger from '../logger'
import loggerLevel from '../server/loggerLevel'
import { getGuildList } from '../server/guildManagement'
import { leaveGuild } from '../server/leaveGuild'

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    logger.debug('[Event]: Message create')

    if (message.author.bot)
      return logger.debug('[Event]: Author is bot on messageCreate')

    const prefix = process.env.PREFIX_COMMAND

    if (!message.content.startsWith(prefix))
      return logger.debug(
        '[Event]: Message is not starting with prefix on messageCreate',
      )
    if (message.channel.type === ChannelType.DM) {
      if (message.author.id !== process.env.USER_ID) {
        logger.trace('[Logger Command]: User is not authorized')

        return
      }

      const args = message.content.substring(prefix.length).split(' ')
      const command = args[0]

      if (command === 'logger') {
        loggerLevel(message, args[1])
      } else if (command === 'guildlist') {
        getGuildList(message.author)
      } else if (command === 'leaveguild') {
        const guilds = args.slice(1)
        leaveGuild(message, guilds)
      }

      return
    }
    if (message.channel.type !== ChannelType.GuildText)
      return logger.debug(
        '[Event]: Message type is not a guild text on messageCreate',
      )
    if (!message.guild || !message.member)
      return logger.debug(
        '[Event]: Message does not have a guild and not a member on messageCreate',
      )

    const args = message.content.substring(prefix.length).split(' ')
    let command = message.client.commands.get(args[0])

    if (!command) {
      const commandFromAlias = message.client.commands.find((command) =>
        command.aliases.includes(args[0]),
      )
      if (!commandFromAlias) return
      command = commandFromAlias
    }

    const cooldown = message.client.cooldowns.get(
      `${command.name}-${message.member.user.username}`,
    )
    const neededPermissions = checkPermissions(
      message.member,
      command.permissions,
    )
    if (neededPermissions !== null)
      return sendTimedMessage(
        `
            You don't have enough permissions to use this command. 
            \n Needed permissions: ${neededPermissions.join(', ')}
            `,
        message.channel,
        5000,
      )

    if (command.cooldown && cooldown) {
      if (Date.now() < cooldown) {
        sendTimedMessage(
          `You have to wait ${Math.floor(
            Math.abs(Date.now() - cooldown) / 1000,
          )} second(s) to use this command again.`,
          message.channel,
          5000,
        )
        return
      }
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000,
      )
      setTimeout(() => {
        message.client.cooldowns.delete(
          `${command?.name}-${message.member?.user.username}`,
        )
      }, command.cooldown * 1000)
    } else if (command.cooldown && !cooldown) {
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000,
      )
    }

    command.execute(message, args)
  },
}

export default event
