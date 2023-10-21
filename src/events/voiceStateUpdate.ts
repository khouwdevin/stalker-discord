import { TextChannel, VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { getChannelIdbyName, sendMessage } from "../functions";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) 
            sendMessage(`<@${newstate.member?.user.id}> left channel`, (await newstate.client.channels.fetch(getChannelIdbyName(newstate.client.channels, "testing"))) as TextChannel)
        else if (oldstate.channelId === null)
            sendMessage(`<@${oldstate.member?.user.id}> joined channel`, (await oldstate.client.channels.fetch(getChannelIdbyName(newstate.client.channels, "testing"))) as TextChannel)
    }
}

export default event