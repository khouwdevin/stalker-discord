import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "interactionCreate",
  execute: (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName,
      );
      const cooldown = interaction.client.cooldowns.get(
        `${interaction.commandName}-${interaction.user.username}`,
      );
      if (!command) return;
      if (command.cooldown && cooldown) {
        if (Date.now() < cooldown) {
          interaction.reply(
            `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`,
          );
          setTimeout(() => interaction.deleteReply(), 5000);
          return;
        }
        interaction.client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000,
        );
        setTimeout(() => {
          interaction.client.cooldowns.delete(
            `${interaction.commandName}-${interaction.user.username}`,
          );
        }, command.cooldown * 1000);
      } else if (command.cooldown && !cooldown) {
        interaction.client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000,
        );
      }
      command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName,
      );

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }
      try {
        if (!command.autocomplete) return;
        command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isModalSubmit()) {
      const command = interaction.client.slashCommands.get(
        interaction.customId,
      );
      if (!command) {
        console.error(`No command matching ${interaction.customId} was found.`);
        return;
      }
      try {
        if (!command.modal) return;
        command.modal(interaction);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isButton()) {
      const commandString = interaction.customId.split(".")[0];
      const slashCommand = interaction.client.slashCommands.get(commandString);
      const command = interaction.client.commands.get(commandString);

      if (slashCommand) {
        try {
          if (!slashCommand.button) return;
          slashCommand.button(interaction);
        } catch (error) {
          console.error(error);
        }
      } else if (command) {
        try {
          if (!command.button) return;
          command.button(interaction);
        } catch (error) {
          console.error(error);
        }
      } else
        console.error(`No command matching ${interaction.customId} was found.`);
    }
  },
};

export default event;
