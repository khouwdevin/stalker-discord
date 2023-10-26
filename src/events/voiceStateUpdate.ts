import { TextChannel, VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { getGuildOption, notifyToConfigDefaultTextChannel, sendMessage, sendMessageByChannelName } from "../functions";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) {
            const detectvoice = await getGuildOption(oldstate.guild, "detectvoice")

            if (!detectvoice) return

            const channelGuild = await getGuildOption(oldstate.guild, "channel")

            const channel = channelGuild === "stalker" ? oldstate.guild.systemChannel : await oldstate.guild.channels.fetch(channelGuild as string)

            if (!channel) return sendMessageByChannelName(`${oldstate.member?.user} left ${oldstate.channel} channel!`, process.env.STALKER_CHANNEL, oldstate.guild.channels)

            sendMessage(`${oldstate.member?.user} left ${oldstate.channel} channel!`, channel as TextChannel)
        }
        else if (oldstate.channelId === null){
            const detectvoice = await getGuildOption(newstate.guild, "detectvoice")

            if (!detectvoice) return

            const channelGuild = await getGuildOption(newstate.guild, "channel")

            const channel = channelGuild === "default" ? newstate.guild.systemChannel : await newstate.guild.channels.fetch(channelGuild as string)

            if (!channel) return notifyToConfigDefaultTextChannel(newstate.guild.channels)

            sendMessage(`${newstate.member?.user} left ${newstate.channel} channel!`, channel as TextChannel)
        }
    }
}

export default event