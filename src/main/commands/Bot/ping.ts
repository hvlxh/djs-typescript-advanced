import { EmbedBuilder } from 'discord.js'
import { Command, CommandRun } from '../../../structures/base/Command.js'

class PingCmd extends Command {
  constructor () {
    super({
      name: 'ping',
      description: 'Get the bot latency'
    })
  }

  async run ({ interaction, client }: CommandRun) {
    const msg = await interaction.reply({
      content: 'Pinging...',
      ephemeral: true,
      fetchReply: true
    })

    const ping = msg.createdTimestamp - interaction.createdTimestamp
    const apiPing = Math.round(client.ws.ping)

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('DarkButNotBlack')
          .setTitle('Pong!')
          .setDescription(
            `> Latency: \`${ping}\`ms\n> API Latency: \`${apiPing}\`ms`
          )
          .setTimestamp()
      ],
      content: ''
    })
  }
}

export default PingCmd
