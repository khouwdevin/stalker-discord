import { EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../types";
import { deleteTimedMessage } from "../functions";

const command : Command = {
    name: "help",
    execute: async (message, args) => {
        let prefix = process.env.PREFIX_COMMAND

        const commandslist = 
            `
            **${prefix}greet**: Stalker will greet you!\r
            example => **'${prefix}greet'**\r
            **${prefix}detectvoice**: If you want to disable or enable detect voice.\r
            example => **'${prefix}detectvoice false'**\r
            **${prefix}notify**: If you want to disable or enable stalker online notify.\r
            example => **'${prefix}notify false'**
            **${prefix}checkstatus**: If you want to check Stalker config.\r
            example => **'${prefix}checkstatus'**
            `
        const slashcommandslist = 
            `
            **/poll**: to create poll\r
            **/afk**: to announce your afk\r
            **/decode**: to decode your secret code\r
            **/embed**: to create embed message\r
            **/ping**: to test bot ping\r
            **/clear**: to clear messages\r
            **/event**: to add discord schedule event
            `

        const embed = new EmbedBuilder()
            .setTitle("Here's the instruction")
            .setColor("White")
            .addFields(
                { name: "Slash Commands List", value: slashcommandslist},
                { name: "Commands List", value: commandslist},   
            )
        message.channel.send({ embeds: [embed] }).then(m => {
            deleteTimedMessage(m, message.channel as TextChannel, 20000)
            deleteTimedMessage(message, message.channel as TextChannel, 20000)
        })
    },
    cooldown: 1,
    aliases: ["h"],
    permissions: []
}

export default command