import { EmbedBuilder } from "discord.js";
import { Command } from "../types";
import { color } from "../functions";

const command : Command = {
    name: "connect",
    execute: async (message, args) => {
        try {
            if (!message.guild || !args) return
            if (!message.member || (message.member && message.member.id !== process.env.MY_ID)) return

            const client = message.client
            const status = args[1] === "true" ? true : false           

            if (status) {     
                const node = client.moon.addNode({
                    host: `${process.env.LAVALINK_HOST}`,
		            port: parseInt(process.env.LAVALINK_PORT),
                    secure: true,
                    password: `${process.env.LAVALINK_PASSWORD}`,
                    identifier: `${process.env.LAVALINK_IDENTIFIER}`

                })

                const embed = new EmbedBuilder()
                .setTitle(`Connected to ${node.host}`)
                .setColor("Green")

                return message.channel.send({ embeds: [embed] })
            }

            const isSuccess = client.moon.removeNode("lavalink.stalkerbot.xyz")

            const embed = new EmbedBuilder()
                .setTitle(`Disconnecting ${isSuccess ? "success" : "failed"}`)
                .setColor("Red")

            message.channel.send({ embeds: [embed] })
            return console.log(color("text", `⛔ Disconnecting from ${color("variable", "lavalink.stalkerbot.xyz")} ${color("variable", isSuccess ? "success" : "failed")}`))
        } catch(e) {
            if (message.member && message.member.id === process.env.MY_ID) {
                const embed = new EmbedBuilder()
                    .setTitle("Error occurred")
                    .setColor("Red")
                message.channel.send({ embeds: [embed] })
            }
            console.log(color("text", `❌ Failed to run connect command : ${color("error", e.message)}`))
        }
    },
    cooldown: 1,
    aliases: [""],
    permissions: []
}

export default command