import { color, getPlayerData, sendTimedMessage } from '../functions'
import { Command } from '../types'
import { EmbedBuilder, TextChannel } from 'discord.js'

const command: Command = {
  name: 'autoplay',
  execute: async (message, args) => {
    try {
      const autoplay = args[1]

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

      const playerData = getPlayerData(
        autoPlay,
        player.volume,
        player.loop,
        player.shuffled
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
      console.log(
        color(
          'text',
          `❌ Failed to configure autoplay : ${color('error', e.message)}`
        )
      )
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['ap', 'auto'],
}

export default command
