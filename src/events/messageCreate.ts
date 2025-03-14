import { ChannelType, Message } from 'discord.js'
import { checkPermissions, sendTimedMessage } from '../functions'
import { BotEvent } from '../types'
import logger from '../logger'

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    logger.debug('[Event]: Message create')

    if (!message.member || message.member.user.bot) return
    if (!message.guild) return
    const prefix = process.env.PREFIX_COMMAND

    if (!message.content.startsWith(prefix)) return
    if (message.channel.type !== ChannelType.GuildText) return

    const args = message.content.substring(prefix.length).split(' ')
    let command = message.client.commands.get(args[0])

    if (!command) {
      const commandFromAlias = message.client.commands.find((command) =>
        command.aliases.includes(args[0])
      )
      if (!commandFromAlias) return
      command = commandFromAlias
    }

    const cooldown = message.client.cooldowns.get(
      `${command.name}-${message.member.user.username}`
    )
    const neededPermissions = checkPermissions(
      message.member,
      command.permissions
    )
    if (neededPermissions !== null)
      return sendTimedMessage(
        `
            You don't have enough permissions to use this command. 
            \n Needed permissions: ${neededPermissions.join(', ')}
            `,
        message.channel,
        5000
      )

    if (command.cooldown && cooldown) {
      if (Date.now() < cooldown) {
        sendTimedMessage(
          `You have to wait ${Math.floor(
            Math.abs(Date.now() - cooldown) / 1000
          )} second(s) to use this command again.`,
          message.channel,
          5000
        )
        return
      }
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      )
      setTimeout(() => {
        message.client.cooldowns.delete(
          `${command?.name}-${message.member?.user.username}`
        )
      }, command.cooldown * 1000)
    } else if (command.cooldown && !cooldown) {
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      )
    }

    command.execute(message, args)
  },
}

export default event
