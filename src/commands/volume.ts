import { getPlayerData, sendTimedMessage } from '../functions'
import logger from '../logger'
import { Command } from '../types'
import { EmbedBuilder, TextChannel } from 'discord.js'

const command: Command = {
  name: 'volume',
  execute: async (message, args) => {
    try {
      logger.debug('[Volume Command]: Run volume command')

      const volume = parseInt(args[1])

      if (!volume || volume < 0 || volume > 100)
        return sendTimedMessage(
          'Volume configuration is not valid!',
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
      if (!player.playing)
        return sendTimedMessage(
          `${message.member} Can't change volume while player is paused!`,
          channel as TextChannel,
          5000
        )
      if (message.member.voice.channelId !== player.voiceChannelId)
        return sendTimedMessage(
          `${message.member} isn't joining in a same voice channel!`,
          channel as TextChannel,
          5000
        )

      await player.setVolume(volume)

      const playerData = getPlayerData(
        player.autoPlay,
        volume,
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

      logger.trace(`[Volume Command]: Volume is changed to ${playerData}`)
    } catch (e) {
      const client = message.client
      logger.error(
        `[Volume Command]: ❌ Failed to configure volume : ${e.message}`
      )
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['vol'],
}

export default command
