import logger from '../logger'
import { EmbedBuilder, Message } from 'discord.js'

const loggerLevel = (message: Message, args: string) => {
  try {
    logger.debug('[Logger Command]: Run logger command.')

    const loggerLevel = args

    if (
      loggerLevel !== 'info' &&
      loggerLevel !== 'trace' &&
      loggerLevel !== 'debug'
    ) {
      logger.trace('[Logger Command]: Logger level is not valid')

      return
    }

    logger.level = loggerLevel

    const author = message.author
    const client = message.client

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Player Updated',
        iconURL: client.user.avatarURL() || undefined,
      })
      .setFields({
        name: ' ',
        value: `Logger level is changed to ${loggerLevel}`,
      })
      .setFooter({ text: 'STALKER LOGGER' })
      .setColor('Purple')

    author.send({ embeds: [embed] })
  } catch (e) {
    logger.error(
      `[Logger Command]: ❌ Failed to configure logger: ${e.message}`,
    )
  }
}

export default loggerLevel
