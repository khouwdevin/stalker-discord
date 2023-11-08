import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { BotEvent, MoonEvent } from "../types";

module.exports = (client: Client) => {
    let eventsDir = join(__dirname, "../events")
    let eventsMoonDir = join(__dirname, "../eventsMoon")

    readdirSync(eventsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let event: BotEvent = require(`${eventsDir}/${file}`).default

        if (event.name === "raw") {
            client.on(event.name, (...args) => event.execute(client, ...args))
            return console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`))
        }
        
        event.once ?
        client.once(event.name, (...args) => event.execute(...args))
        :
        client.on(event.name, (...args) => event.execute(...args))
        console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`))
    })

    readdirSync(eventsMoonDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let event: MoonEvent = require(`${eventsMoonDir}/${file}`).default
        client.moon.on(event.name, (...args: any) => event.execute(...args))
        console.log(color("text", `🌠 Successfully loaded moon event ${color("variable", event.name)}`))
    })
}
