import { color, sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { EmbedBuilder, TextChannel } from "discord.js";

const command: Command = {
    name: "stop",
    execute: async (message, args) => {
        try {
            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channel || !message.member.voice.channel.id) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const player = client.moon.players.get(message.guildId)
            const channel = message.channel

            if (!player) return sendTimedMessage(`${message.member} Stalker music is not active!`, channel as TextChannel, 5000)
            if (message.member.voice.channel.id !== player.voiceChannel) return sendTimedMessage(`${message.member} isn't joining in a same voice channel!`, channel as TextChannel, 5000)

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${message.member.displayName} music is stopped!`, iconURL: client.user.avatarURL() || undefined })
            channel.send({ embeds: [embed] })

            await player.stop(true)
        } catch(e) {console.log(color("text", `❌ Failed to stop music : ${color("error", e.message)}`))}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["stp"]
}

export default command