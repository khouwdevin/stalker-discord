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
import { GuildOption, IGuild, PlayerOption, PlayerOptions } from './types'
import mongoose from 'mongoose'
import { WebSocket } from 'ws'
import GuildModel from './schemas/Guild'
import { TPlayerLoop } from 'moonlink.js'
import logger from './logger'

export const checkPermissions = (
  member: GuildMember,
  permissions: Array<PermissionResolvable>,
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
  duration: number,
) => {
  channel
    .send(message)
    .then((m) =>
      setTimeout(
        async () =>
          (await channel.messages.fetch(m))
            .delete()
            .catch((e) =>
              logger.error(
                `[Send Timed Message]: ❌ Failed to delete message : ${e.message}`,
              ),
            ),
        duration,
      ),
    )
  return
}

export const sendMessage = (message: string, channel: TextChannel) => {
  channel
    .send(message)
    .catch((e) =>
      logger.error(
        `[Send Message]: ❌ Failed to delete message : ${e.message}`,
      ),
    )
}

export const sendMessageToExistingChannel = (
  channels: ChannelManager,
  message: string,
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
        logger.error(
          `[Send Message to Existing Channel]: ❌ Failed to send message : ${e.message}`,
        ),
      )
  }
}

export const sendTimedMessageToExistingChannel = (
  channels: ChannelManager,
  message: string,
  duration: number,
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
        logger.error(
          `[Send Timed Message to Existing Channel]: ❌ Failed to send message : ${e.message}`,
        ),
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
          10000,
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
          10000,
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
        10000,
      )

    const channel = channelGuild.guild.systemChannel
    return channel
      .send("Please add or update default text channel to Stalker's config!")
      .then((m) => setTimeout(() => m.delete(), 10000))
      .catch((e) =>
        logger.error(
          `[Notify to Config Default Channel]: ❌ Failed to notify config default message : ${e.message}`,
        ),
      )
  }
}

export const deleteTimedMessage = (
  message: Message,
  channel: TextChannel,
  duration: number,
) => {
  setTimeout(
    async () =>
      (await channel.messages.fetch(message))
        .delete()
        .catch((e) =>
          logger.error(
            `[Delete Timed Message]: ❌ Failed to delete message : ${e.message}`,
          ),
        ),
    duration,
  )
}

export const registerGuild = async (
  guild: Guild,
  channelid: string,
): Promise<IGuild> => {
  const newGuild = new GuildModel({
    guildID: guild.id,
    options: {
      detectpresence: false,
      notify: false,
      channel: channelid,
    },
    joinedAt: Date.now(),
  })
  await newGuild.save()

  return newGuild
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Get Guild Option]: ❌ Database is not connected')
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) {
    const newGuild = await registerGuild(guild, guild.systemChannelId ?? '')
    return newGuild.options[option]
  }
  return foundGuild.options[option]
}

export const getAllGuildOption = async (guild: Guild) => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Get All Guild Option]: ❌ Database is not connected')
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) {
    const newGuild = await registerGuild(guild, guild.systemChannelId ?? '')
    return newGuild.options
  }
  return foundGuild.options
}

export const setGuildOption = async (
  guild: Guild,
  option: GuildOption,
  value: any,
) => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Set Guild Option]: ❌ Database is not connected')
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) {
    let newGuild = await registerGuild(guild, guild.systemChannelId ?? '')
    newGuild.options[option] = value
    await newGuild.save()
    return
  }
  foundGuild.options[option] = value
  await foundGuild.save()
}

export const getAllGuild = async () => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Get All Guild]: ❌ Database is not connected')
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
    logger.error('[Get Player DB]: ❌ Database is not connected')
    return { autoPlay: false, loop: 'off', volume: 80, shuffle: false }
  }
  const foundPlayer = await PlayerDB.findOne({ guildID: guildId })
  if (!foundPlayer) {
    const newPlayer = new PlayerDB({
      guildId: guildId,
      options: { autoPlay: false, loop: 'off', volume: 80, shuffle: false },
    })
    await newPlayer.save()
    return newPlayer.options
  }
  return foundPlayer.options
}

export const setPlayerDB = async (
  guildId: string,
  options: PlayerOption,
  value: any,
) => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Set Player DB]: ❌ Database is not connected')
  let foundPlayer = await PlayerDB.findOne({ guildID: guildId })
  if (!foundPlayer) {
    const newPlayer = new PlayerDB({
      guildId: guildId,
      options: { autoPlay: false, loop: 'off', volume: 80, shuffle: false },
    })
    await newPlayer.save()
    return
  }

  foundPlayer.options[options] = value
  await foundPlayer.save()
}

export const getPlayerData = (
  autoplay: boolean | null,
  volume: number,
  loop: TPlayerLoop | null,
  shuffle: boolean | null,
) => {
  return `
        autoplay: **${autoplay ? autoplay : false}**\r
        volume: **${volume}**\r
        loop type: **${loop !== null ? loop : 'off'}**\r
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
    const protocol = process.env.LAVALINK_SSL === 'true' ? 'wss' : 'ws'
    const headers = {
      Authorization: process.env.LAVALINK_PASSWORD,
      'User-Id': '1',
      'Client-Name': 'stalkerbot',
    }

    const ws = new WebSocket(
      `${protocol}://${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}/v4/websocket`,
      { headers },
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
      logger.error(
        `[For Lavalink Server]: ❌ Connection attempt ${retries + 1} failed: ${
          error.message
        }`,
      )

      retries++
      if (retries < 10) {
        logger.info('[For Lavalink Server]: 🔃 Retrying in 10 seconds...')
        await new Promise((resolve) => setTimeout(resolve, 10000))
      } else {
        throw new Error(`Failed to connect to Lavalink after 10 retries.`)
      }
    }
  }
}

export const formattedTime = (ms: number): string => {
  if (ms === 0) return '-'

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  return `${hours}h ${minutes}m`
}
