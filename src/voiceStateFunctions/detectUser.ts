import { VoiceState } from 'discord.js'
import logger from '../logger'

const DetectUser = (oldstate: VoiceState, newState: VoiceState) => {
  try {
    const client = newState.client
    const player = client.moon.players.get(newState.guild.id)

    if (
      newState.member?.user === client.user ||
      oldstate.member?.user === client.user
    )
      return
    if (!player) return
    if (player.voiceChannelId === oldstate.channelId) {
      if (!oldstate.channel) return

      const members = oldstate.channel.members

      if (members.size > 1) {
        if (!client.timeouts.has(`player-${player.guildId}`)) return

        clearTimeout(client.timeouts.get(`player-${player.guildId}`))
        client.timeouts.delete(`player-${player.guildId}`)

        return
      }

      const timeout = setTimeout(async () => {
        player.stop()
        client.timeouts.delete(`player-${player.guildId}`)
      }, 20000)

      client.timeouts.set(`player-${player.guildId}`, timeout)
    } else if (player.voiceChannelId === newState.channelId) {
      if (!newState.channel) return

      const members = newState.channel.members

      if (members.size > 1) {
        if (!client.timeouts.has(`player-${player.guildId}`)) return

        clearTimeout(client.timeouts.get(`player-${player.guildId}`))
        client.timeouts.delete(`player-${player.guildId}`)

        return
      }

      const timeout = setTimeout(async () => {
        player.stop()
        client.timeouts.delete(`player-${player.guildId}`)
      }, 20000)

      client.timeouts.set(`player-${player.guildId}`, timeout)
    }
  } catch (e) {
    logger.error(`[Detect User]: ❌ Failed to detect user : ${e.message}`)
  }
}

export default DetectUser
