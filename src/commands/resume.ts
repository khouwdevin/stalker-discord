import { sendTimedMessage } from '../functions'
import logger from '../logger'
import { Command } from '../types'
import { EmbedBuilder, TextChannel } from 'discord.js'

const command: Command = {
  name: 'resume',
  execute: async (message, args) => {
    try {
      logger.debug('[Resume Command]: Run resume command')

      if (!message.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

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

      if (player.paused) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: 'Music is resumed!',
            iconURL: client.user.avatarURL() || undefined,
          })
          .setColor('Green')
        channel.send({ embeds: [embed] })

        const resumeStatus = player.resume()

        logger.trace(
          `[Resume Command]: Resume is ${resumeStatus} on guild ${message.guildId}`
        )

        if (client.timeouts.has(`player-${player.guildId}`)) {
          clearTimeout(client.timeouts.get(`player-${player.guildId}`))
          client.timeouts.delete(`player-${player.guildId}`)
        }
      }
    } catch (e) {
      logger.error(`[Resume Command]: ❌ Failed to resume music : ${e.message}`)
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['rsm'],
}

export default command
