import { VoiceState } from "discord.js";
import { BotEvent } from "../types";
import DetectPresence from "../voiceStateFunctions/detectPresence";
import DetectUser from "../voiceStateFunctions/detectUser";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) {
            DetectPresence(oldstate, 0)
            DetectUser(oldstate, 0)
        }
        else if (oldstate.channelId === null){
            DetectPresence(newstate, 1)
            DetectUser(newstate, 1)
        }
    }
}

export default event