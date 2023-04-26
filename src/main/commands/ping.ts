import { Command, CommandRun } from '../../structures/base/Command.js'

class PingCmd extends Command {
  constructor () {
    super({
      name: 'ping',
      description: 'Get the bot latency'
    })
  }

  run ({ interaction }: CommandRun) {
    interaction.reply('Hello 1')
  }
}

export default PingCmd
