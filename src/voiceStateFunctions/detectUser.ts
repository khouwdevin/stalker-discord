import { EmbedBuilder, VoiceState } from "discord.js";
import logger from "../logger";

const DetectUser = (oldstate: VoiceState, newState: VoiceState) => {
  try {
    const client = newState.client;
    const player = client.moon.players.get(newState.guild.id);

    if (newState.member && newState.member.user === client.user) {
      if (!newState.channel) return;

      const members = newState.channel.members;

      if (members.size > 1) {
        if (!client.timeouts.has(`player-${player.guildId}`)) return;

        if (client.timeouts.has(`player-${player.guildId}`)) {
          clearTimeout(client.timeouts.get(`player-${player.guildId}`));
          client.timeouts.delete(`player-${player.guildId}`);
        }

        return;
      }
    }

    if (
      !player ||
      newState.member?.user === client.user ||
      oldstate.member?.user === client.user
    )
      return;

    if (newState.channelId === player.voiceChannelId) {
      if (player.playing && client.timeouts.has(`player-${player.guildId}`)) {
        clearTimeout(client.timeouts.get(`player-${player.guildId}`));
        client.timeouts.delete(`player-${player.guildId}`);
      }

      logger.trace(
        `[Detect User]: ${newState.member?.user.tag} joined the same channel as the bot.`,
      );
    } else if (
      oldstate.channelId === player.voiceChannelId &&
      newState.channelId !== player.voiceChannelId
    ) {
      if (!oldstate.channel) return;

      const members = oldstate.channel.members;

      if (members.size > 1) {
        if (!client.timeouts.has(`player-${player.guildId}`)) return;

        if (client.timeouts.has(`player-${player.guildId}`)) {
          clearTimeout(client.timeouts.get(`player-${player.guildId}`));
          client.timeouts.delete(`player-${player.guildId}`);
        }

        return;
      }

      if (
        player.connected &&
        !client.timeouts.has(`player-${player.guildId}`)
      ) {
        const timeout = setTimeout(async () => {
          player.stop();
          player.disconnect();
          player.destroy();

          const deleteTimeout = client.timeouts.delete(
            `player-${player.guildId}`,
          );
          const deletePlayerAttemps = client.playerAttempts.delete(
            `player-${player.guildId}`,
          );
          const deleteMoonPlayer = client.moon.players.delete(player.guildId);

          logger.trace(
            `[Detect User]: Delete client timeout ${player.guildId} : ${deleteTimeout}`,
          );
          logger.trace(
            `[[Detect User]: Delete player attempts ${player.guildId} : ${deletePlayerAttemps}`,
          );
          logger.trace(
            `[Detect User]: Delete moon player ${player.guildId} : ${deleteMoonPlayer}`,
          );

          const channel = await client.channels
            .fetch(player.textChannelId)
            .catch(() => {
              return logger.error(
                "[Detect User]: ❌ Error fetch channel on queueEnd",
              );
            });

          if (!channel || !channel.isTextBased()) return;

          const embed = new EmbedBuilder()
            .setAuthor({
              name: "Users have left. The player is disconnected.",
              iconURL: client.user?.avatarURL() || undefined,
            })
            .setColor("Grey");

          channel.send({ embeds: [embed] });
        }, 10000);

        client.timeouts.set(`player-${player.guildId}`, timeout);
      }

      logger.trace(
        `[Detect User]: ${oldstate.member?.user.tag} left the bots channel.`,
      );
    }
  } catch (e) {
    logger.error(`[Detect User]: ❌ Failed to detect user : ${e.message}`);
  }
};

export default DetectUser;
