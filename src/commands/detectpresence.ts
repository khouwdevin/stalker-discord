import { Command } from '../types'
import { setGuildOption } from '../functions'
import { EmbedBuilder } from 'discord.js'
import logger from '../logger'

const command: Command = {
  name: 'detectpresence',
  execute: async (message, args) => {
    try {
      logger.debug('[Detect Presence Command]: Run detect presence command')

      const detectpresence = args[1]
      const channel = message.channel

      if (!message.channel.isSendable() || !channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      if (!detectpresence) return message.channel.send('No status is provided!')
      if (detectpresence !== 'true' && detectpresence !== 'false')
        return message.channel.send('Please provide only true or false!')
      if (!message.guild) {
        return message.channel.send('Some error is occurred!')
      }

      await setGuildOption(
        message.guild,
        'detectpresence',
        detectpresence === 'true'
      )

      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Detect Presence',
          iconURL: message.client.user.avatarURL() || undefined,
        })
        .setFields({
          name: ' ',
          value: `Detect presence successfully changed to **${detectpresence}**!`,
        })
        .setColor('Blurple')
      channel.send({ embeds: [embed] })

      logger.trace(
        `[Detect Presence Command]: Detect presence changed to ${detectpresence}`
      )
    } catch (e) {
      logger.error(
        `[Detect Presence Command]: ❌ Failed to configure detect presence : ${e.message}`
      )
    }
  },
  cooldown: 5,
  permissions: ['Administrator'],
  aliases: ['dp'],
}

export default command
