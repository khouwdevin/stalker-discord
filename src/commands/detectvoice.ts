import { Command } from "../types";
import GuildModel from "../schemas/Guild";
import { getAllGuildOption } from "../functions";

const command: Command = {
    name: "detectvoice",
    execute: async (message, args) => {
        let detectvoice = args[1]
        
        if (!detectvoice) return message.channel.send("No boolean provided")
        if (!message.guild) return;

        const options = await getAllGuildOption(message.guild)

        if (!options) return

        options.detectvoice = detectvoice === "true"

        await GuildModel.updateOne({ guildID: message.guild.id }, {
            options: options
        })

        message.channel.send("Detect voice successfully changed!")
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: []
}

export default command