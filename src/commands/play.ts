import { sendMessage, sendTimedMessage } from "../functions";
import { Command } from "../types";
import { TextChannel } from "discord.js";

const command: Command = {
    name: "play",
    execute: async (message, args) => {
        try {
            const title = args.slice(1, args.length).join(" ")

            if (!title) return sendTimedMessage("Please provide a title!", message.channel as TextChannel, 5000)
            if (!message.guildId || !message.member) return sendTimedMessage("An error occured!", message.channel as TextChannel, 5000)
            if (!message.member.voice.channelId) return sendTimedMessage(`${message.member} is not joining any channel!`, message.channel as TextChannel, 5000)

            const client = message.client

            const player = client.moon.players.create({
                guildId: message.guildId,
                voiceChannel: message.member.voice.channelId,
                textChannel: message.channelId,
                autoPlay: true
            })

            if (!player.connected) {
                player.connect({
                    setDeaf: true,
                    setMute: false
                })
            }

            const res = await client.moon.search(title)

            switch (res.loadType) {
                case "error":
                    return sendMessage(`${message.member} failed to load song!`, message.channel as TextChannel)
                case "empty":
                    return sendMessage(`${message.member} no title matches!`, message.channel as TextChannel)
                case "playlist":
                    sendMessage(`${message.member} ${res.playlistInfo?.name} - This playlist has been added to the waiting list`, message.channel as TextChannel)
                    for (const track of res.tracks) {
                        player.queue.add(track)
                    }
                    break
                default:
                    player.queue.add(res.tracks[0])
                    sendMessage(`${message.member} ${res.tracks[0].title} was added to the waiting list!`, message.channel as TextChannel)
                    break
            }

            if (!player.playing) player.play()

            console.log("hello")
        } catch(e) {console.log(e)}
    },
    cooldown: 5,
    permissions: [],
    aliases: ["p"]
}

export default command