import { Player } from 'moonlink.js'
import { MoonEvent } from '../types'
import { Client, EmbedBuilder } from 'discord.js'
import logger from '../logger'

const event: MoonEvent = {
  name: 'queueEnd',
  execute: async (client: Client, player: Player, track: any) => {
    logger.debug(`[Event Moon]: Queue end player-${player.guildId}`)

    const channel = await client.channels
      .fetch(player.textChannelId)
      .catch(() => {
        return logger.error('[Event Moon]: ❌ Error fetch channel on queueEnd')
      })

    if (!channel || !channel.isTextBased()) return

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Queue end here',
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setColor('Grey')

    channel.send({ embeds: [embed] })

    if (player.connected && !client.timeouts.has(`player-${player.guildId}`)) {
      const timeout = setTimeout(async () => {
        player.stop()
        player.disconnect()
        player.destroy()

        const deleteTimeout = client.timeouts.delete(`player-${player.guildId}`)
        const deletePlayerAttemps = client.playerAttempts.delete(
          `player-${player.guildId}`
        )
        const deleteMoonPlayer = client.moon.players.delete(player.guildId)

        logger.trace(
          `[Event Moon]: Delete client timeout ${player.guildId} on queueEnd : ${deleteTimeout}`
        )
        logger.trace(
          `[Event Moon]: Delete player attempts ${player.guildId} on queueEnd : ${deletePlayerAttemps}`
        )
        logger.trace(
          `[Event Moon]: Delete moon player ${player.guildId} on queueEnd : ${deleteMoonPlayer}`
        )

        const embed = new EmbedBuilder()
          .setAuthor({
            name: 'No queue left, player disconnected.',
            iconURL: client.user?.avatarURL() || undefined,
          })
          .setColor('Grey')

        channel.send({ embeds: [embed] })
      }, 10000)

      client.timeouts.set(`player-${player.guildId}`, timeout)
    }
  },
}

export default event
