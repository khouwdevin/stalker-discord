import { EmbedBuilder, VoiceState } from 'discord.js'
import logger from '../logger'

const DetectUser = async (oldState: VoiceState, newState: VoiceState) => {
  try {
    const client = newState.client
    const player = client.moon.players.get(newState.guild.id)

    if (!player) return
    if (
      (oldState.member && oldState.member.user === client.user) ||
      (newState.member && newState.member.user === client.user)
    ) {
      if (!newState.channel) {
        player.stop()
        player.disconnect()
        player.destroy()

        await client.moon.players.delete(player.guildId)

        logger.debug(
          `[Detect User]: Player is destroyed due to client disconnect from ${oldState.channelId}`
        )
        logger.trace(
          `[Detect User]: Delete moon player from guild ${player.guildId}`
        )
      } else {
        const members = newState.channel.members

        if (members.size > 1) {
          if (client.timeouts.has(`player-${player.guildId}`)) {
            clearTimeout(client.timeouts.get(`player-${player.guildId}`))
            client.timeouts.delete(`player-${player.guildId}`)
          }
        } else {
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
            await client.moon.players.delete(player.guildId)

            logger.trace(
              `[Detect User]: Delete client timeout ${player.guildId} : ${deleteTimeout}`
            )
            logger.trace(
              `[[Detect User]: Delete player attempts ${player.guildId} : ${deletePlayerAttemps}`
            )
            logger.trace(
              `[Detect User]: Delete moon player from guild ${player.guildId}`
            )

            const channel = await client.channels
              .fetch(player.textChannelId)
              .catch(() => {
                return logger.error(
                  '[Detect User]: ❌ Error fetch channel on queueEnd'
                )
              })

            if (!channel || !channel.isSendable()) return

            const embed = new EmbedBuilder()
              .setAuthor({
                name: 'The new channel does not have users. Player is disconnected',
                iconURL: client.user?.avatarURL() || undefined,
              })
              .setColor('Grey')

            channel.send({ embeds: [embed] })
          }, 10000)

          client.timeouts.set(`player-${player.guildId}`, timeout)
        }
      }

      return
    }

    if (newState.channelId === player.voiceChannelId) {
      if (player.playing && client.timeouts.has(`player-${player.guildId}`)) {
        clearTimeout(client.timeouts.get(`player-${player.guildId}`))
        client.timeouts.delete(`player-${player.guildId}`)
      }

      logger.trace(
        `[Detect User]: ${newState.member?.user.tag} joined the same channel as the bot.`
      )
    } else if (
      oldState.channelId === player.voiceChannelId &&
      newState.channelId !== player.voiceChannelId
    ) {
      if (!oldState.channel) return

      const members = oldState.channel.members

      if (members.size > 1) {
        if (client.timeouts.has(`player-${player.guildId}`)) {
          clearTimeout(client.timeouts.get(`player-${player.guildId}`))
          client.timeouts.delete(`player-${player.guildId}`)
        }

        return
      }

      if (
        player.connected &&
        !client.timeouts.has(`player-${player.guildId}`)
      ) {
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
          await client.moon.players.delete(player.guildId)

          logger.trace(
            `[Detect User]: Delete client timeout ${player.guildId} : ${deleteTimeout}`
          )
          logger.trace(
            `[[Detect User]: Delete player attempts ${player.guildId} : ${deletePlayerAttemps}`
          )
          logger.trace(
            `[Detect User]: Delete moon player from guild ${player.guildId}`
          )

          const channel = await client.channels
            .fetch(player.textChannelId)
            .catch(() => {
              return logger.error(
                '[Detect User]: ❌ Error fetch channel on queueEnd'
              )
            })

          if (!channel || !channel.isSendable()) return

          const embed = new EmbedBuilder()
            .setAuthor({
              name: 'Users have left. Player is disconnected.',
              iconURL: client.user?.avatarURL() || undefined,
            })
            .setColor('Grey')

          channel.send({ embeds: [embed] })
        }, 10000)

        client.timeouts.set(`player-${player.guildId}`, timeout)
      }

      logger.trace(
        `[Detect User]: ${oldState.member?.user.tag} left the bots channel.`
      )
    }
  } catch (e) {
    logger.error(`[Detect User]: ❌ Failed to detect user : ${e.message}`)
  }
}

export default DetectUser
