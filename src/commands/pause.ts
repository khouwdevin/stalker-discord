import { sendTimedMessage } from '../functions'
import logger from '../logger'
import { Command } from '../types'
import { EmbedBuilder, TextChannel } from 'discord.js'

const command: Command = {
  name: 'pause',
  execute: async (message, args) => {
    try {
      logger.debug('[Pause Command]: Run pause command')

      if (!message.guildId || !message.member)
        return sendTimedMessage(
          'An error occurred!',
          message.channel as TextChannel,
          5000
        )
      if (!message.member.voice.channelId)
        return sendTimedMessage(
          `${message.member} is not joining any channel!`,
          message.channel as TextChannel,
          5000
        )

      const client = message.client
      const player = client.moon.players.get(message.guildId)
      const channel = message.channel

      if (!player)
        return sendTimedMessage(
          `${message.member} Stalker music is not active!`,
          channel as TextChannel,
          5000
        )
      if (message.member.voice.channelId !== player.voiceChannelId)
        return sendTimedMessage(
          `${message.member} isn't joining in a same voice channel!`,
          channel as TextChannel,
          5000
        )

      if (!player.paused) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: 'Music is paused!',
            iconURL: client.user.avatarURL() || undefined,
          })
          .setColor('Red')
        channel.send({ embeds: [embed] })

        player.pause()
      }
    } catch (e) {
      logger.error(`[Pause Command]: ❌ Failed to pause music : ${e.message}`)
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['ps'],
}

export default command
