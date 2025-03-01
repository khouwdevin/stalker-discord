import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import { color, getDecode } from "../functions";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("decode")
    .setDescription("Decode your secret message here!"),
  execute: async (interaction) => {
    try {
      const modal = new ModalBuilder().setCustomId("decode").setTitle("Decode");

      const decodeInput = new TextInputBuilder()
        .setCustomId("codeInput")
        .setLabel("Put your code here!")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph);

      const firstActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(decodeInput);

      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);
    } catch (e) {
      console.log(
        color(
          "text",
          `❌ Failed to launch decode modal : ${color("error", e.message)}`,
        ),
      );
    }
  },
  modal: async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const code = interaction.fields.getTextInputValue("codeInput");
      const result = getDecode(code);

      await interaction.editReply({ content: result });
    } catch (e) {
      console.log(
        color("text", `❌ Failed to decode : ${color("error", e.message)}`),
      );
    }
  },
};

export default command;
