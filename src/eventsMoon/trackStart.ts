import { Player } from 'moonlink.js'
import { MoonEvent } from '../types'
import { Client, EmbedBuilder } from 'discord.js'
import logger from '../logger'

const event: MoonEvent = {
  name: 'trackStart',
  execute: async (client: Client, player: Player, track: any) => {
    const channel = await client.channels
      .fetch(player.textChannelId)
      .catch(() => {
        return logger.error(
          '[Event Moon]: ❌ Error fetch channel on trackStart'
        )
      })

    if (!channel || !channel.isTextBased()) return
    if (player.loop && player.loop === 'off') return

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Now playing [${track.title}]`,
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setColor('Green')

    channel.send({ embeds: [embed] })

    logger.debug('[Event Moon]: Track start on trackStart')
  },
}

export default event
