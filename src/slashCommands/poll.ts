import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import PollModel from "../schemas/Poll";

const emojies = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

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
        .setName("option5")
        .setDescription("Add option 5 of 5")
        .setMaxLength(150)
    })
    .setDescription("To create polling"),
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true })

        if (!interaction.channel) return

        const buttons: ButtonBuilder[] = []

        const guildid = interaction.guildId
        const channel = interaction.channel
        const options = interaction.options.data
        

        const newPoll = new PollModel({
            guildID: guildid
        })

        for (let i = 1; i < options.length; i++) {
            newPoll.pollResult[i - 1] = 0

            buttons.push(
                new ButtonBuilder()
                    .setEmoji(emojies[i - 1])
                    .setLabel(`${options[i].value}`)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`poll.${newPoll._id}.${i}`)
            )
        }

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)

        const embed = new EmbedBuilder()
            .setTitle(`Poll for *${options[0].value}*`)        
            .setColor("Blue")

        for (let i = 1; i < options.length; i++) {
            embed.addFields(
                { name: `${options[i].value}`, value: `${emojies[i - 1]} 0 (0.0%)` }
            )
        }

        const message = await channel.send({ embeds: [embed], components: [buttonsRow] })

        newPoll.messageID = message.id

        await newPoll.save()

        await interaction.editReply("Poll sent successfully!")
    },
    button: async (interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const [type, pollID, optionString] = interaction.customId.split(".")
        const targetPoll = await PollModel.findOne({ _id: pollID })

        if (!interaction.channel) return
        if (!targetPoll) return

        const option = parseInt(optionString)
        const userID = `${interaction.user.id}.option${option}`

        for (let i = 0; i < targetPoll.pollResult.length; i++) {
            if (i === (option - 1)) {
                if (targetPoll.usersID.includes(userID)) {
                    targetPoll.pollResult[option - 1] = targetPoll.pollResult[option - 1] - 1

                    const index = targetPoll.usersID.indexOf(userID)
                    targetPoll.usersID.splice(index, 1)

                    const targetMessage = await interaction.channel.messages.fetch(targetPoll.messageID)
                    const targetMessageEmbed = targetMessage.embeds[0]

                    for (let i = 0; i < targetPoll.pollResult.length; i++) {
                        const userLength = targetPoll.usersID.length < 1 ? 1 : targetPoll.usersID.length
                        const percentage = (targetPoll.pollResult[i] / userLength) * 100

                        targetMessageEmbed.fields[i].value = `${emojies[i]} ${targetPoll.pollResult[i]} (${percentage}%)`
                    }

                    await targetMessage.edit({
                        embeds: [targetMessageEmbed],
                        components: [targetMessage.components[0]]
                    })

                    await targetPoll.save()

                    return await interaction.editReply("Your poll has been removed!")
                }

                targetPoll.pollResult[option - 1] = targetPoll.pollResult[option - 1] + 1

                targetPoll.usersID = [...targetPoll.usersID, userID]

                const targetMessage = await interaction.channel.messages.fetch(targetPoll.messageID)
                const targetMessageEmbed = targetMessage.embeds[0]

                for (let i = 0; i < targetPoll.pollResult.length; i++) {
                    const percentage = (targetPoll.pollResult[i] / targetPoll.usersID.length) * 100

                    const value = targetMessageEmbed.fields[i].value.split(" ")[4]

                    targetMessageEmbed.fields[i].value = `${emojies[i]} ${targetPoll.pollResult[i]} votes for ${value} (${percentage}%)`
                }

                await targetMessage.edit({
                    embeds: [targetMessageEmbed],
                    components: [targetMessage.components[0]]
                })

                await targetPoll.save()

                return await interaction.editReply("Poll sent successfully!")
            }
        }

        await interaction.editReply("Some error occured!")
    },
    cooldown: 2
}

export default command;