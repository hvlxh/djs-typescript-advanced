import {
  Subcommand,
  SubcommandRun
} from '../../../../structures/base/Subcommand.js'
import chalk from 'chalk'

class PingCmd extends Subcommand {
  constructor () {
    super({
      name: 'commands',
      description: 'Reload the commands',
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
      content: 'Reloading Commands...',
      ephemeral: true
    })

    console.info('Reloading Commands...', chalk.bold('cli'))
    await client.loadSlashes()

    await interaction.editReply({
      content: 'Reloaded Commands Successfully!'
    })
  }
}

export default PingCmd
