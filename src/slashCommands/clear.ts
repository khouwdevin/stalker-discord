import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../types'
import logger from '../logger'

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delets messages from the current channel.')
    .addIntegerOption((option) => {
      return option
        .setMaxValue(100)
        .setMinValue(1)
        .setName('messagecount')
        .setDescription('Message amount to be cleared')
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: (interaction) => {
    logger.debug('[Clear Slash Command]: Run clear slash command')

    let messageCount = Number(interaction.options.get('messagecount')?.value)
    interaction.channel?.messages
      .fetch({ limit: messageCount })
      .then(async (msgs) => {
        if (!interaction.channel) return
        if (
          interaction.channel.type === ChannelType.DM ||
          !interaction.channel.isSendable()
        )
          return

        try {
          const deletedMessages = await interaction.channel.bulkDelete(
            msgs,
            true
          )
          if (deletedMessages?.size === 0)
            interaction.reply('No messages were deleted.')
          else
            interaction.reply(
              `Successfully deleted ${deletedMessages?.size} message(s)`
            )
          setTimeout(async () => await interaction.deleteReply(), 5000)
        } catch (e) {
          logger.error(
            `[Clear Slash Command]: ❌ Failed to delete messages : ${e.message}`
          )
        }
      })
      .catch((e) =>
        logger.error(
          `[Clear Slash Command]: ❌ Failed to fetch clear slash command : ${e.message}`
        )
      )
  },
  cooldown: 10,
}

export default ClearCommand
