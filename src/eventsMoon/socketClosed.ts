import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { Client } from "discord.js";

const event: MoonEvent = {
    name: "socketClosed",
    execute: async (client: Client, player: MoonlinkPlayer, track: any) => {
        if (client.attempts.has(player.guildId)) {
            client.attempts.delete(player.guildId)
        }
    }
}

export default event;