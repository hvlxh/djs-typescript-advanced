import {
  ApplicationCommandSubCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver
} from 'discord.js'
import Bot from '../library/Client.js'

export interface SubcommandRun {
  interaction: CommandInteraction
  options: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>
  client: Bot
}

interface SubcommandOptions extends ApplicationCommandSubCommandData {
  dev?: boolean
}

export abstract class Subcommand {
  readonly options: Omit<SubcommandOptions, 'type'>

  constructor (options: Omit<SubcommandOptions, 'type'>) {
    this.options = options
  }

  public abstract run(options: SubcommandRun): void
}
