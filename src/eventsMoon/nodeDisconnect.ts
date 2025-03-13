import { Node } from 'moonlink.js'
import { MoonEvent } from '../types'
import logger from '../logger'

const event: MoonEvent = {
  name: 'nodeDisconnect',
  execute: (node: Node, code: number, reason: any) => {
    logger.info(
      `[Event Moon]: ❌ Disconnected from ${node.host} code ${code} reason ${reason}`
    )
  },
}

export default event
