import {
  Subcommand,
  SubcommandRun
} from '../../../structures/base/Subcommand.js'

class PingCmd extends Subcommand {
  constructor () {
    super({
      name: 'ping',
      description: 'Get the bot latency'
    })
  }

  run ({ interaction }: SubcommandRun) {
    interaction.reply('Hello 2')
  }
}

export default PingCmd
