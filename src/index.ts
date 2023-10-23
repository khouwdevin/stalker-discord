import { Client, GatewayIntentBits, Collection } from "discord.js";
import { Command, SlashCommand } from "./types";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path, { join } from "path";
import commandLineArgs from "command-line-args";

const options = commandLineArgs([
    {
      name: 'env',
      alias: 'e',
      defaultValue: 'development',
      type: String,
    },
])

const result = dotenv.config({
  path: path.join(__dirname, `../${String(options.env)}.env`),
})

if (result.error) {
  throw result.error
}

const { Guilds, MessageContent, GuildMessages, GuildMembers, GuildVoiceStates } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers, GuildVoiceStates]})

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)