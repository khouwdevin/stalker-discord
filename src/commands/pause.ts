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

      if (!player.paused && !client.timeouts.has(`player-${player.guildId}`)) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: 'Music is paused!',
            iconURL: client.user.avatarURL() || undefined,
          })
          .setColor('Red')
        channel.send({ embeds: [embed] })

        player.pause()

        const timeout = setTimeout(async () => {
          player.stop()
          player.disconnect()
          player.destroy()

          const deleteTimeout = client.timeouts.delete(
            `player-${player.guildId}`
          )
          const deletePlayerAttemps = client.playerAttempts.delete(
            `player-${player.guildId}`
          )
          const deleteMoonPlayer = client.moon.players.delete(player.guildId)

          logger.trace(
            `[Detect User]: Delete client timeout ${player.guildId} : ${deleteTimeout}`
          )
          logger.trace(
            `[[Detect User]: Delete player attempts ${player.guildId} : ${deletePlayerAttemps}`
          )
          logger.trace(
            `[Detect User]: Delete moon player ${player.guildId} : ${deleteMoonPlayer}`
          )

          const channel = await client.channels
            .fetch(player.textChannelId)
            .catch(() => {
              return logger.error(
                '[Detect User]: ❌ Error fetch channel on queueEnd'
              )
            })

          if (!channel || !channel.isTextBased()) return

          const embed = new EmbedBuilder()
            .setAuthor({
              name: 'Users have left. The player is disconnected.',
              iconURL: client.user?.avatarURL() || undefined,
            })
            .setColor('Grey')

          channel.send({ embeds: [embed] })
        }, 30000)

        client.timeouts.set(`player-${player.guildId}`, timeout)
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
