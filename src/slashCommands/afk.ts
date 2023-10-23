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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const member = interaction.member as GuildMember
        const id = member.id
        const isAFK = interaction.options.data[0].value as boolean

        if (isAFK){
            await interaction.channel?.send(`<@${id}> is AFK`)
        }
        else{
            await interaction.channel?.send(`<@${id}> is not AFK`)
        }

        await interaction.editReply("Your command is successfully ran!")
    },
    cooldown: 1
}

export default command