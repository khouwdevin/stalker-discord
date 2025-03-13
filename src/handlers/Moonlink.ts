import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { MoonEvent } from '../types'
import { join } from 'path'
import { INode, Player, Track } from 'moonlink.js'
import logger from '../logger'

module.exports = (client: Client) => {
  if (process.env.TURN_ON_MUSIC !== 'true') return

  let eventsMoonDir = join(__dirname, '../eventsMoon')

  readdirSync(eventsMoonDir).forEach((file) => {
    if (!file.endsWith('.js')) return
    let event: MoonEvent = require(`${eventsMoonDir}/${file}`).default

    if (event.name === 'raw') {
      client.on(event.name, (...args) => event.execute(client, ...args))
    } else if (event.name === 'nodeCreate' || event.name === 'nodeReconnect')
      client.moon.on(event.name, (node: INode) => event.execute(node))
    else if (event.name === 'nodeDisconnect')
      client.moon.on('nodeDisconnect', (node, code, reason) =>
        event.execute(node, code, reason)
      )
    else if (event.name === 'nodeDestroy')
      client.moon.on('nodeDestroy', (identifier) => event.execute(identifier))
    else if (
      event.name === 'trackStart' ||
      event.name === 'trackStuck' ||
      event.name === 'trackException'
    )
      client.moon.on(event.name, (player: Player, track: Track) =>
        event.execute(client, player, track)
      )
    else if (event.name === 'queueEnd')
      client.moon.on(event.name, (player, track) =>
        event.execute(client, player, track)
      )
    else if (event.name === 'socketClosed')
      client.moon.on('socketClosed', (player, track) =>
        event.execute(client, player, track)
      )

    logger.info(
      `[Handler]: 🌠 Successfully loaded moon event ${event.name.toString()}`
    )
  })
}
