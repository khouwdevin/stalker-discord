import { Command } from "../types";
import GuildModel from "../schemas/Guild";
import { getAllGuildOption, setGuildOption } from "../functions";

const command: Command = {
    name: "notify",
    execute: async (message, args) => {
        let notify = args[1]
        
        if (!notify) return message.channel.send("No status is provided")
        if (notify !== "true" && notify !== "false") return message.channel.send("Please provide only true or false!")
        if (!message.guild) {
            console.log("'notify' is missing guild.")
            return message.channel.send("Some error is occured!")
        }

        setGuildOption(message.guild, "notify", notify === "true")

        message.channel.send("Notify successfully changed!")
    },
    cooldown: 5,
    permissions: ["Administrator"],
    aliases: []
}

export default command