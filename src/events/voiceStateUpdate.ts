import { TextChannel, VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { sendTimedMessage } from "../functions";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) 
            sendTimedMessage(`<@${newstate.member?.user.id}> left channel`, newstate.client.channels.cache.get('902354600634499097') as TextChannel, 5000)
        else if (oldstate.channelId === null)
            sendTimedMessage(`<@${oldstate.member?.user.id}> joined channel`, oldstate.client.channels.cache.get('902354600634499097') as TextChannel, 5000)
    }
}

export default event