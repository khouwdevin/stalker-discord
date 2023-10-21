import { ChannelType, Message, TextChannel } from "discord.js";
import { checkPermissions, getGuildOption, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        if (!message.member || message.member.user.bot) return;
        if (!message.guild) return;
        let prefix = process.env.PREFIX
        if (mongoose.connection.readyState === 1) {
            let guildPrefix = await getGuildOption(message.guild, "prefix") 
                if (guildPrefix) prefix = guildPrefix;
        }

        if (!message.content.startsWith(prefix)) return;
        if (message.channel.type !== ChannelType.GuildText) return;

        let args = message.content.substring(prefix.length).split(" ")
        let command = message.client.commands.get(args[0])

        if (!command) {
            let commandFromAlias = message.client.commands.find((command) => command.aliases.includes(args[0]))
            if (commandFromAlias) command = commandFromAlias
            else return;
        }

        let cooldown = message.client.cooldowns.get(`${command.name}-${message.member.user.username}`)
        let neededPermissions = checkPermissions(message.member, command.permissions)
        if (neededPermissions !== null)
            return sendTimedMessage(
                `
            You don't have enough permissions to use this command. 
            \n Needed permissions: ${neededPermissions.join(", ")}
            `,
                message.channel,
                5000
            )


        if (command.cooldown && cooldown) {
            if (Date.now() < cooldown) {
                sendTimedMessage(
                    `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`,
                    message.channel,
                    5000
                )
                return
            }
            message.client.cooldowns.set(`${command.name}-${message.member.user.username}`, Date.now() + command.cooldown * 1000)
            setTimeout(() => {
                message.client.cooldowns.delete(`${command?.name}-${message.member?.user.username}`)
            }, command.cooldown * 1000)
        } else if (command.cooldown && !cooldown) {
            message.client.cooldowns.set(`${command.name}-${message.member.user.username}`, Date.now() + command.cooldown * 1000)
        }

        command.execute(message, args)

        // const temp = message.content.split(' ')

        // if (temp[0] === '$help'){
        //     message.channel.send(`${message.author}\n\n>>> **$search** : to search username latest post\n**$update** : to continuously update username latest post`)
        // }
        // else if (temp[0] === '$use'){
        //     message.channel.send(`Processing ${message.author}...`)
        //     message.channel.send('https://instagram.com/p/Cg9JvnklfSV/')
        // }
        // else if (temp[0] === '$fetch'){
        //     const object = await fetch('https://khouwdevin.com/api/randomid', {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         method: 'POST',
        //         body: JSON.stringify({length : 10})
        //     })
        //     const res = await object.json()
    
        //     message.channel.send(`${message.author} you're id is **${res.id}**`)
        // }
        // else if (temp[0] === "$hi"){
        //     sendTimedMessage(`hello, ${message.author}`, message.channel as TextChannel, 2000)
        // }
        // else if (temp[0] === "$set" || temp[0] === "$s"){
    
        // } 
    }
}

export default event