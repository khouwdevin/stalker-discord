import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { getDecode } from "../functions";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("decode")
    .setDescription("Decode your secret message here!")
    ,
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId("decode")
            .setTitle("Decode")

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('codeInput')
			.setLabel("Put your code here!")
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(hobbiesInput);

		modal.addComponents(firstActionRow);

		await interaction.showModal(modal);
    },
    modal: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.fields.getTextInputValue('codeInput');
        const result = getDecode(code)

        await interaction.editReply({ content: result })
    },
    cooldown: 2
}

export default command