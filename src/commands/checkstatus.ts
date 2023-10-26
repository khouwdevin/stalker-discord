import { EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../types";
import { deleteTimedMessage, getAllGuildOption } from "../functions";

const command : Command = {
    name: "checkstatus",
    execute: async (message, args) => {
        let options

        if (message.guild){
            const guildoptions = await getAllGuildOption(message.guild)
            if (guildoptions) options = guildoptions
        }

        const statuslist = 
            `
            **detect voice**: ${options?.detectvoice}\r
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
    },
    cooldown: 5,
    aliases: ["h"],
    permissions: []
}

export default command