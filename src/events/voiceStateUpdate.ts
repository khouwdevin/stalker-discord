import { VoiceState } from 'discord.js'
import { BotEvent } from '../types'
import DetectPresence from '../voiceStateFunctions/detectPresence'
import DetectUser from '../voiceStateFunctions/detectUser'
import logger from '../logger'

const event: BotEvent = {
  name: 'voiceStateUpdate',
  execute: (oldstate: VoiceState, newstate: VoiceState) => {
    logger.debug('[Event]: Voice state update')

    if (newstate.channelId === null) {
      DetectPresence(oldstate, 0)
    } else if (oldstate.channelId === null) {
      DetectPresence(newstate, 1)
    } else {
      DetectPresence(newstate, 2)
    }

    DetectUser(oldstate, newstate)
  },
}

export default event
