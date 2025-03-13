import { Player } from 'moonlink.js'
import { MoonEvent } from '../types'
import { Client } from 'discord.js'
import logger from '../logger'

const event: MoonEvent = {
  name: 'socketClosed',
  execute: async (client: Client, player: Player, track: any) => {
    if (client.playerAttempts.has(player.guildId)) {
      client.playerAttempts.delete(player.guildId)
    }

    logger.debug(`[Event Moon]: Socket closed ${player.guildId}`)
  },
}

export default event
