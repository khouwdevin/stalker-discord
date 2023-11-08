import { Client } from "discord.js";
import { BotEvent } from "../types";

const event : BotEvent = {
    name: "raw",
    once: true,
    execute: async (client: Client, data: any) => {
        client.moon.packetUpdate(data)
    }
}

export default event;