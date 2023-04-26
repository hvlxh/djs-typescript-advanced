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

export abstract class Command {
  readonly options: ChatInputApplicationCommandData

  constructor (options: ChatInputApplicationCommandData) {
    this.options = options
  }

  public abstract run(options: CommandRun): void
}
