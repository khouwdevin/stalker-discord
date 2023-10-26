import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";

const event: BotEvent = {
    name: "guildDelete",
    execute: (guild : Guild) => {
        GuildModel.deleteOne({ guildID: guild.id }).catch((message) => console.log(message))
    }
}

export default event;