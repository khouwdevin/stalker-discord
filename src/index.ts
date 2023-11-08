import { Client, GatewayIntentBits, Collection } from "discord.js";
import { Command, SlashCommand } from "./types";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path, { join } from "path";
import commandLineArgs from "command-line-args";
import { MoonlinkManager, MoonlinkPlayer } from "moonlink.js";

const options = commandLineArgs([
    {
      name: 'env',
      alias: 'e',
      defaultValue: 'development',
      type: String,
    },
])

try {
  if (options.env === "production") {
    dotenv.config()
  }
  else {
    dotenv.config({
      path: path.join(__dirname, `../development.env`),
    })
  }
}
catch(e) {
  throw e
}

const { Guilds, MessageContent, GuildMessages, GuildMessageReactions, GuildMessageTyping, GuildMembers, GuildVoiceStates, GuildScheduledEvents } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMessageReactions, GuildMessageTyping, GuildMembers, GuildVoiceStates, GuildScheduledEvents]})

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()
client.timeouts = new Collection<string, NodeJS.Timeout>()
client.player = new Collection<string, MoonlinkPlayer>()

client.moon = new MoonlinkManager(
	[{
		host: process.env.MOONLINK_HOST,
		port: parseInt(process.env.MOONLINK_PORT),
		secure: true,
		password: process.env.MOONLINK_PASSWORD
	}],
	{ 
    clientName: "Stalker",
    reconnectAtattemps: 5,
    retryTime: 3000,
    retryAmount: 3,
    sortNode: "memory"
  },
	(guildId: string, sPayload: string) => {
		if (!guildId || !client.guilds || !client.guilds.cache) return

		const guild = client.guilds.cache.get(guildId)

    if (guild) {
      return guild.shard.send(JSON.parse(sPayload))
    }

    console.log("Can't shard guild!")
	}
)

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)