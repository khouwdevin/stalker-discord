import { sendTimedMessage } from "../functions";
import { Command } from "../types";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "play",
    execute: async (message, args) => {
        try {
            const title = args.slice(1, args.length).join(" ")

            if (!title) return sendTimedMessage("Please provide a title!", message.channel as TextChannel, 5000)
            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client

            const player = client.moon.players.create({
                guildId: message.guildId,
                voiceChannel: message.member.voice.channelId,
                textChannel: message.channelId
            })

            if (!player.connected) {
                player.connect({
                    setDeaf: true,
                    setMute: false
                })
            }
        } catch {}
    },
    cooldown: 5,
    permissions: [],
    aliases: ["p"]
}

export default command