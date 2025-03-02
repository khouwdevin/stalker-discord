import chalk from 'chalk'
import {
  ChannelManager,
  ChannelType,
  Client,
  Guild,
  GuildMember,
  Message,
  PermissionFlagsBits,
  PermissionResolvable,
  TextChannel,
} from 'discord.js'
import GuildDB from './schemas/Guild'
import PlayerDB from './schemas/Player'
import { GuildOption, PlayerOptions } from './types'
import mongoose from 'mongoose'
import { WebSocket } from 'ws'

type colorType = 'text' | 'variable' | 'error'

const themeColors = {
  text: '#ff8e4d',
  variable: '#ff624d',
  error: '#f5426c',
}

export const getThemeColor = (color: colorType) =>
  Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
  return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (
  member: GuildMember,
  permissions: Array<PermissionResolvable>
) => {
  let neededPermissions: PermissionResolvable[] = []
  permissions.forEach((permission) => {
    if (!member.permissions.has(permission)) neededPermissions.push(permission)
  })
  if (neededPermissions.length === 0) return null
  return neededPermissions.map((p) => {
    if (typeof p === 'string') return p.split(/(?=[A-Z])/).join(' ')
    else
      return Object.keys(PermissionFlagsBits)
        .find((k) => Object(PermissionFlagsBits)[k] === p)
        ?.split(/(?=[A-Z])/)
        .join(' ')
  })
}

export const sendTimedMessage = (
  message: string,
  channel: TextChannel,
  duration: number
) => {
  channel
    .send(message)
    .then((m) =>
      setTimeout(
        async () =>
          (await channel.messages.fetch(m))
            .delete()
            .catch((e) =>
              console.log(
                color(
                  'text',
                  `❌ Failed to delete message : ${color('error', e.message)}`
                )
              )
            ),
        duration
      )
    )
  return
}

export const sendMessage = (message: string, channel: TextChannel) => {
  channel
    .send(message)
    .catch((e) =>
      console.log(
        color(
          'text',
          `❌ Failed to delete message : ${color('error', e.message)}`
        )
      )
    )
}

export const sendMessageToExistingChannel = (
  channels: ChannelManager,
  message: string
) => {
  for (let i = 0; i < channels.cache.size; i++) {
    const channelGuild = channels.cache.at(i)

    if (!channelGuild) continue
    if (!channelGuild.isTextBased() || channelGuild.isDMBased()) continue

    const channel = channelGuild.guild.systemChannel
      ? channelGuild.guild.systemChannel
      : channelGuild
    return channel
      .send(message)
      .catch((e) =>
        console.log(
          color(
            'text',
            `❌ Failed to send message : ${color('error', e.message)}`
          )
        )
      )
  }
}

export const sendTimedMessageToExistingChannel = (
  channels: ChannelManager,
  message: string,
  duration: number
) => {
  for (let i = 0; i < channels.cache.size; i++) {
    const channelGuild = channels.cache.at(i)

    if (!channelGuild) continue
    if (!channelGuild.isTextBased() || channelGuild.isDMBased()) continue

    const channel = channelGuild.guild.systemChannel
      ? channelGuild.guild.systemChannel
      : channelGuild
    return channel
      .send(message)
      .then((m) => setTimeout(() => m.delete(), duration))
      .catch((e) =>
        console.log(
          color(
            'text',
            `❌ Failed to send message : ${color('error', e.message)}`
          )
        )
      )
  }
}

export const sendNotifyStalkerOnline = async (client: Client) => {
  const guilds = client.guilds.cache

  for (let i = 0; i < guilds.size; i++) {
    const guild = guilds.at(i) as Guild
    const channelId = await getGuildOption(guild, 'channel')
    const notify = await getGuildOption(guild, 'notify')

    if (!notify) continue

    if (channelId === 'default') {
      if (!guild.systemChannel) {
        const channels = guild.channels
        sendTimedMessageToExistingChannel(
          channels,
          "Please add or update default text channel to Stalker's config!",
          10000
        )

        continue
      }

      const channel = guild.systemChannel as TextChannel
      sendTimedMessage('Stalker is back online!', channel, 5000)

      continue
    }
    if (channelId) {
      const channel = guild.channels.cache.find((c) => c.id === channelId)

      if (!channel || channel.type !== ChannelType.GuildText) {
        const channels = guild.channels
        sendTimedMessageToExistingChannel(
          channels,
          "Please add or update default text channel to Stalker's config!",
          10000
        )

        continue
      }

      sendTimedMessage('Stalker is back online!', channel as TextChannel, 5000)

      continue
    }

    const channels = guild.channels.cache

    for (let j = 0; j < channels.size; j++) {
      const channel = channels.at(j)

      if (!channel) continue
      if (channel.type !== ChannelType.GuildText) continue

      sendTimedMessage('Stalker is back online!', channel as TextChannel, 5000)

      break
    }
  }
}

export const notifyToConfigDefaultTextChannel = (channels: ChannelManager) => {
  for (let i = 0; i < channels.cache.size; i++) {
    const channelGuild = channels.cache.at(i)

    if (!channelGuild) continue
    if (!channelGuild.isTextBased() || channelGuild.isDMBased()) continue
    if (!channelGuild.guild.systemChannel)
      return sendTimedMessageToExistingChannel(
        channels,
        "Please add or update default text channel to Stalker's config!",
        10000
      )

    const channel = channelGuild.guild.systemChannel
    return channel
      .send("Please add or update default text channel to Stalker's config!")
      .then((m) => setTimeout(() => m.delete(), 10000))
      .catch(() =>
        console.log(
          color(
            'text',
            `❌ Failed to ${color('error', 'notify config default message')}`
          )
        )
      )
  }
}

export const deleteTimedMessage = (
  message: Message,
  channel: TextChannel,
  duration: number
) => {
  setTimeout(
    async () =>
      (await channel.messages.fetch(message))
        .delete()
        .catch((e) =>
          console.log(
            color(
              'text',
              `❌ Failed to delete message : ${color('error', e.message)}`
            )
          )
        ),
    duration
  )
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
  if (mongoose.connection.readyState === 0)
    return console.log(
      color('text', `❌ Database ${color('error', 'not connected')}`)
    )
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) return null
  return foundGuild.options[option]
}

export const getAllGuildOption = async (guild: Guild) => {
  if (mongoose.connection.readyState === 0)
    return console.log(
      color('text', `❌ Database ${color('error', 'not connected')}`)
    )
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) return null
  return foundGuild.options
}

export const setGuildOption = async (
  guild: Guild,
  option: GuildOption,
  value: any
) => {
  if (mongoose.connection.readyState === 0)
    return console.log(
      color('text', `❌ Database ${color('error', 'not connected')}`)
    )
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) return null
  foundGuild.options[option] = value
  await foundGuild.save()
}

export const getAllGuild = async () => {
  if (mongoose.connection.readyState === 0)
    return console.log(
      color('text', `❌ Database ${color('error', 'not connected')}`)
    )
  const guilds = await GuildDB.find()
  return guilds
}

export const getDateChoices = (): Array<string> => {
  const result: Array<string> = []

  for (let i = 0; i < 8; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const thedate = date.toDateString().split(' ')
    const formateddate = `${thedate[2]} ${thedate[1]} ${thedate[3]}`

    result.push(formateddate)
  }

  return result
}

export const getTimeChoices = (): Array<string> => {
  const result: Array<string> = []

  for (let i = 1; i < 13; i++) {
    if (i < 10) {
      result.push(`0${i}:00`)
    } else {
      result.push(`${i}:00`)
    }
  }

  return result
}

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`1234567890-=~!@#$%^&*()_+[]\\;\',./{}|:"<>?£€¥¢©®™¿¡÷¦¬×§¶°'
const formula =
  '°¶§×¬¦÷¡¿™®©¢¥€£?><":|}{/.,\';\\][+_)(*&^%$#@!~=-0987654321`zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA'

export const getDecode = (code: string): string => {
  const decodestring: string[] = []

  for (let i = 0; i < code.length; i++) {
    if (/\n/.test(code[i]) || /\r/.test(code[i])) {
      decodestring.push('\r')
      continue
    } else if (/\s/.test(code[i])) {
      decodestring.push(' ')
      continue
    }

    for (let j = 0; j < formula.length; j++) {
      if (code[i] === formula[j]) decodestring.push(alphabet[j])
    }
  }

  return decodestring.join('')
}

export const getCode = (text: string): string => {
  const codestring: string[] = []

  for (let i = 0; i < text.length; i++) {
    if (/\n/.test(text[i]) || /\r/.test(text[i])) {
      codestring.push('\r')
      continue
    } else if (/\s/.test(text[i])) {
      codestring.push(' ')
      continue
    }

    for (let j = 0; j < alphabet.length; j++) {
      if (text[i] === alphabet[j]) codestring.push(formula[j])
    }
  }

  return codestring.join('')
}

export const getPlayerDB = async (guildId: string): Promise<PlayerOptions> => {
  if (mongoose.connection.readyState === 0) {
    console.log(color('text', `❌ Database ${color('error', 'not connected')}`))
    return { autoPlay: true, loop: 'off', volume: 80 }
  }
  const foundPlayer = await PlayerDB.findOne({ guildID: guildId })
  if (!foundPlayer) {
    const newPlayer = new PlayerDB({ guildId: guildId })
    await newPlayer.save()
    return newPlayer.options
  }
  return foundPlayer.options
}

export const setPlayerDB = async (guildId: string, value: PlayerOptions) => {
  if (mongoose.connection.readyState === 0)
    return console.log(
      color('text', `❌ Database ${color('error', 'not connected')}`)
    )
  let foundPlayer = await PlayerDB.findOne({ guildID: guildId })
  if (!foundPlayer) return

  foundPlayer.options = value
  await foundPlayer.save()
}

export const getLoopString = (loopState: number) => {
  let loop = 'no loop'

  if (loopState === 0) loop = 'no loop'
  else if (loopState === 1) loop = 'loop song'
  else loop = 'loop playlist'

  return loop
}

export const getPlayerData = (
  autoplay: boolean | null,
  volume: number,
  loop: number | null,
  shuffle: boolean | null
) => {
  return `
        autoplay: **${autoplay ? autoplay : false}**\r
        volume: **${volume}**\r
        loop type: **${getLoopString(loop !== null ? loop : 2)}**\r
        shufle: **${shuffle ? shuffle : false}**
    `
}

function cleanup(ws: WebSocket, timeoutId: NodeJS.Timeout) {
  clearTimeout(timeoutId)
  if (
    ws.readyState === WebSocket.OPEN ||
    ws.readyState === WebSocket.CONNECTING
  ) {
    ws.close()
  }
}

export const checkLavalinkConnection = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: process.env.LAVALINK_PASSWORD,
      'User-Id': '1',
      'Client-Name': 'stalkerbot',
    }

    const ws = new WebSocket(
      `ws://${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}/v4/websocket`,
      { headers }
    )

    let timeoutId: NodeJS.Timeout

    ws.addEventListener('open', () => {
      cleanup(ws, timeoutId)
      resolve()
    })

    ws.addEventListener('error', () => {
      cleanup(ws, timeoutId)
      reject(new Error('Websocket error'))
    })

    timeoutId = setTimeout(() => {
      cleanup(ws, timeoutId)
      reject(new Error('Connection timeout.'))
    }, 5000)
  })
}

export const forLavalinkServer = async () => {
  let retries = 0

  while (retries < 10) {
    try {
      return await checkLavalinkConnection()
    } catch (error) {
      console.log(
        color(
          'text',
          `❌ Connection attempt ${retries + 1} failed:  ${color(
            'error',
            error.message
          )}`
        )
      )
      retries++
      if (retries < 10) {
        console.log(
          color('text', `🔃 Retrying in ${color('variable', '10')} seconds...`)
        )
        await new Promise((resolve) => setTimeout(resolve, 10000))
      } else {
        throw new Error(`Failed to connect to Lavalink after 10 retries.`)
      }
    }
  }
}
