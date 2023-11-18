import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { Client, EmbedBuilder } from "discord.js";
import { color } from "../functions";

const event: MoonEvent = {
    name: "trackStuck",
    execute: async (client: Client, player: MoonlinkPlayer, track: any) => {
        const channel = await client.channels.fetch(player.textChannel).catch(() => {return console.log(color("text", `❌ Error fetch channel on ${color("variable", "trackStuck")}`))})

        if (!channel || !channel.isTextBased()) return

        const embed  = new EmbedBuilder()
            .setAuthor({ name: `Error occurred, restarting ${track.title}`, iconURL: client.user?.avatarURL() || undefined })
            .setColor("Red")

        channel.send({ embeds: [embed] })

        const attemp = client.attempts.get(player.guildId)

        if (!attemp) {
            client.attempts.set(player.guildId, 3)
            await player.restart()
        }
        else {
            if (attemp <= 0) {
                await player.stop(true)

                const embed  = new EmbedBuilder()
                    .setAuthor({ name: `Error occurred, bot is disconnected!`, iconURL: client.user?.avatarURL() || undefined })
                    .setColor("Red")
    
                channel.send({ embeds: [embed] })
            }
            else {
                client.attempts.set(player.guildId, attemp - 1)
                await player.restart()
            }
        }
    }
}

export default event;