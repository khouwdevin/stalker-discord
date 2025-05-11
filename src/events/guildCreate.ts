import { Guild } from 'discord.js'
import { BotEvent } from '../types'
import { registerGuild } from '../functions'
import logger from '../logger'

const event: BotEvent = {
  name: 'guildCreate',
  execute: async (guild: Guild) => {
    try {
      const channelid = guild.systemChannel ? guild.systemChannel.id : 'default'

      await registerGuild(guild, channelid)

      logger.info('[Event]: Guild is created')
    } catch (e) {
      logger.error(`[Event]: Guild failed to create ${e.message}`)
    }
  },
}

export default event
