import { Event } from '../../structures/base/Event.js'

class ReadyEvent extends Event<'ready'> {
  constructor () {
    super({
      name: 'ready',
      once: true
    })
  }

  run () {
    console.info('Hello', 'Client')
  }
}

export default ReadyEvent
