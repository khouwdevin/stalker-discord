import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: (client : Client) => {
        client.user?.setPresence({
            status: 'online',
            activities: [{
                name: '$help',
                type: ActivityType.Listening
            }]
        })
            
        console.log(
            color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`)
        )
    }
}

export default event;