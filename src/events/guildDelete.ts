import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";

const event: BotEvent = {
    name: "guildDelete",
    execute: (guild : Guild) => {
        const guildDoc = GuildModel.findOne({ guildID: guild.id })

        guildDoc.deleteOne()
    }
}

export default event;