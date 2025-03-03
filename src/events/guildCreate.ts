import { Guild } from 'discord.js'
import { BotEvent } from '../types'
import { registerGuild } from '../functions'

const event: BotEvent = {
  name: 'guildCreate',
  execute: (guild: Guild) => {
    const channelid = guild.systemChannel ? guild.systemChannel.id : 'default'

    registerGuild(guild, channelid)
  },
}

export default event
