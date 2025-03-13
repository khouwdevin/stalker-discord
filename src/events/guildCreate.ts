import { Guild } from 'discord.js'
import { BotEvent } from '../types'
import { registerGuild } from '../functions'
import logger from '../logger'

const event: BotEvent = {
  name: 'guildCreate',
  execute: (guild: Guild) => {
    const channelid = guild.systemChannel ? guild.systemChannel.id : 'default'

    registerGuild(guild, channelid)

    logger.info('[Event]: Guild is created')
  },
}

export default event
