import { getPlayerData, sendTimedMessage, setPlayerDB } from "../functions";
import logger from "../logger";
import { Command } from "../types";
import { EmbedBuilder, TextChannel } from "discord.js";

const command: Command = {
  name: "loop",
  execute: async (message, args) => {
    try {
      logger.debug("[Loop Command]: Run loop command");

      const loop = args[1];

      if (loop !== "off" && loop !== "track" && loop != "queue")
        return sendTimedMessage(
          "Loop configuration is not valid!",
          message.channel as TextChannel,
          5000,
        );
      if (!message.guildId || !message.member)
        return sendTimedMessage(
          "An error occurred!",
          message.channel as TextChannel,
          5000,
        );
      if (!message.member.voice.channelId)
        return sendTimedMessage(
          `${message.member} is not joining any channel!`,
          message.channel as TextChannel,
          5000,
        );

      const client = message.client;
      const channel = message.channel;
      const player = client.moon.players.get(message.guildId);

      if (!player)
        return sendTimedMessage(
          `${message.member} Stalker music is not active!`,
          channel as TextChannel,
          5000,
        );
      if (message.member.voice.channelId !== player.voiceChannelId)
        return sendTimedMessage(
          `${message.member} isn't joining in a same voice channel!`,
          channel as TextChannel,
          5000,
        );

      player.setLoop(loop);
      await setPlayerDB(message.guildId, "loop", loop);

      const playerData = getPlayerData(
        player.autoPlay,
        player.volume,
        loop,
        player.shuffle(),
      );

      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Player Updated",
          iconURL: client.user.avatarURL() || undefined,
        })
        .setFields({ name: " ", value: playerData })
        .setFooter({ text: "STALKER MUSIC" })
        .setColor("Purple");
      channel.send({ embeds: [embed] });
      logger.trace(`[Loop Command]: Loop is changed to ${playerData}`);
    } catch (e) {
      logger.error(
        `[Loop Command]: ❌ Failed to configure loop : ${e.message}`,
      );
    }
  },
  cooldown: 1,
  permissions: [],
  aliases: [],
};

export default command;
