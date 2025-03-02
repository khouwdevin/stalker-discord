import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { MoonEvent } from '../types'
import { join } from 'path'
import { color } from '../functions'

module.exports = (client: Client) => {
  let eventsMoonDir = join(__dirname, '../eventsMoon')

  readdirSync(eventsMoonDir).forEach((file) => {
    if (!file.endsWith('.js')) return
    let event: MoonEvent = require(`${eventsMoonDir}/${file}`).default

    if (event.name === 'raw') {
      client.on(event.name, (...args) => event.execute(client, ...args))
    } else if (
      event.name === 'nodeCreate' ||
      event.name === 'nodeReconnect' ||
      event.name === 'nodeDestroy'
    )
      client.moon.on(event.name, (node: Node) => event.execute(node))
    else if (event.name === 'nodeClose')
      client.moon.on('nodeClose', (node, code, reason) =>
        event.execute(node, code, reason)
      )
    else if (
      event.name === 'trackStart' ||
      event.name === 'trackStuck' ||
      event.name === 'trackError'
    )
      client.moon.on(event.name, (player, track) =>
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

    console.log(
      color(
        'text',
        `🌠 Successfully loaded moon event ${color('variable', event.name)}`
      )
    )
  })
}
