import { SlashCommandBuilder, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, ChannelType } from "discord.js"
import { SlashCommand } from "../types";
import { getDateChoices, getTimeChoices } from "../functions";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("event")
        .addStringOption(options => {
            return options
                .setName("title")
                .setDescription("Set your title for the event.")
                .setMaxLength(400)
                .setRequired(true)
        })
        .addStringOption(options => {
            return options
                .setName("description")
                .setDescription("Set your description for the event.")
                .setMaxLength(1000)
                .setRequired(true)
        })
        .addChannelOption(options => {
            return options
                .setName("channel")
                .setDescription("Set channel where event will be held.")
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        })
        .addStringOption(options => {
            const date = getDateChoices()
            date.map((value) => options.addChoices({ name: value, value: value }))

            return options
                .setName("startdate")
                .setDescription("Set date when event will be held.")
                .setRequired(true)
        })
        .addStringOption(options => {
            const time = getTimeChoices()
            time.map((value) => options.addChoices({ name: value, value: value }))

            return options
                .setName("starttime")
                .setDescription("Set time when event will start.")
                .setRequired(true)
        })
        .addStringOption(options => {
            const time = getTimeChoices()
            time.map((value) => options.addChoices({ name: value, value: value }))
            
            return options
                .setName("dayornight")
                .setDescription("Set time when event will start.")
                .setChoices(
                    { name: "AM", value: "AM" },
                    { name: "PM", value: "PM" }
                )
                .setRequired(true)
        })
        .setDescription("Create event using slash command")
    ,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true })

        if (!interaction.options.data){
            await interaction.editReply("Something gone wrong!")
            return
        }

        const title = interaction.options.data[0].value
        const description = interaction.options.data[1].value
        const channel = interaction.options.data[2].value
        const date = interaction.options.data[3].value
        const hour = interaction.options.data[4].value
        const ampm = interaction.options.data[5].value

        const finalhour = ampm === "AM" ? hour : parseInt(`${hour}`) + 12

        const finaldate = `${date} ${finalhour}:00:00`

        await interaction.guild?.scheduledEvents.create({
            name: `${title}`,
            description: `${description}`,
            channel: `${channel}`,
            scheduledStartTime: new Date(`${finaldate}`),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice,
        })

        await interaction.editReply("Your event has been posted!")
    },
    cooldown: 5
}

export default command