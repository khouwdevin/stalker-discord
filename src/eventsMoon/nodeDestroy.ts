import { MoonEvent } from '../types'
import logger from '../logger'

const event: MoonEvent = {
  name: 'nodeDestroy',
  execute: (identifier: string) => {
    logger.info(`[Event Moon]: ❌ Node ${identifier} is destroyed!`)
  },
}

export default event
