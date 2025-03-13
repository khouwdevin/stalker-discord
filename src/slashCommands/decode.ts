import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js'
import { SlashCommand } from '../types'
import { getDecode } from '../functions'
import logger from '../logger'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('decode')
    .setDescription('Decode your secret message here!'),
  execute: async (interaction) => {
    try {
      logger.debug('[Decode Slash Command]: Run decode slash command')

      const modal = new ModalBuilder().setCustomId('decode').setTitle('Decode')

      const decodeInput = new TextInputBuilder()
        .setCustomId('codeInput')
        .setLabel('Put your code here!')
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)

      const firstActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(decodeInput)

      modal.addComponents(firstActionRow)

      await interaction.showModal(modal)
    } catch (e) {
      logger.error(
        `[Decode Slash Command]: ❌ Failed to launch decode modal : ${e.message}`
      )
    }
  },
  modal: async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true })

      const code = interaction.fields.getTextInputValue('codeInput')
      const result = getDecode(code)

      await interaction.editReply({ content: result })
    } catch (e) {
      logger.error(`[Decode Slash Command]: ❌ Failed to decode : ${e.message}`)
    }
  },
}

export default command
