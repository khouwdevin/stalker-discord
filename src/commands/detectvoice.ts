import { Command } from "../types";
import { setGuildOption } from "../functions";

const command: Command = {
    name: "detectvoice",
    execute: async (message, args) => {
        let detectvoice = args[1]
        
        if (!detectvoice) return message.channel.send("No status is provided!")
        if (detectvoice !== "true" && detectvoice !== "false") return message.channel.send("Please provide only true or false!")
        if (!message.guild) {
            console.log("'detectvoice' is missing guild.")
            return message.channel.send("Some error is occured!")
        }

        setGuildOption(message.guild, "detectvoice", detectvoice === "true")

        message.channel.send("Detect voice successfully changed!")
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: []
}

export default command