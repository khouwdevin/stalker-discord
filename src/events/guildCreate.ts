import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";

const event: BotEvent = {
    name: "guildCreate",
    execute: (guild : Guild) => {
        const channelid = guild.systemChannel ? guild.systemChannel.id : "default"

        const newGuild = new GuildModel({
            guildID: guild.id,
            options: {
                detectpresence: false,
                notify: false,
                channel: channelid
            },
            joinedAt: Date.now()
        })
        newGuild.save()
    }
}

export default event;