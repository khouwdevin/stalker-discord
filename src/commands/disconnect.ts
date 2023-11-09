import { sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "disconnect",
    execute: async (message, args) => {
        try {

            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const player = client.moon.players.get(message.guildId)

            if (!player) return sendTimedMessage(`${message.member} Stalker music is not active!`, message.channel as TextChannel, 5000)
            
            player.disconnect()
            sendMessage(`${message.member} Stalker is disconnected!`, message.channel as TextChannel)
        } catch {}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["dc"]
}

export default command