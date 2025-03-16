import { Command } from '../types'
import { setGuildOption } from '../functions'
import { EmbedBuilder } from 'discord.js'
import logger from '../logger'

const command: Command = {
  name: 'notify',
  execute: async (message, args) => {
    try {
      logger.debug('[Notify Command]: Run notify command')

      const notify = args[1]
      const channel = message.channel

      if (!message.channel.isSendable() || !channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      if (!notify) return message.channel.send('No status is provided')
      if (notify !== 'true' && notify !== 'false')
        return message.channel.send('Please provide only true or false!')
      if (!message.guild) {
        return message.channel.send('Some error is occurred!')
      }

      await setGuildOption(message.guild, 'notify', notify === 'true')

      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Stalker Notify',
          iconURL: message.client.user.avatarURL() || undefined,
        })
        .setFields({
          name: ' ',
          value: `Channel config successfully changed  to **${notify}**!`,
        })
        .setColor('Blurple')
      channel.send({ embeds: [embed] })

      logger.trace(`[Notify Command]: Notify is changed to ${notify}`)
    } catch (e) {
      logger.error(
        `[Notify Command]: ❌ Failed to configure notify : ${e.message}`
      )
    }
  },
  cooldown: 5,
  permissions: ['Administrator'],
  aliases: ['n'],
}

export default command
