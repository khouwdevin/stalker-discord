import { EmbedBuilder } from 'discord.js'
import { Command } from '../types'
import { color } from '../functions'

const command: Command = {
  name: 'connect',
  execute: async (message, args) => {
    try {
      if (!message.guild || !args) return
      if (
        !message.member ||
        (message.member && message.member.id !== process.env.MY_ID)
      )
        return

      const client = message.client
      const status = args[1] === 'true' ? true : false

      const node = client.moon.nodes.get(process.env.LAVALINK_IDENTIFIER)

      if (status) {
        node.connect()

        const embed = new EmbedBuilder()
          .setTitle(`Connecting to ${node.host}`)
          .setColor('Green')

        return message.channel.send({ embeds: [embed] })
      }

      node.destroy()

      const embed = new EmbedBuilder()
        .setTitle(`Disconnecting to ${node.host}`)
        .setColor('Red')

      message.channel.send({ embeds: [embed] })

      return console.log(
        color('text', `⛔ Disconnecting from ${color('variable', node.host)}`)
      )
    } catch (e) {
      if (message.member && message.member.id === process.env.MY_ID) {
        const embed = new EmbedBuilder()
          .setTitle('Error occurred')
          .setColor('Red')
        message.channel.send({ embeds: [embed] })
      }
      console.log(
        color(
          'text',
          `❌ Failed to run connect command : ${color('error', e.message)}`
        )
      )
    }
  },
  cooldown: 1,
  aliases: [''],
  permissions: [],
}

export default command
