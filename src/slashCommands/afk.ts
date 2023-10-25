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

        let minutes: number = 0
        let userminutesafk: string = ""

        const member = (interaction.member as GuildMember)
        const isAFK = interaction.options.data[0].value as boolean
        
        if (interaction.options.data[1]) {
            minutes = interaction.options.data[1].value as number ? interaction.options.data[1].value as number : 0
            userminutesafk = minutes === 0 ? "" : `for ${minutes} minutes`
        }

        if (isAFK){
            member.setNickname(`[AFK]${member.nickname}`).catch((e) => console.log(e.message))
            await interaction.channel?.send(`${member} is AFK for ${userminutesafk}`)
        }
        else{
            member.setNickname(member.nickname?.replace("[AFK]", "") || member.nickname).catch((e) => console.log(e.message))
            await interaction.channel?.send(`${member} is not AFK`)
        }

        await interaction.editReply("Your command is successfully ran!")
    }
}

export default command