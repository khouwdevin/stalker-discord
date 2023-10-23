import { EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../types";
import { deleteTimedMessage } from "../functions";

const commandslist = 
    `
    **$greet**: Stalker will greet you!\r
    example => **'$greet'**\r
    **$changeprefix**: If you want to change the prefix for commands.
    example => **'$changeprefix #'**
    `

const slashcommandslist = 
    `
    **/poll**: to create poll\r
    **/decode**: to decode your secret code\r
    **/embed**: to create embed message\r
    **/ping**: to test bot ping\r
    **/clear**: to clear messages
    `

const command : Command = {
    name: "help",
    execute: (message, args) => {
        const embed = new EmbedBuilder()
            .setTitle("Here's the instruction")
            .setColor("White")
            .addFields(
                { name: "Slash Commands List", value: slashcommandslist},
                { name: "Commands List", value: commandslist},   
            )
        message.channel.send({ embeds: [embed] }).then(m => deleteTimedMessage(m, message.channel as TextChannel, 20000))
    },
    cooldown: 1,
    aliases: ["h"],
    permissions: []
}

export default command