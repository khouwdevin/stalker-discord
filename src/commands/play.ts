import {
  color,
  getLoopString,
  getPlayerDB,
  sendMessage,
  sendTimedMessage,
} from '../functions'
import { Command } from '../types'
import { EmbedBuilder, TextChannel, resolveColor } from 'discord.js'

const command: Command = {
  name: 'play',
  execute: async (message, args) => {
    try {
      const title = args.slice(1, args.length).join(' ')
      let loopPlayer = -1

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

      let player = client.moon.players.get(message.guildId)

      if (!player) {
        const playerOptions = await getPlayerDB(message.guildId)
        loopPlayer = Number(playerOptions.loop)

        player = client.moon.players.create({
          guildId: message.guildId,
          voiceChannelId: message.member.voice.channelId,
          textChannelId: message.channel.id,
          autoPlay: Boolean(playerOptions.autoPlay),
          volume: Number(playerOptions.volume),
        })

        player.setLoop(Number(playerOptions.loop))

        const playerData = `
                    autoplay: **${player.autoPlay}**\r
                    volume: **${player.volume}**\r
                    loop: **${getLoopString(Number(playerOptions.loop))}**\r
                    shufle: **${player.shuffled}**
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
        client.attempts.set(`${player.guildId}`, 3)
      } else {
        client.attempts.set(`${player.guildId}`, 3)
        loopPlayer = player.loop ?? 2
      }

      const embedProcess = new EmbedBuilder().setAuthor({
        name: 'Processing...',
        iconURL: client.user.avatarURL() || undefined,
      })
      const processMessage = await message.channel.send({
        embeds: [embedProcess],
      })

      const res = await client.moon.search({ query: title })

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
          let imageUrl = null
          let color = resolveColor('Red')
          if (title.includes('spotify')) {
            const resThumbnail = await fetch(
              `https://open.spotify.com/oembed?url=${title}`
            )
            const data = await resThumbnail.json()
            imageUrl = data.thumbnail_url
            color = resolveColor('Green')
          }
          const embedPlaylist = new EmbedBuilder()
            .setFields(
              { name: `Added Playlist`, value: ' ' },
              {
                name: 'Playlist',
                value: `${res.playlistInfo?.name || 'No title'}`,
              },
              {
                name: 'Playlist duration',
                value: `${res.playlistInfo?.duration || '-'}`,
              }
            )
            .setColor(color)
            .setImage(imageUrl)
          message.channel.send({ embeds: [embedPlaylist] })

          for (const track of res.tracks) {
            player.queue.add(track)
          }

          break
        default:
          player.queue.add(res.tracks[0])

          const embedSong = new EmbedBuilder()
            .setAuthor({
              name: `[${res.tracks[0].title}] was added to the waiting list!`,
              iconURL: message.client.user.avatarURL() || undefined,
            })
            .setColor('Yellow')
          message.channel.send({ embeds: [embedSong] })

          if (loopPlayer === 1) {
            const embedPlay = new EmbedBuilder()
              .setAuthor({
                name: `Now in loop playing [${res.tracks[0].title}]`,
                iconURL: client.user?.avatarURL() || undefined,
              })
              .setColor('Green')

            message.channel.send({ embeds: [embedPlay] })
          }

          break
      }

      if (client.timeouts.has(`player-${player.guildId}`)) {
        clearTimeout(client.timeouts.get(`player-${player.guildId}`))
        client.timeouts.delete(`player-${player.guildId}`)
      }

      await processMessage.delete()

      if (!player.connected) {
        player.connect({
          setDeaf: true,
          setMute: false,
        })
      }

      if (player && player.voiceChannelId !== message.member.voice.channelId) {
        player.setVoiceChannelId(message.member.voice.channelId)

        player.connect({
          setDeaf: true,
          setMute: false,
        })
      }

      if (!player.playing) await player.play()
    } catch (e) {
      console.log(
        color('text', `❌ Failed to play music : ${color('error', e.message)}`)
      )
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['p'],
}

export default command
