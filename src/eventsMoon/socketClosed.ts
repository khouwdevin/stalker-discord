import { Player } from 'moonlink.js'
import { MoonEvent } from '../types'
import { Client } from 'discord.js'
import { setPlayerDB } from '../functions'

const event: MoonEvent = {
  name: 'socketClosed',
  execute: async (client: Client, player: Player, track: any) => {
    if (client.attempts.has(player.guildId)) {
      client.attempts.delete(player.guildId)
    }

    const options = {
      autoPlay: player.autoPlay ?? false,
      loop: player.loop ? player.loop : 'off',
      volume: player.volume,
    }

    await setPlayerDB(player.guildId, options)
  },
}

export default event
