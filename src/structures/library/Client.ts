import { Client, Partials, ClientEvents } from 'discord.js'
import { readdir, stat } from 'node:fs/promises'

import Logger from './Logger.js'
import config from '../../config.json' assert { type: 'json' }
import { Event } from '../base/Event.js'

class Bot extends Client {
  public readonly config = config

  constructor () {
    super({
      intents: '3146241',
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User
      ]
    })

    Logger()
  }

  override async login () {
    Promise.all([this.loadEvents()])

    return super.login(config.token)
  }

  private async loadEvents () {
    if ((await stat('src/main/events')).isDirectory()) {
      const files = await readdir('./src/main/events')
      for await (const file of files) {
        if (!(await stat(`src/main/events/${file}`)).isFile()) return
        const event: Event<keyof ClientEvents> =
          new // eslint-disable-next-line new-cap
          (await import(`../../main/events/${file}`)).default()

        if (event.options.once) {
          super.once(event.options.name, event.run)
        } else {
          super.on(event.options.name, event.run)
        }
      }
    }
  }
}

export default Bot
