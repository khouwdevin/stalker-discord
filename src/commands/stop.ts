import { sendTimedMessage } from '../functions'
import logger from '../logger'
import { Command } from '../types'
import { EmbedBuilder, TextChannel } from 'discord.js'

const command: Command = {
  name: 'stop',
  execute: async (message, args) => {
    try {
      logger.debug('[Stop Command]: Run stop command')

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

      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Music is stopped!',
          iconURL: client.user.avatarURL() || undefined,
        })
        .setColor('Red')
      channel.send({ embeds: [embed] })

      player.stop({ destroy: true })
      logger.trace('[Stop Command]: Player is stopped')
    } catch (e) {
      const client = message.client
      logger.error(`[Stop Command]: ❌ Failed to stop music : ${e.message}`)
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['stp'],
}

export default command
