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
  name: 'play',
  execute: async (message, args) => {
    try {
      logger.debug('[Play Command]: Run play command')

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

        if (message.channel.isSendable())
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
          await processMessage.delete()
          logger.error('[Play Command]: ❌ Search song error')

          if (player && !player.playing) {
            player.stop()
            player.disconnect()
            player.destroy()

            const deleteTimeout = client.timeouts.delete(
              `player-${player.guildId}`
            )
            const deletePlayerAttemps = client.playerAttempts.delete(
              `player-${player.guildId}`
            )
            const deleteMoonPlayer = client.moon.players.delete(player.guildId)

            logger.trace(
              `[Play Command]: Delete client timeout ${player.guildId} : ${deleteTimeout}`
            )
            logger.trace(
              `[Play Command]: Delete player attempts ${player.guildId} : ${deletePlayerAttemps}`
            )
            logger.trace(
              `[Play Command]: Delete moon player ${player.guildId} : ${deleteMoonPlayer}`
            )
          }

          return sendMessage(
            `${message.member} failed to load song!`,
            message.channel as TextChannel
          )
        case 'empty':
          await processMessage.delete()
          logger.debug('[Play Command]: Message is empty')

          if (player && !player.playing) {
            player.stop()
            player.disconnect()
            player.destroy()

            const deleteTimeout = client.timeouts.delete(
              `player-${player.guildId}`
            )
            const deletePlayerAttemps = client.playerAttempts.delete(
              `player-${player.guildId}`
            )
            const deleteMoonPlayer = client.moon.players.delete(player.guildId)

            logger.trace(
              `[Play Command]: Delete client timeout ${player.guildId} : ${deleteTimeout}`
            )
            logger.trace(
              `[Play Command]: Delete player attempts ${player.guildId} : ${deletePlayerAttemps}`
            )
            logger.trace(
              `[Play Command]: Delete moon player ${player.guildId} : ${deleteMoonPlayer}`
            )
          }

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
                value: `${formattedTime(res.playlistInfo?.duration ?? 0)}`,
              }
            )
            .setColor(color)
            .setImage(imageUrl)
          message.channel.send({ embeds: [embedPlaylist] })

          for (const track of res.tracks) {
            const addStatus = player.queue.add(track)
            logger.trace(
              `[Play Command]: Add ${track.title} from playlist ${res.playlistInfo.name} is ${addStatus}`
            )
          }

          break
        default:
          const embedSong = new EmbedBuilder()
            .setAuthor({
              name: `[${res.tracks[0].title}] is added to the waiting list!`,
              iconURL: message.client.user.avatarURL() || undefined,
            })
            .setColor('Yellow')
          message.channel.send({ embeds: [embedSong] })

          if (player.loop === 'track') {
            player.queue.clear()

            const embedPlay = new EmbedBuilder()
              .setAuthor({
                name: `Now in loop playing [${res.tracks[0].title}]`,
                iconURL: client.user?.avatarURL() || undefined,
              })
              .setColor('Green')

            message.channel.send({ embeds: [embedPlay] })
          }

          logger.trace(
            `[Play Command]: Add ${res.tracks[0].title} to the queue`
          )
          player.queue.add(res.tracks[0])

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

        logger.debug(
          `[Play Command]: Player is connected and move to ${message.member.voice.channelId}`
        )
        logger.trace(
          `[Play Command]: Connecting is ${connectStatus} to ${message.member.voice.channelId}`
        )
      } else if (!player.connected) {
        const connectStatus = player.connect({
          setDeaf: true,
          setMute: false,
        })

        logger.debug(
          `[Play Command]: Player is not connected and connect to ${message.member.voice.channelId}`
        )
        logger.trace(
          `[Play Command]: Connecting is ${connectStatus} to ${message.member.voice.channelId}`
        )
      }

      if (!player.playing) await player.play()
    } catch (e) {
      logger.error(`[Play Command]: ❌ Failed to play music : ${e.message}`)
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: ['p'],
}

export default command
