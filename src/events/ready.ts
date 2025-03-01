import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { color, sendNotifyStalkerOnline } from "../functions";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: async (client: Client) => {
    sendNotifyStalkerOnline(client);

    if (!client.user) return;

    client.user.setPresence({
      status: "online",
      activities: [
        {
          name: `${process.env.PREFIX_COMMAND}help`,
          type: ActivityType.Listening,
        },
      ],
    });

    client.moon.init(client.user.id);

    console.log(
      color("text", `💪 Logged in as ${color("variable", client.user.tag)}`),
    );
  },
};

export default event;
