import { ActivityType, Client } from 'discord.js'
import { BotEvent } from '../types'
import { sendNotifyStalkerOnline } from '../functions'
import logger from '../logger'

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    logger.debug('[Event]: Client is ready')
    sendNotifyStalkerOnline(client)

    if (!client.user) return

    client.user.setPresence({
      status: 'online',
      activities: [
        {
          name: `${process.env.PREFIX_COMMAND}help`,
          type: ActivityType.Listening,
        },
      ],
    })

    if (process.env.TURN_ON_MUSIC === 'true') client.moon.init(client.user.id)

    logger.info(`[Event]: 💪 Logged in as ${client.user.tag}`)
  },
}

export default event
