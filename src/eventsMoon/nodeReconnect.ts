import { Node } from 'moonlink.js'
import { MoonEvent } from '../types'
import logger from '../logger'

const event: MoonEvent = {
  name: 'nodeReconnect',
  execute: (node: Node) => {
    logger.info(`[Event Moon]: 🔃 Reconnecting to ${node.host}`)
  },
}

export default event
