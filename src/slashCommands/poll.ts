import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("poll")
    
    .addStringOption(option => { 
        return option
        .setName("title")
        .setDescription("Add title")
        .setRequired(true)
        .setMaxLength(50)
    })
    .addStringOption(option => {
        return option
        .setName("option1")
        .setDescription("Add option 1 of 5")
        .setRequired(true)
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option2")
        .setDescription("Add option 2 of 5")
        .setRequired(true)
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option3")
        .setDescription("Add option 3 of 5")
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option4")
        .setDescription("Add option 4 of 5")
        .setMaxLength(150)
    })
    .addStringOption(option => {
        return option
        .setName("option3")
        .setDescription("Add option 5 of 5")
        .setMaxLength(150)
    })
    .setDescription("To create polling"),
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const { channel } = interaction
        const options = interaction.options.data
        const emojies = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

        let embed = new EmbedBuilder()
            .setTitle(`${options[0].value}`)        
            .setColor("Blue")

        for (let i = 1; i < options.length; i++){
            embed.addFields(
                { name: `${emojies[i-1]} ${options[i].value}`, value: " " }
            )
        }

        const message = await channel?.send({ embeds: [embed] })

        for (let i = 1; i < options.length; i++){
            message?.react(emojies[i-1])
        }

        await interaction.editReply("Poll sent successfully!")
    },
    cooldown: 2
}

export default command;