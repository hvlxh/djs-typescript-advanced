import { Event } from '../../structures/base/Event.js'
import bot from '../../index.js'
class ReadyEvent extends Event<'ready'> {
  constructor () {
    super({
      name: 'ready',
      once: true
    })
  }

  run () {
    console.info(`Client logged in as "${bot.user?.tag}"`)
    bot.application?.commands.set(bot.commands.array)
  }
}

export default ReadyEvent
