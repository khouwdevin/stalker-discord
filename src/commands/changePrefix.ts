import { ActivityType } from "discord.js";
import { Command } from "../types";
import GuildModel from "../schemas/Guild";

const command: Command = {
    name: "changeprefix",
    execute: async (message, args) => {
        let prefix = args[1]

        if (!prefix) return message.channel.send("No prefix provided")
        if (!message.guild) return;

        await GuildModel.updateOne({ guildID: message.guild.id }, {
            options: {
                prefix: prefix
            }
        })

        message.channel.send("Prefix successfully changed!")
        
        message.client.user?.setPresence({
            status: 'online',
            activities: [{
                name: `${prefix}help`,
                type: ActivityType.Listening
            }]
        })
    },
    permissions: ["Administrator"],
    aliases: []
}

export default command