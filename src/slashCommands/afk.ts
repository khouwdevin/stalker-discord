import { SlashCommandBuilder, GuildMember, PermissionFlagsBits } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("afk")
        .setDescription("Tell your friend if you are going to AFK.")
        .addBooleanOption(options => {
            return options
                .setName("afk")
                .setDescription("Are you afk 'true' or 'false'")
                .setRequired(true)
        })
        .addIntegerOption(options => {
            return options
                .setName("time")
                .setDescription("For how many long? (minutes)")
                .setMinValue(1)
                .setRequired(false)
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const user = (interaction.member as GuildMember).user
        const isAFK = interaction.options.data[0].value as boolean
        const minutes = interaction.options.data[1].value as number ? interaction.options.data[1].value as number : 0
        const userminutesafk = minutes === 0 ? "" : `for ${minutes} minutes`

        if (isAFK){
            await interaction.channel?.send(`${user} is AFK for ${userminutesafk}`)
        }
        else{
            await interaction.channel?.send(`${user} is not AFK`)
        }

        await interaction.editReply("Your command is successfully ran!")
    },
    cooldown: 1
}

export default command