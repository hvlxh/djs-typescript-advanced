import { ClientEvents } from 'discord.js'

export interface EventOptions<Key extends keyof ClientEvents> {
  name: Key
  nick?: string
  once?: boolean
}

export abstract class Event<Key extends keyof ClientEvents> {
  readonly options: EventOptions<keyof ClientEvents>

  constructor (options: EventOptions<keyof ClientEvents>) {
    this.options = options
  }

  public abstract run(...args: ClientEvents[Key]): void
}
