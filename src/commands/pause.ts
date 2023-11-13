import { color, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { EmbedBuilder, TextChannel } from "discord.js";

const command: Command = {
    name: "pause",
    execute: async (message, args) => {
        try {

            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const player = client.moon.players.get(message.guildId)
            const channel = message.channel

            if (!player) return sendTimedMessage(`${message.member} Stalker music is not active!`, channel as TextChannel, 5000)

            if (!player.paused) {
                const embed = new EmbedBuilder()
                    .setFields({ name: " ", value: `${message.member} music is **paused**!` })
                channel.send({ embeds: [embed] })

                await player.pause()
            }
        } catch(e) {console.log(color("text", `❌ Failed to pause music : ${color("error", e.message)}`))}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["ps"]
}

export default command