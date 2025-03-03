import { MoonEvent } from '../types'
import { color } from '../functions'

const event: MoonEvent = {
  name: 'nodeDestroy',
  execute: (identifier: string) => {
    console.log(
      color('text', `❌ Node ${color('variable', identifier)} is destroyed!`)
    )
  },
}

export default event
