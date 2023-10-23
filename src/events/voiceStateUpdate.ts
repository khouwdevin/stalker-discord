import { VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { sendMessageToSpesificChannel } from "../functions";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) 
            sendMessageToSpesificChannel(`<@${newstate.member?.user.id}> left channel!`, process.env.STALKER_CHANNEL, newstate.client.channels)
        else if (oldstate.channelId === null)
            sendMessageToSpesificChannel(`<@${oldstate.member?.user.id}> joined channel!`, process.env.STALKER_CHANNEL, oldstate.client.channels)
    }
}

export default event