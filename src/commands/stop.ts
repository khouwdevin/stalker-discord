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
      const player = client.moon.players.has(message.guildId)
        ? client.moon.players.get(message.guildId)
        : null
      const channel = message.channel

      if (!channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

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

      const stopStatus = player.stop()
      player.disconnect()
      player.destroy()

      const deleteTimeout = client.timeouts.delete(`player-${player.guildId}`)
      const deletePlayerAttemps = client.playerAttempts.delete(
        `player-${player.guildId}`
      )
      const deleteMoonPlayer = client.moon.players.delete(player.guildId)

      logger.trace(
        `[Stop Command]: Delete client timeout ${player.guildId} : ${deleteTimeout}`
      )
      logger.trace(
        `[Stop Command]: Delete player attempts ${player.guildId} : ${deletePlayerAttemps}`
      )
      logger.trace(
        `[Stop Command]: Delete moon player ${player.guildId} : ${deleteMoonPlayer}`
      )

      logger.trace(
        `[Stop Command]: Player stopped is ${stopStatus} on guild ${message.guildId}`
      )
    } catch (e) {
      logger.error(`[Stop Command]: ❌ Failed to stop music : ${e.message}`)
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['stp'],
}

export default command
