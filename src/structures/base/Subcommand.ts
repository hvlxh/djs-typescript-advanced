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

export abstract class Subcommand {
  readonly options: Omit<ApplicationCommandSubCommandData, 'type'>

  constructor (options: Omit<ApplicationCommandSubCommandData, 'type'>) {
    this.options = options
  }

  public abstract run(options: SubcommandRun): void
}
