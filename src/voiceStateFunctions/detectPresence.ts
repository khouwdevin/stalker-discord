import { TextChannel, VoiceState } from 'discord.js'
import {
  getGuildOption,
  notifyToConfigDefaultTextChannel,
  sendMessage,
} from '../functions'
import logger from '../logger'

const DetectPresence = async (voiceState: VoiceState, option: number) => {
  try {
    const detectpresence = await getGuildOption(
      voiceState.guild,
      'detectpresence'
    )

    if (!detectpresence || !voiceState.member || !voiceState.guild) return
    if (voiceState.client.user === voiceState.member.user) return

    const channelGuildId = (await getGuildOption(
      voiceState.guild,
      'channel'
    )) as string
    const channel =
      channelGuildId === 'default'
        ? voiceState.guild.systemChannel
        : await voiceState.guild.channels.fetch(channelGuildId).catch(() => {
            return null
          })

    if (!channel)
      return notifyToConfigDefaultTextChannel(voiceState.guild.channels)

    if (option === 0)
      sendMessage(
        `${voiceState.member?.user} left ${voiceState.channel} channel!`,
        channel as TextChannel
      )
    else if (option === 1)
      sendMessage(
        `${voiceState.member.user} joined ${voiceState.channel} channel!`,
        channel as TextChannel
      )
    else
      sendMessage(
        `${voiceState.member.user} moved to ${voiceState.channel} channel!`,
        channel as TextChannel
      )
  } catch (e) {
    logger.error(
      `[Detect Presence]: ❌ Failed to detect presence : ${e.message}`
    )
  }
}

export default DetectPresence
