import { EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../types";
import { deleteTimedMessage, getAllGuildOption } from "../functions";

const command : Command = {
    name: "checkstatus",
    execute: async (message, args) => {
        try {
            if (!message.guild) return

            const guildoptions = await getAllGuildOption(message.guild)
            if (!guildoptions) return
            
            const options = guildoptions
    
            const statuslist = 
                `
                **detect voice**: ${options?.detectpresence}\r
                **notify**: ${options?.notify}\r
                **channel**: <#${options?.channel}>
                `
    
            const embed = new EmbedBuilder()
                .setTitle("Here's the list")
                .setColor("Blurple")
                .addFields(
                    { name: "Status List", value: " "},
                    { name: " ", value: statuslist }
                )
            message.channel.send({ embeds: [embed] }).then(m => {
                deleteTimedMessage(m, message.channel as TextChannel, 20000)
                deleteTimedMessage(message, message.channel as TextChannel, 20000)
            })
        } catch {}
    },
    cooldown: 5,
    aliases: ["cs"],
    permissions: []
}

export default command