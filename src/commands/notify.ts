import { Command } from "../types";
import { color, sendTimedMessage, setGuildOption } from "../functions";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "notify",
    execute: async (message, args) => {
        try {
            const notify = args[1]
        
            if (!notify) return message.channel.send("No status is provided")
            if (notify !== "true" && notify !== "false") return message.channel.send("Please provide only true or false!")
            if (!message.guild) {
                return message.channel.send("Some error is occured!")
            }

            setGuildOption(message.guild, "notify", notify === "true")

            sendTimedMessage("Notify successfully changed!", message.channel as TextChannel, 5000)
        } catch(e) {console.log(color("text", `❌ Failed to configure notify : ${color("error", e.message)}`))}
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: ["n"]
}

export default command