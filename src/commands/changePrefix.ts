import { ActivityType } from "discord.js";
import { Command } from "../types";
import GuildModel from "../schemas/Guild";
import { getAllGuildOption } from "../functions";

const command: Command = {
    name: "changeprefix",
    execute: async (message, args) => {
        let prefix = args[1]

        if (!prefix) return message.channel.send("No prefix provided")
        if (!message.guild) return;

        const options = await getAllGuildOption(message.guild)

        if (!options) return

        options.prefix = prefix

        await GuildModel.updateOne({ guildID: message.guild.id }, {
            options: options
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