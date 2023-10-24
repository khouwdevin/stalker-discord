import { VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { getGuildOption, sendMessageToSpesificChannel } from "../functions";
import mongoose from "mongoose";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        let detectvoice = true

        if (mongoose.connection.readyState === 1) {
            let guildDetectVoice = await getGuildOption(oldstate.guild, "detectvoice") 
                if (guildDetectVoice !== null) detectvoice = guildDetectVoice as boolean;
        }

        if (!detectvoice) return

        if (newstate.channelId === null) 
            sendMessageToSpesificChannel(`${oldstate.member?.user} left ${oldstate.channel} channel!`, process.env.STALKER_CHANNEL, newstate.client.channels)
        else if (oldstate.channelId === null)
            sendMessageToSpesificChannel(`${newstate.member?.user} joined ${newstate.channel}  channel!`, process.env.STALKER_CHANNEL, oldstate.client.channels)
    }
}

export default event