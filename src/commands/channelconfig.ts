import { Command } from "../types";
import { color, sendTimedMessage, setGuildOption } from "../functions";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "channelconfig",
    execute: async (message, args) => {
        try {
            const channelid = args[1]
            const channel = message.channel

            if (!message.guild) return sendTimedMessage("Some error is occured!", channel as TextChannel, 5000)
            if (!channelid) return sendTimedMessage("No channel is provided!", channel as TextChannel, 10000)
            
            const channels = message.guild.channels

            if (!channels.cache.find((c) => c.id === channelid)) return sendTimedMessage("Channel not found! Please provide an existing text channel!", channel as TextChannel, 10000)

            setGuildOption(message.guild, "channel", channelid)
            sendTimedMessage("Channel config successfully changed!", channel as TextChannel, 5000)
        } catch(e) {console.log(color("text", `❌ Failed to save channel config : ${color("error", e.message)}`))}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["cfg"]
}

export default command