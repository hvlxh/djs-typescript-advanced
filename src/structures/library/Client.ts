/* eslint-disable new-cap */
import {
  Client,
  Partials,
  ClientEvents,
  Collection,
  ChatInputApplicationCommandData,
  ApplicationCommandOptionType,
  ApplicationCommandSubGroupData
} from 'discord.js'
import { readdir, stat } from 'node:fs/promises'

import Logger from './Logger.js'
import config from '../../config.json' assert { type: 'json' }
import { Event } from '../base/Event.js'
import { Command } from '../base/Command.js'
import { Subcommand } from '../base/Subcommand.js'

class Bot extends Client {
  public readonly config = config
  public readonly commands: {
    array: ChatInputApplicationCommandData[]
    collection: Collection<string, Command>
  }

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

    this.commands = {
      array: [],
      collection: new Collection()
    }
    Logger()
  }

  override async login () {
    Promise.all([this.loadEvents(), this.loadSlashes()])

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

  private async loadSlashes () {
    if ((await stat('src/main/commands')).isDirectory()) {
      const files = await readdir('./src/main/commands')
      for await (const file of files) {
        if ((await stat(`src/main/commands/${file}`)).isFile()) {
          const cmd: Command = new // eslint-disable-next-line new-cap
          (await import(`../../main/commands/${file}`)).default()

          this.commands.array.push(cmd.options)
          this.commands.collection.set(cmd.options.name, cmd)
        } else {
          const cmd: ChatInputApplicationCommandData = {
            name: file.toLowerCase(),
            description: 'No description provided',
            options: []
          }

          for await (const nFile of await readdir(
            `src/main/commands/${file}`
          )) {
            if ((await stat(`src/main/commands/${file}/${nFile}`)).isFile()) {
              const nCmd: Subcommand = new // eslint-disable-next-line new-cap
              (await import(`../../main/commands/${file}/${nFile}`)).default()

              cmd.options?.push({
                ...nCmd.options,
                type: ApplicationCommandOptionType.Subcommand
              })
              this.commands.collection.set(
                `${cmd.name}/${nCmd.options.name}`,
                nCmd
              )
            } else {
              const nCmd: ApplicationCommandSubGroupData = {
                name: nFile.toLowerCase(),
                description: 'No description provided',
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: []
              }

              for await (const nnFile of await readdir(
                `src/main/commands/${file}/${nFile}`
              )) {
                const nnCmd: Subcommand = new (
                  await import(`../../main/commands/${file}/${nFile}/${nnFile}`)
                ).default()

                nCmd.options?.push({
                  ...nnCmd.options,
                  type: ApplicationCommandOptionType.Subcommand
                })
                this.commands.collection.set(
                  `${cmd.name}/${nCmd.name}/${nnCmd.options.name}`,
                  nnCmd
                )
              }

              cmd.options?.push(nCmd)
            }
          }

          this.commands.array.push(cmd)
        }
      }
    }
  }
}

export default Bot
