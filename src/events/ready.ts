import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { color, sendNotifyStalkerOnline } from "../functions";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {        
        sendNotifyStalkerOnline(client)

        client.user?.setPresence({
            status: 'online',
            activities: [{
                name: `${process.env.PREFIX_COMMAND}help`,
                type: ActivityType.Listening
            }]
        })
            
        console.log(
            color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`)
        )
    }
}

export default event;