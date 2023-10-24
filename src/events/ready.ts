import { ActivityType, Client, Guild } from "discord.js";
import { BotEvent } from "../types";
import { color, getCurrentGuild, getGuildOption, sendNotifyStalkerOnline } from "../functions";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {
        const guild = await getCurrentGuild(client.channels)
        const prefix = await getGuildOption(guild as Guild, "prefix")
        
        sendNotifyStalkerOnline(guild as Guild)

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