import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver
} from 'discord.js'
import Bot from '../library/Client.js'

export interface CommandRun {
  interaction: CommandInteraction
  options: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>
  client: Bot
}

interface CommandOptions extends ChatInputApplicationCommandData {
  dev?: boolean
}

export abstract class Command {
  readonly options: CommandOptions

  constructor (options: CommandOptions) {
    this.options = options
  }

  public abstract run(options: CommandRun): void
}
