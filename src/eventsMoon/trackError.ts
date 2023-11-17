import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { Client, EmbedBuilder } from "discord.js";

const event: MoonEvent = {
    name: "trackError",
    execute: async (client: Client, player: MoonlinkPlayer, track: any) => {
        const channel = await client.channels.fetch(player.textChannel).catch(() => {return null})
        
        if (!channel || !channel.isTextBased()) return

        const embed  = new EmbedBuilder()
            .setAuthor({ name: `Error occured, restarting ${track.title}`, iconURL: client.user?.avatarURL() || undefined })

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
                .setAuthor({ name: `Error occured, bot is disconnected!`, iconURL: client.user?.avatarURL() || undefined })
    
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