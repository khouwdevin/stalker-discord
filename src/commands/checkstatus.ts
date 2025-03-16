import { EmbedBuilder } from 'discord.js'
import { Command } from '../types'
import { getAllGuildOption } from '../functions'
import logger from '../logger'

const command: Command = {
  name: 'checkstatus',
  execute: async (message, args) => {
    try {
      logger.debug('[Check Status Command]: Run check status command')

      if (!message.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }
      if (!message.guild) return

      const guildoptions = await getAllGuildOption(message.guild)
      if (!guildoptions) return

      const options = guildoptions

      const statuslist = `
                **detect presence**: ${options?.detectpresence}\r
                **notify**: ${options?.notify}\r
                **channel**: <#${options?.channel}>
                `

      const embed = new EmbedBuilder()
        .setTitle("Here's the list")
        .setColor('Blurple')
        .addFields(
          { name: 'Status List', value: ' ' },
          { name: ' ', value: statuslist }
        )
      message.channel.send({ embeds: [embed] })

      logger.trace(
        `[Check Status Command]: Check Stalker Bot status ${statuslist}`
      )
    } catch (e) {
      logger.error(
        `[Check Status Command]: ❌ Failed to show check status : ${e.message}`
      )
    }
  },
  cooldown: 5,
  aliases: ['cs'],
  permissions: [],
}

export default command
