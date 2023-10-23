import { ActivityType, Client, Guild } from "discord.js";
import { BotEvent } from "../types";
import { color, getCurrentGuildbySendMessage, getGuildOption } from "../functions";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {
        const guild = await getCurrentGuildbySendMessage(client.channels)
        const prefix = await getGuildOption(guild as Guild, "prefix")

        client.user?.setPresence({
            status: 'online',
            activities: [{
                name: `${prefix}help`,
                type: ActivityType.Listening
            }]
        })
            
        console.log(
            color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`)
        )
    }
}

export default event;