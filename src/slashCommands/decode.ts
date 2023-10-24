import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`1234567890-=~!@#$%^&*()_+[]\\;',./{}|:\"<>?£€¥¢©®™¿¡÷¦¬×§¶°"
const formula = "°¶§×¬¦÷¡¿™®©¢¥€£?><\":|}{/.,';\\][+_)(*&^%$#@!~=-0987654321`zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA"

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("decode")
    .addStringOption(option => {
        return option
        .setName("code")
        .setDescription("Put your code here")
        .setMaxLength(5000)
    })
    .setDescription("Decode your secret message here!")
    ,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const options = interaction.options.data
        const decode = options[0].value as string
        const decodestring: string[] = []

        let result = ""

        for(let i = 0; i < decode.length; i++) {
            if ((/\n/).test(decode[i]) || (/\r/).test(decode[i])) {
                decodestring.push("\r")
                continue
            }
            else if ((/\s/).test(decode[i])) {
                decodestring.push(" ")
                continue
            }

            for (let j = 0; j < formula.length; j++){
                if (decode[i] === formula[j]) 
                    decodestring.push(alphabet[j])
            }
        }

        result = decodestring.join("")

        await interaction?.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(" ")
                .addFields({ name: " ", value: result })
                .setColor("Green")
            ]
        })
    },
    cooldown: 2
}

export default command