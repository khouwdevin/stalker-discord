import { SlashCommandBuilder, GuildMember } from 'discord.js'
import { SlashCommand } from '../types'
import logger from '../logger'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('afk')
    .addBooleanOption((options) => {
      return options
        .setName('afk')
        .setDescription("Are you afk 'true' or 'false'")
        .setRequired(true)
    })
    .addIntegerOption((options) => {
      return options
        .setName('time')
        .setDescription('For how many long? (minutes)')
        .setMinValue(1)
        .setRequired(false)
    })
    .setDescription('Tell your friend if you are going to AFK.'),
  execute: async (interaction) => {
    try {
      logger.debug('[AFK Slash Command]: Run afk slash command')

      if (interaction.channel && !interaction.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      await interaction.deferReply({ flags: ['Ephemeral'] })

      if (!interaction.channel)
        return logger.error(
          '[AFK Slash Command]: ❌ Failed to execute AFK slash command : channel unavailable'
        )

      const options = interaction.options.data
      const minutes = options.length > 1 ? options[1].value : 'unknown'

      const member = interaction.member as GuildMember
      const isAFK = options[0].value as boolean

      if (isAFK) {
        await interaction.channel?.send(
          `${member} is AFK for ${minutes} minutes`
        )
        await member.setNickname(`[AFK]${member.user.displayName}`)

        logger.trace(
          `[AFK Slash Command]: Set AFK for ${member.user.displayName}`
        )
      } else {
        await interaction.channel?.send(`${member} is not AFK`)
        await member.setNickname(member.user.displayName.replace('[AFK]', ''))

        logger.trace(
          `[AFK Slash Command]: Set not AFK for ${member.user.displayName}`
        )
      }

      await interaction.editReply('Your command is successfully ran!')
    } catch (e) {
      await interaction.editReply('Error occured!')
      return logger.error(
        `[AFK Slash Command]: ❌ Failed to execute AFK slash command : ${e.message}`
      )
    }
  },
}

export default command
