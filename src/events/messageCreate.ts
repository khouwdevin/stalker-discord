import { ChannelType, Message, TextChannel } from "discord.js";
import { checkPermissions, getGuildOption, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        const temp = message.content.split(' ')

        if (temp[0] === '$help'){
            message.channel.send(`${message.author}\n\n>>> **$search** : to search username latest post\n**$update** : to continuously update username latest post`)
        }
        else if (temp[0] === '$use'){
            message.channel.send(`Processing ${message.author}...`)
            message.channel.send('https://instagram.com/p/Cg9JvnklfSV/')
        }
        else if (temp[0] === '$fetch'){
            const object = await fetch('https://khouwdevin.com/api/randomid', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({length : 10})
            })
            const res = await object.json()
    
            message.channel.send(`${message.author} you're id is **${res.id}**`)
        }
        else if (temp[0] === "$hi"){
            sendTimedMessage(`hello, ${message.author}`, message.channel as TextChannel, 2000)
        }
        else if (temp[0] === "$set"){
    
        } 
    }
}

export default event