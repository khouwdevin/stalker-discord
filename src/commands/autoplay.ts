import { color, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { EmbedBuilder, TextChannel } from "discord.js";

const command: Command = {
    name: "autoplay",
    execute: async (message, args) => {
        try {
            const status = args[1]

            if (!status || (status !== "true" && status !== "false")) return sendTimedMessage("Status configuration is not valid!", message.channel as TextChannel, 5000)
            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channel || !message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client
            const channel = message.channel
            const player = client.moon.players.get(message.guildId)

            if (!player) return sendTimedMessage(`${message.member} Stalker music is not active!`, channel as TextChannel, 5000)
            if (message.member.voice.channel.id !== player.voiceChannel) return sendTimedMessage(`${message.member} isn't joining in a same voice channel!`, channel as TextChannel, 5000)

            player.setAutoPlay(status === "true" ? true : false)

            const embed = new EmbedBuilder()
                .setAuthor({ name: "Player Autoplay", iconURL: message.client.user.avatarURL() || undefined })
                .setFields({ name: " ", value: `${message.member} player autoplay is changed to **${status}**!` })
            channel.send({ embeds: [embed] })
        } catch(e) {console.log(color("text", `❌ Failed to configure autoplay : ${color("error", e.message)}`))}
    },
    cooldown: 1,
    permissions: [],
    aliases: ["ap", "auto"]
}

export default command