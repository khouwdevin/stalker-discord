import { Command } from "../types";
import { setGuildOption } from "../functions";

const command: Command = {
    name: "channelconfig",
    execute: async (message, args) => {
        const channelid = args[1]
        const channel = message.channel

        if (!channelid) return message.channel.send("No channel is provided!")

        if (!message.guild?.channels.cache.find((c) => c.id === channelid)) {
            console.log("'channelconfig' channel doesn't exist.")
            return channel.send("Channel not found! Please provide an existing text channel!")
        }

        if (!message.guild) {
            console.log("'channelconfig' is missing guild.")
            return message.channel.send("Some error is occured!")
        }

        setGuildOption(message.guild, "channel", channelid)

        message.channel.send("Channel config successfully changed!")
        
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: []
}

export default command