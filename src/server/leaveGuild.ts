import { EmbedBuilder, Message } from 'discord.js'
import logger from '../logger'

export const leaveGuild = async (message: Message, guilds: string[]) => {
  try {
    if (guilds.length <= 0) {
      logger.debug(`[Leave Guild Command]: No guilds is provided`)
      return
    }

    const client = message.client

    const embedProcess = new EmbedBuilder().setAuthor({
      name: 'Processing...',
      iconURL: client.user.avatarURL() || undefined,
    })

    const processMessage = await message.author.send({
      embeds: [embedProcess],
    })

    await processMessage.delete()

    for (const guildId of guilds) {
      const guild = await client.guilds.fetch(guildId)
      await guild.leave()

      logger.trace(`[Leave Guild Command]: Leaving guild ${guild.id}`)

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Stalker bot has exited ${guild.name}`,
          iconURL: client.user.avatarURL() || undefined,
        })
        .setColor('Purple')

      await message.author.send({ embeds: [embed] })
    }
  } catch (e) {
    logger.error(`[Leave Guild Command]: Get guild error ${e.message}`)
  }
}
