import {
  formattedTime,
  getPlayerDB,
  sendMessage,
  sendTimedMessage,
} from '../functions'
import logger from '../logger'
import { Command } from '../types'
import { EmbedBuilder, TextChannel, resolveColor } from 'discord.js'

const command: Command = {
  name: 'playfirst',
  execute: async (message, args) => {
    try {
      logger.debug('[Play First First Command]: Run Play First command')

      const title = args.slice(1, args.length).join(' ')

      if (!message.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      if (!title)
        return sendTimedMessage(
          'Please provide a title!',
          message.channel as TextChannel,
          5000
        )
      if (!message.guild || !message.guildId || !message.member)
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
      let player = client.moon.players.has(message.guildId)
        ? client.moon.players.get(message.guildId)
        : null

      if (!player) {
        const playerOptions = await getPlayerDB(message.guildId)

        player = client.moon.players.create({
          guildId: message.guildId,
          voiceChannelId: message.member.voice.channelId,
          textChannelId: message.channel.id,
          autoPlay: Boolean(playerOptions.autoPlay),
          volume: Number(playerOptions.volume),
          loop: playerOptions.loop,
        })

        const playerData = `
                      autoplay: **${player.autoPlay}**\r
                      volume: **${player.volume}**\r
                      loop: **${playerOptions.loop}**\r
                      shufle: **${player.shuffle()}**
                  `

        const embed = new EmbedBuilder()
          .setAuthor({
            name: 'Player Created',
            iconURL: client.user.avatarURL() || undefined,
          })
          .setFields({ name: ' ', value: playerData })
          .setFooter({ text: 'STALKER MUSIC' })
          .setColor('Purple')

        message.channel.send({ embeds: [embed] })
        client.playerAttempts.set(`${player.guildId}`, 3)
      }

      const embedProcess = new EmbedBuilder().setAuthor({
        name: 'Processing...',
        iconURL: client.user.avatarURL() || undefined,
      })
      const processMessage = await message.channel.send({
        embeds: [embedProcess],
      })

      const res = await client.moon.search({
        query: title,
        requester: message.member.id,
      })

      switch (res.loadType) {
        case 'error':
          return sendMessage(
            `${message.member} failed to load song!`,
            message.channel as TextChannel
          )
        case 'empty':
          return sendMessage(
            `${message.member} no title matches!`,
            message.channel as TextChannel
          )
        case 'playlist':
          const embedPlaylist = new EmbedBuilder()
            .setAuthor({
              name: '$playfirst does not support playlist, please use $play instead!',
              iconURL: message.client.user.avatarURL() || undefined,
            })
            .setColor('Grey')
          message.channel.send({ embeds: [embedPlaylist] })

          break
        default:
          const embedSong = new EmbedBuilder()
            .setAuthor({
              name: `[${res.tracks[0].title}] is added to the front of waiting list!`,
              iconURL: message.client.user.avatarURL() || undefined,
            })
            .setColor('Yellow')
          message.channel.send({ embeds: [embedSong] })

          logger.trace(
            `[Play First First Command]: Song is added to queue ${res.tracks[0].title}`
          )

          const tracks = player.queue.tracks
          player.queue.clear()
          player.queue.add(res.tracks[0])

          for (const track of tracks) {
            const addStatus = player.queue.add(track)
            logger.trace(
              `[Play First First Command]: Songs are readded to queue ${track.title} is ${addStatus}`
            )
          }

          break
      }

      if (client.timeouts.has(`player-${player.guildId}`)) {
        clearTimeout(client.timeouts.get(`player-${player.guildId}`))
        client.timeouts.delete(`player-${player.guildId}`)
      }

      await processMessage.delete()

      if (
        player.connected &&
        player.voiceChannelId !== message.member.voice.channelId
      ) {
        player.setVoiceChannelId(message.member.voice.channelId)

        const connectStatus = player.connect({
          setDeaf: true,
          setMute: false,
        })

        logger.trace(
          `[Play Command]: Connect is ${connectStatus} to ${message.member.voice.channelId}`
        )
      } else if (!player.connected) {
        const connectStatus = player.connect({
          setDeaf: true,
          setMute: false,
        })

        logger.trace(
          `[Play Command]: Connect is ${connectStatus} to ${message.member.voice.channelId}`
        )
      }

      if (!player.playing) await player.play()
    } catch (e) {
      logger.error(
        `[Play First Command]: ❌ Failed to Play First music : ${e.message}`
      )
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['pf'],
}

export default command
