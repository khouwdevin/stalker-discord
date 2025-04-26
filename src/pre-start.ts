import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { Command, SlashCommand } from './types'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Manager } from 'moonlink.js'

const {
  Guilds,
  MessageContent,
  DirectMessages,
  GuildMessages,
  GuildMessageReactions,
  GuildMessageTyping,
  GuildMembers,
  GuildVoiceStates,
  GuildScheduledEvents,
} = GatewayIntentBits

const client = new Client({
  intents: [
    Guilds,
    MessageContent,
    DirectMessages,
    GuildMessages,
    GuildMessageReactions,
    GuildMessageTyping,
    GuildMembers,
    GuildVoiceStates,
    GuildScheduledEvents,
  ],
})

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()
client.timeouts = new Collection<string, NodeJS.Timeout>()
client.playerAttempts = new Collection<string, number>()

client.moon = new Manager({
  nodes: [
    {
      host: `${process.env.LAVALINK_HOST}`,
      port: parseInt(process.env.LAVALINK_PORT),
      secure: process.env.LAVALINK_SSL === 'true',
      password: `${process.env.LAVALINK_PASSWORD}`,
      identifier: `${process.env.LAVALINK_IDENTIFIER}`,
      retryAmount: 10,
      retryDelay: 10000,
    },
  ],
  options: {
    clientName: 'stalkerbot',
    sortTypeNode: 'memory',
  },
  sendPayload: (guildId: string, sPayload: string) => {
    if (!guildId || !client.guilds || !client.guilds.cache) return

    const guild = client.guilds.cache.get(guildId)
    if (guild) guild.shard.send(JSON.parse(sPayload))
  },
})

const handlersDir = join(__dirname, './handlers')
readdirSync(handlersDir).forEach((handler) => {
  if (!handler.endsWith('.js')) return
  require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)
