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

    if (player.connected) {
      const timeout = setTimeout(async () => {
        player.stop({ destroy: true })
        client.timeouts.delete(`player-${player.guildId}`)

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
