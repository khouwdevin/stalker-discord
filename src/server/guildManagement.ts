import { EmbedBuilder, User } from 'discord.js'
import logger from '../logger'

export const getGuildList = async (user: User) => {
  try {
    const embedProcess = new EmbedBuilder().setAuthor({
      name: 'Processing...',
      iconURL: user.client.user.avatarURL() || undefined,
    })

    const processMessage = await user.send({
      embeds: [embedProcess],
    })

    const client = user.client
    const guilds = await client.guilds.fetch()

    await processMessage.delete()

    if (guilds.size <= 0) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'No guild',
          iconURL: client.user.avatarURL() || undefined,
        })
        .setColor('Purple')

      await user.send({ embeds: [embed] })
    } else {
      for (const guild of guilds.values()) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: guild.name,
            iconURL: guild.iconURL() || undefined,
          })
          .setFields([
            {
              name: ' ',
              value: `id : ${guild.id}`,
            },
            {
              name: ' ',
              value: `verfied : ${guild.verified}`,
            },
          ])
          .setColor('Purple')

        await user.send({ embeds: [embed] })
      }
    }
  } catch (e) {
    logger.error(`[Guild Management Command]: Get guild error ${e.message}`)
  }
}
