import { Player } from 'moonlink.js'
import { MoonEvent } from '../types'
import { Client, EmbedBuilder } from 'discord.js'
import { color } from '../functions'

const event: MoonEvent = {
  name: 'trackError',
  execute: async (client: Client, player: Player, track: any) => {
    const channel = await client.channels
      .fetch(player.textChannelId)
      .catch(() => {
        return console.log(
          color(
            'text',
            `❌ Error fetch channel on ${color('variable', 'trackError')}`
          )
        )
      })

    if (!channel || !channel.isTextBased()) return

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Error occurred, restarting ${track.title}`,
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setColor('Red')

    channel.send({ embeds: [embed] })

    const attemp = client.attempts.get(player.guildId)

    if (!attemp) {
      client.attempts.set(player.guildId, 3)
      await player.restart()
    } else {
      if (attemp <= 0) {
        player.stop()

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Error occurred, bot is disconnected!`,
            iconURL: client.user?.avatarURL() || undefined,
          })
          .setColor('Red')

        channel.send({ embeds: [embed] })
      } else {
        client.attempts.set(player.guildId, attemp - 1)
        await player.restart()
      }
    }
  },
}

export default event
