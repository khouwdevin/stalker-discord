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
  console.log("hello")
  dotenv.config({
    path: path.join(__dirname, "../production.env"),
  });
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

// client.on('ready', () =>{
//     client.user?.setPresence({
//         status: 'online',
//         activities: [{
//             name: '$help',
//             type: ActivityType.Listening
//         }]
//     })

//     const guildId = '902354600634499094'
//     const guild = client.guilds.cache.get(guildId)

//     let commands

//     if (guild) commands = guild.commands
//     else commands = client.application?.commands

//     commands?.create({
//         name: 'ping',
//         description: 'Reply pong!'
//     })

//     commands?.create({
//         name: 'add',
//         description: 'Add two numbers!',
//         options: [
//             {
//                 name: 'num1',
//                 description: 'First number',
//                 required: true,
//                 type: ApplicationCommandOptionType.Number
//             },
//             {
//                 name: 'num2',
//                 description: 'Second number',
//                 required: true,
//                 type: ApplicationCommandOptionType.Number
//             }
//         ]
//     })

//     commands?.create({
//         name: 'search',
//         description: 'Search the latest post using nickname',
//         options: [
//             {
//                 name: 'nickname',
//                 description: 'The person nickname',
//                 required: true,
//                 type: ApplicationCommandOptionType.String
//             },
//             {
//                 name: 'type',
//                 description: 'Post or reels',
//                 required: true,
//                 type: ApplicationCommandOptionType.String
//             }
//         ]
//     })
// })

// client.on('interactionCreate', async (interaction) => {
//     if (!interaction.isCommand()) return

//     const { commandName, options } = interaction

//     if (commandName === 'ping') {
//         interaction.reply({
//             content: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
//             ephemeral: true
//         })
//     }
//     else if (commandName === 'add'){
//         const num1 = options.getNumber('num1')
//         const num2 = options.getNumber('num2')

//         interaction.reply({
//             content: `The sum of number ${num1} and ${num2} number is ${num1 + num2}`,
//             ephemeral: true
//         })
//     }
//     else if (commandName === 'search'){
//         const nickname = options.getString('nickname')

//         interaction.reply({
//             content: `https://instagram.com/p/Cg9JvnklfSV/`,
//             ephemeral: true
//         })
//     }
// })

client.login(process.env.TOKEN)