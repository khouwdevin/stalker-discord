import { Player } from 'moonlink.js'
import { MoonEvent } from '../types'
import { Client, EmbedBuilder } from 'discord.js'
import logger from '../logger'

const event: MoonEvent = {
  name: 'trackStuck',
  execute: async (client: Client, player: Player, track: any) => {
    const channel = await client.channels
      .fetch(player.textChannelId)
      .catch(() => {
        return logger.error(
          '[Event Moon]: ❌ Error fetch channel on trackStuck'
        )
      })

    if (!channel || !channel.isSendable()) return

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Error occurred, restarting ${track.title}`,
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setColor('Red')

    channel.send({ embeds: [embed] })

    const attemp = client.playerAttempts.get(player.guildId)

    if (!attemp) {
      client.playerAttempts.set(player.guildId, 3)
      await player.restart()

      logger.debug('[Event Moon]: Restart player on trackStuck')
    } else {
      if (attemp <= 0) {
        player.stop({ destroy: true })

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Error occurred, bot is disconnected!`,
            iconURL: client.user?.avatarURL() || undefined,
          })
          .setColor('Red')

        channel.send({ embeds: [embed] })

        logger.debug('[Event Moon]: Player is being stopped on trackStuck')
      } else {
        client.playerAttempts.set(player.guildId, attemp - 1)
        await player.restart()

        logger.debug('[Event Moon]: Restart player on trackStuck')
      }
    }
  },
}

export default event
