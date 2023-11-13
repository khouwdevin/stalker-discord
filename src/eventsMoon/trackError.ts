import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { ChannelType, Client, EmbedBuilder } from "discord.js";

const event: MoonEvent = {
    name: "trackError",
    execute: async (client: Client, player: MoonlinkPlayer, track: any) => {
        const channel = await client.channels.fetch(player.textChannel).catch(() => {return null})
        
        if (!channel || !channel.isTextBased()) return

        const embed  = new EmbedBuilder()
            .setAuthor({ name: `Error occured, restarting ${track.title}` })

        channel.send({ embeds: [embed] })

        const attemp = client.attemps.get(`attemp-${player.guildId}`)

        if (!attemp) {
            client.attemps.set(`attemp-${player.guildId}`, 3)
            player.restart()
        }
        else {
            if (attemp <= 0) {
                await player.stop(true)

                const embed  = new EmbedBuilder()
                .setAuthor({ name: `Error occured, bot is disconnected!` })
    
                channel.send({ embeds: [embed] })
            }
            else {
                client.attemps.set(`attemp-${player.guildId}`, attemp - 1)
                player.restart()
            }
        }
    }
}

export default event;