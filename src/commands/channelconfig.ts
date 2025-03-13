import { Command } from '../types'
import { sendTimedMessage, setGuildOption } from '../functions'
import { EmbedBuilder, TextChannel } from 'discord.js'
import logger from '../logger'

const command: Command = {
  name: 'channelconfig',
  execute: async (message, args) => {
    try {
      const channelid = args[1]
      const channel = message.channel

      logger.debug('[Channel Config Command]: Run channel config command.')

      if (!message.guild)
        return sendTimedMessage(
          'Some error is occurred!',
          channel as TextChannel,
          5000
        )
      if (!channelid)
        return sendTimedMessage(
          'No channel is provided!',
          channel as TextChannel,
          10000
        )

      const channels = message.guild.channels

      if (!channels.cache.find((c) => c.id === channelid))
        return sendTimedMessage(
          'Channel not found! Please provide an existing text channel!',
          channel as TextChannel,
          10000
        )

      const channelDefault = channels.cache.get(channelid)

      await setGuildOption(message.guild, 'channel', channelid)

      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Channel Config',
          iconURL: message.client.user.avatarURL() || undefined,
        })
        .setFields({
          name: ' ',
          value: `Channel config successfully changed  to ${channelDefault}!`,
        })
        .setColor('Blurple')

      channel.send({ embeds: [embed] })

      logger.trace(
        `[Channel Config Command]: Channel config changed to ${channelDefault}`
      )
    } catch (e) {
      logger.error(
        `[Channel Config Command]: ❌ Failed to save channel config : ${e.message}`
      )
    }
  },
  cooldown: 5,
  permissions: ['Administrator'],
  aliases: ['cfg'],
}

export default command
