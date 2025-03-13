import { Node } from 'moonlink.js'
import { MoonEvent } from '../types'
import logger from '../logger'

const event: MoonEvent = {
  name: 'nodeCreate',
  execute: (node: Node) => {
    logger.info(`[Event Moon]: 💪 Connected to ${node.host}`)
  },
}

export default event
