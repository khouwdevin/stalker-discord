import { Command } from "../types";
import { sendTimedMessage, setGuildOption } from "../functions";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "detectvoice",
    execute: async (message, args) => {
        let detectvoice = args[1]
        
        if (!detectvoice) return message.channel.send("No status is provided!")
        if (detectvoice !== "true" && detectvoice !== "false") return message.channel.send("Please provide only true or false!")
        if (!message.guild) {
            return message.channel.send("Some error is occured!")
        }

        setGuildOption(message.guild, "detectvoice", detectvoice === "true")
        

        sendTimedMessage("Detect voice successfully changed!", message.channel as TextChannel, 5000)
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: []
}

export default command