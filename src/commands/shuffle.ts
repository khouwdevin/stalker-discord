import { getPlayerData, sendTimedMessage, setPlayerDB } from '../functions'
import logger from '../logger'
import { Command } from '../types'
import { EmbedBuilder, TextChannel } from 'discord.js'

const command: Command = {
  name: 'shuffle',
  execute: async (message, args) => {
    try {
      logger.debug('[Shuffle Command]: Run shuffle command')

      const shuffle = args[1]

      if (!message.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      if (!shuffle || (shuffle !== 'true' && shuffle !== 'false'))
        return sendTimedMessage(
          'Shuffle configuration is not valid!',
          message.channel as TextChannel,
          5000
        )
      if (!message.guildId || !message.member)
        return sendTimedMessage(
          'An error occurred!',
          message.channel as TextChannel,
          5000
        )
      if (!message.member.voice.channelId)
        return sendTimedMessage(
          `${message.member} is not joining any channel!`,
          message.channel as TextChannel,
          5000
        )

      const client = message.client
      const channel = message.channel
      const player = client.moon.players.get(message.guildId)

      if (!player)
        return sendTimedMessage(
          `${message.member} Stalker music is not active!`,
          channel as TextChannel,
          5000
        )
      if (player.queue.size < 1)
        return sendTimedMessage(
          `${message.member} there's no track in queue, can't do shuffle!`,
          channel as TextChannel,
          5000
        )
      if (message.member.voice.channelId !== player.voiceChannelId)
        return sendTimedMessage(
          `${message.member} isn't joining in a same voice channel!`,
          channel as TextChannel,
          5000
        )

      const shuffled = shuffle === 'true' ? true : false
      player.set('shuffle', shuffled)
      await setPlayerDB(message.guildId, 'shuffle', shuffled)

      const playerData = getPlayerData(
        player.autoPlay,
        player.volume,
        player.loop,
        shuffled
      )

      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Player Updated',
          iconURL: client.user.avatarURL() || undefined,
        })
        .setFields({ name: ' ', value: playerData })
        .setFooter({ text: 'STALKER MUSIC' })
        .setColor('Purple')
      channel.send({ embeds: [embed] })

      logger.trace(
        `[Shuffle Command]: Shuffle is changed to ${playerData} on guild ${message.guildId}`
      )
    } catch (e) {
      logger.error(
        `[Shuffle Command]: ❌ Failed to configure shuffle : ${e.message}`
      )
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: [],
}

export default command
