import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { Client, EmbedBuilder } from "discord.js";
import { color } from "../functions";

const event: MoonEvent = {
  name: "trackStart",
  execute: async (client: Client, player: MoonlinkPlayer, track: any) => {
    const channel = await client.channels
      .fetch(player.textChannel)
      .catch(() => {
        return console.log(
          color(
            "text",
            `❌ Error fetch channel on ${color("variable", "trackStart")}`,
          ),
        );
      });

    if (!channel || !channel.isTextBased()) return;
    if (player.loop && player.loop === 1) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Now playing [${track.title}]`,
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setColor("Green");

    channel.send({ embeds: [embed] });
  },
};

export default event;
