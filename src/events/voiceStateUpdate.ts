import { TextChannel, VoiceState } from "discord.js";
import { BotEvent } from "../types";
import { getGuildOption, notifyToConfigDefaultTextChannel, sendMessage, sendMessageByChannelName, sendMessageToExistingChannel } from "../functions";

const event: BotEvent = {
    name: "voiceStateUpdate",
    execute: async (oldstate: VoiceState, newstate: VoiceState) => {
        if (newstate.channelId === null) {
            const detectvoice = await getGuildOption(oldstate.guild, "detectvoice")

            if (!detectvoice) return

            const channelGuildId = await getGuildOption(oldstate.guild, "channel")

            if (!oldstate.guild?.channels.cache.find((c) => c.id === channelGuildId)) {
                console.log("'channelconfig' channel doesn't exist.")
                return sendMessageToExistingChannel(oldstate.guild.channels, "Channel has been deleted or doesn't exist, please provide a new one in channelconfig!")
            }

            const channel = channelGuildId === "default" ? oldstate.guild.systemChannel : await oldstate.guild.channels.fetch(channelGuildId as string)

            if (!channel) return notifyToConfigDefaultTextChannel(newstate.guild.channels)

            sendMessage(`${oldstate.member?.user} left ${oldstate.channel} channel!`, channel as TextChannel)
        }
        else if (oldstate.channelId === null){
            const detectvoice = await getGuildOption(newstate.guild, "detectvoice")

            if (!detectvoice) return

            const channelGuildId = await getGuildOption(newstate.guild, "channel")

            if (!newstate.guild?.channels.cache.find((c) => c.id === channelGuildId)) {
                console.log("'channelconfig' channel doesn't exist.")
                return sendMessageToExistingChannel(newstate.guild.channels, "Channel has been deleted or doesn't exist, please provide a new one in channelconfig!")
            }

            const channel = channelGuildId === "default" ? newstate.guild.systemChannel : await newstate.guild.channels.fetch(channelGuildId as string)

            if (!channel) return notifyToConfigDefaultTextChannel(newstate.guild.channels)

            sendMessage(`${newstate.member?.user} left ${newstate.channel} channel!`, channel as TextChannel)
        }
    }
}

export default event