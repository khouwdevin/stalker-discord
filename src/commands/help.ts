import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { Command, IHelp } from "../types";
import { color } from "../functions";

const command : Command = {
    name: "help",
    execute: async (message, args) => {
        try {
            const client = message.client

            const embed = new EmbedBuilder()
                .setTitle(commandText[0].title)
                .setColor("White")
                .setFields(commandText[0].field)
                .setFooter(commandText[0].footer)

            const currentMessage = await message.channel.send({ embeds: [embed] })

            const backButton = new ButtonBuilder()
                .setLabel("⬅️")
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`help.${currentMessage.id}.back`)

            const nextButton = new ButtonBuilder()
                .setLabel("➡️")
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`help.${currentMessage.id}.next`)

            const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton, nextButton)
            
            await currentMessage.edit({ embeds: [embed], components: [buttonsRow] })

            const timeout = setTimeout( async () => {
                await currentMessage.delete()
                    .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
            }, 20000)

            client.timeouts.set(`help-${currentMessage.id}`, timeout)
        } catch(e) {console.log(color("text", `❌ Failed to show help : ${color("error", e.message)}`))}
    },
    button: async (interaction) => {
        try {
            if (!interaction.channel) return

            const [type, messageId, command] = interaction.customId.split(".")
            const client = interaction.client
            const currentMessage = await interaction.channel.messages
                .fetch(messageId)
                .catch((e) => console.log(color("text", `❌ Failed to fetch message : ${color("error", e.message)}`)))

            if (!currentMessage) return
            if (!currentMessage.embeds[0].footer) return


            const components = currentMessage.components[0]
            const currentPage = parseInt(currentMessage.embeds[0].footer.text.split("/")[0]) - 1
            const index = command === "next" ? 1 : -1
            const nextPage = Math.max(0, Math.min(currentPage + index, 2));

            const embed = new EmbedBuilder()
                .setTitle(commandText[nextPage].title)
                .setColor("White")
                .setFields(commandText[nextPage].field)
                .setFooter(commandText[nextPage].footer)

            currentMessage.edit({ embeds: [embed], components: [components] })

            clearTimeout(client.timeouts.get(`help-${messageId}`))
            client.timeouts.delete(`help-${messageId}`)

            const timeout = setTimeout( async () => {
                await currentMessage.delete()
                    .catch((e) => console.log(color("text", `❌ Failed to delete message : ${color("error", e.message)}`)))
            }, 20000)

            client.timeouts.set(`help-${currentMessage.id}`, timeout)

            interaction.deferUpdate()
        } catch(e) {console.log(color("text", `❌ Failed to process interact button help : ${color("error", e.message)}`))}
    },
    cooldown: 2,
    aliases: ["h"],
    permissions: []
}

const commandText: IHelp[] = [
    {
        title: "Command List",
        field: [
            {
                name: " ",
                value: 
                    `
                    **${process.env.PREFIX_COMMAND}channelconfig**: If you want to change Stalker's channel (send the channel id).\r
                    example => **'${process.env.PREFIX_COMMAND}channelconfig 12344556677'** or **'${process.env.PREFIX_COMMAND}cfg 12344556677'**\r
                    **${process.env.PREFIX_COMMAND}checkstatus**: If you want to check Stalker's config.\r
                    example => **'${process.env.PREFIX_COMMAND}checkstatus'** or **'${process.env.PREFIX_COMMAND}cs'**\r
                    **${process.env.PREFIX_COMMAND}detectpresence**: If you want to disable or enable detect presence.\r
                    example => **'${process.env.PREFIX_COMMAND}detectpresence false'** or **'${process.env.PREFIX_COMMAND}dp false'**\r
                    **${process.env.PREFIX_COMMAND}greet**: Stalker will greet you!\r
                    example => **'${process.env.PREFIX_COMMAND}greet'** or **'${process.env.PREFIX_COMMAND}g'**\r
                    **${process.env.PREFIX_COMMAND}notify**: If you want to disable or enable stalker online notif.\r
                    example => **'${process.env.PREFIX_COMMAND}notify false'** or **'${process.env.PREFIX_COMMAND}n false'**
                    `
            }
        ],
        footer: { text: "1/3" }
    },
    {
        title: "Music Command List", 
        field: [
            {
                name: " ",
                value: 
                    `
                    **${process.env.PREFIX_COMMAND}play**: to play and search song.\r
                    example => **'${process.env.PREFIX_COMMAND}play drown'** or **'${process.env.PREFIX_COMMAND}p drown'**\r
                    **${process.env.PREFIX_COMMAND}pause**: to pause song.\r
                    example => **'${process.env.PREFIX_COMMAND}pause'** or **'${process.env.PREFIX_COMMAND}ps'**\r
                    **${process.env.PREFIX_COMMAND}resume**: to resume song.\r
                    example => **'${process.env.PREFIX_COMMAND}resume'** or **'${process.env.PREFIX_COMMAND}rsm'**\r
                    **${process.env.PREFIX_COMMAND}skip**: to skip song.\r
                    example => **'${process.env.PREFIX_COMMAND}skip'** or **'${process.env.PREFIX_COMMAND}s'**\r
                    **${process.env.PREFIX_COMMAND}stop**: to stop player.\r
                    example => **'${process.env.PREFIX_COMMAND}stop'** or **'${process.env.PREFIX_COMMAND}stp'**\r
                    **${process.env.PREFIX_COMMAND}autoplay**: to set autoplay.\r
                    example => **'${process.env.PREFIX_COMMAND}autoplay true'** or **'${process.env.PREFIX_COMMAND}ap true'**\r
                    `
            }
        ],
        footer: { text: "2/3" }
    },
    {
        title: "Slash Command List", 
        field: [
            {
                name: " ",
                value:  
                    `
                    **/afk**: to announce your afk status\r
                    **/clear**: to clear messages\r
                    **/decode**: to decode your secret code\r
                    **/embed**: to create embed message\r
                    **/event**: to add discord schedule event\r
                    **/ping**: to test bot ping\r
                    **/poll**: to create poll\r
                    `
            }
        ],
        footer: { text: "3/3" }
    }
]

export default command