import { EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../types";
import { deleteTimedMessage } from "../functions";

const command : Command = {
    name: "help",
    execute: async (message, args) => {
        try {
            let prefix = process.env.PREFIX_COMMAND

            const commandslist = 
                `
                **${prefix}channelconfig**: If you want to change Stalker's channel (send the channel id).\r
                example => **'${prefix}channelconfig 12344556677'** or **'${prefix}cfg 12344556677'**\r
                **${prefix}checkstatus**: If you want to check Stalker's config.\r
                example => **'${prefix}checkstatus'** or **'${prefix}cs'**\r
                **${prefix}detectvoice**: If you want to disable or enable detect voice.\r
                example => **'${prefix}detectvoice false'** or **'${prefix}dv false'**\r
                **${prefix}greet**: Stalker will greet you!\r
                example => **'${prefix}greet'** or **'${prefix}g'**\r
                **${prefix}notify**: If you want to disable or enable stalker online notif.\r
                example => **'${prefix}notify false'** or **'${prefix}n false'**
                `
            const slashcommandslist = 
                `
                **/afk**: to announce your afk status\r
                **/clear**: to clear messages\r
                **/decode**: to decode your secret code\r
                **/embed**: to create embed message\r
                **/event**: to add discord schedule event\r
                **/ping**: to test bot ping\r
                **/poll**: to create poll\r
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
        } catch {}
    },
    cooldown: 2,
    aliases: ["h"],
    permissions: []
}

export default command