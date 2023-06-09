/* eslint-disable new-cap */
import {
  Client,
  Partials,
  ClientEvents,
  Collection,
  GatewayIntentBits as Intents,
  ChatInputApplicationCommandData,
  ApplicationCommandOptionType,
  ApplicationCommandSubGroupData
} from 'discord.js'
import chalk from 'chalk'
import Logger from './Logger.js'
import { Event } from '../base/Event.js'
import { Command } from '../base/Command.js'
import { Subcommand } from '../base/Subcommand.js'
import { readdir, stat } from 'node:fs/promises'
import { table, TableUserConfig } from 'table'

class Bot extends Client {
  public readonly config = process.env
  public readonly commands: {
    array: ChatInputApplicationCommandData[]
    collection: Collection<string, Command>
  }

  constructor () {
    super({
      intents: [
        Intents.DirectMessages,
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildMessages,
        Intents.GuildEmojisAndStickers,
        Intents.GuildPresences
      ],
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
    await this.loadEvents()
    await this.loadSlashes()

    return super.login(this.config.TOKEN)
  }

  public async loadEvents () {
    const contents = [['No.', 'Name', 'Nick', 'Once']]
    const config: TableUserConfig = {
      drawHorizontalLine: (lineIndex: number, rowCount: number) => {
        return lineIndex === 1 || lineIndex === 0 || lineIndex === rowCount
      },

      border: {
        topBody: chalk.gray('─'),
        topJoin: chalk.gray('┬'),
        topLeft: chalk.gray('┌'),
        topRight: chalk.gray('┐'),

        bottomBody: chalk.gray('─'),
        bottomJoin: chalk.gray('┴'),
        bottomLeft: chalk.gray('└'),
        bottomRight: chalk.gray('┘'),

        bodyLeft: chalk.gray('│'),
        bodyRight: chalk.gray('│'),
        bodyJoin: chalk.gray('│'),

        joinBody: chalk.gray('─'),
        joinLeft: chalk.gray('├'),
        joinRight: chalk.gray('┤'),
        joinJoin: chalk.gray('┼')
      }
    }

    console.info(chalk.bold('Loading Events...'), chalk.bold('evt'))
    if ((await stat('src/main/events')).isDirectory()) {
      const files = await readdir('./src/main/events')
      let i = 1
      for await (const file of files) {
        if (!(await stat(`src/main/events/${file}`)).isFile()) return
        const event: Event<keyof ClientEvents> = new (
          await import(`../../main/events/${file}`)
        ).default()

        if (event.options.once) {
          super.once(event.options.name, event.run)
        } else {
          super.on(event.options.name, event.run)
        }

        contents.push([
          String(`${i++}.`),
          event.options.name,
          event.options.nick || '(None)',
          event.options.once ? 'Yes' : 'No'
        ])
      }
      table(contents, config)
        .split('\n')
        .forEach(text => {
          console.info(text, chalk.bold('evt'))
        })
    }
  }

  public async loadSlashes () {
    const contents = [['No.', 'Name']]
    const config: TableUserConfig = {
      drawHorizontalLine: (lineIndex: number, rowCount: number) => {
        return lineIndex === 1 || lineIndex === 0 || lineIndex === rowCount
      },

      border: {
        topBody: chalk.gray('─'),
        topJoin: chalk.gray('┬'),
        topLeft: chalk.gray('┌'),
        topRight: chalk.gray('┐'),

        bottomBody: chalk.gray('─'),
        bottomJoin: chalk.gray('┴'),
        bottomLeft: chalk.gray('└'),
        bottomRight: chalk.gray('┘'),

        bodyLeft: chalk.gray('│'),
        bodyRight: chalk.gray('│'),
        bodyJoin: chalk.gray('│'),

        joinBody: chalk.gray('─'),
        joinLeft: chalk.gray('├'),
        joinRight: chalk.gray('┤'),
        joinJoin: chalk.gray('┼')
      }
    }

    console.info(chalk.bold('Loading Slash Commands'), chalk.bold('cmd'))
    if ((await stat('src/main/commands')).isDirectory()) {
      const files = await readdir('./src/main/commands')
      let i = 1
      for await (const file of files) {
        if ((await stat(`src/main/commands/${file}`)).isFile()) {
          const cmd: Command = new (
            await import(`../../main/commands/${file}`)
          ).default()

          this.commands.array.push(cmd.options)
          this.commands.collection.set(cmd.options.name, cmd)
          contents.push([String(`${i++}.`), cmd.options.name])
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
              const nCmd: Subcommand = new (
                await import(`../../main/commands/${file}/${nFile}`)
              ).default()

              cmd.options?.push({
                ...nCmd.options,
                type: ApplicationCommandOptionType.Subcommand
              })
              this.commands.collection.set(
                `${cmd.name}/${nCmd.options.name}`,
                nCmd
              )
              contents.push([
                String(`${i++}.`),
                `${cmd.name}/${nCmd.options.name}`
              ])
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
                contents.push([
                  String(`${i++}.`),
                  `${cmd.name}/${nCmd.name}/${nnCmd.options.name}`
                ])
              }

              cmd.options?.push(nCmd)
            }
          }

          this.commands.array.push(cmd)
        }
      }
    }

    table(contents, config)
      .split('\n')
      .forEach(c => {
        console.info(c, chalk.bold('cmd'))
      })
  }
}

export default Bot
