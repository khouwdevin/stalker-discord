import { getPlayerData, sendTimedMessage, setPlayerDB } from '../functions'
import logger from '../logger'
import { Command } from '../types'
import { EmbedBuilder, TextChannel } from 'discord.js'

const command: Command = {
  name: 'autoplay',
  execute: async (message, args) => {
    try {
      logger.debug('[Autoplay Command]: Run autoplay command.')

      const autoplay = args[1]

      if (!message.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      if (!autoplay || (autoplay !== 'true' && autoplay !== 'false'))
        return sendTimedMessage(
          'Autoplay configuration is not valid!',
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
      if (message.member.voice.channelId !== player.voiceChannelId)
        return sendTimedMessage(
          `${message.member} isn't joining in a same voice channel!`,
          channel as TextChannel,
          5000
        )

      const autoPlay = autoplay === 'true' ? true : false
      player.setAutoPlay(autoPlay)
      await setPlayerDB(message.guildId, 'autoPlay', autoPlay)

      const playerData = getPlayerData(
        autoPlay,
        player.volume,
        player.loop,
        player.shuffle()
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
    } catch (e) {
      logger.error(
        `[Autoplay Command]: ❌ Failed to configure autoplay : ${e.message}`
      )
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['ap', 'auto'],
}

export default command
