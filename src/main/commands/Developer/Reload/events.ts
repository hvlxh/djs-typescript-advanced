import {
  Subcommand,
  SubcommandRun
} from '../../../../structures/base/Subcommand.js'
import chalk from 'chalk'

class PingCmd extends Subcommand {
  constructor () {
    super({
      name: 'events',
      description: 'Reload the events',
      dev: true
    })
  }

  async run ({ interaction, client }: SubcommandRun) {
    if (client.config.DEV_GUILD !== interaction.guildId) {
      await interaction.reply({
        content: 'Not Available...',
        ephemeral: true
      })
      return
    }

    await interaction.reply({
      content: 'Reloading Events...',
      ephemeral: true
    })

    console.info('Reloading Events...', chalk.bold('cli'))
    await client.loadEvents()

    await interaction.editReply({
      content: 'Reloaded Events Successfully!'
    })
  }
}

export default PingCmd
