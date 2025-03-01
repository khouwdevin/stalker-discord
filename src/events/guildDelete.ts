import { Guild } from "discord.js";
import GuildModel from "../schemas/Guild";
import { BotEvent } from "../types";
import { color } from "../functions";

const event: BotEvent = {
  name: "guildDelete",
  execute: (guild: Guild) => {
    GuildModel.deleteOne({ guildID: guild.id }).catch((message) =>
      console.log(
        color(
          "text",
          `❌ Failed to delete guild doc : ${color("error", message)}`,
        ),
      ),
    );
  },
};

export default event;
