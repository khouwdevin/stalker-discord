import { Player } from 'moonlink.js'
import { MoonEvent } from '../types'
import { Client } from 'discord.js'

const event: MoonEvent = {
  name: 'queueEnd',
  execute: async (client: Client, player: Player, track: any) => {
    const timeout = setTimeout(async () => {
      player.stop()
      client.timeouts.delete(`player-${player.guildId}`)
    }, 20000)

    client.timeouts.set(`player-${player.guildId}`, timeout)
  },
}

export default event
