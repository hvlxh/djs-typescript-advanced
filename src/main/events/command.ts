import { Event } from '../../structures/base/Event.js'
import { Interaction } from 'discord.js'
import bot from '../../index.js'

class Command extends Event<'interactionCreate'> {
  constructor () {
    super({
      name: 'interactionCreate',
      nick: 'commandCreated'
    })
  }

  run (interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      let cmd

      try {
        if (interaction.options.getSubcommandGroup()) {
          const subCmd = interaction.options.getSubcommand()
          const subGroupCmd = interaction.options.getSubcommandGroup()

          cmd = bot.commands.collection.get(
            `${interaction.commandName}/${subGroupCmd}/${subCmd}`
          )
        } else if (interaction.options.getSubcommand()) {
          const subCmd = interaction.options.getSubcommand()
          cmd = bot.commands.collection.get(
            `${interaction.commandName}/${subCmd}`
          )
        }
      } catch {
        cmd = bot.commands.collection.get(interaction.commandName)
      }

      if (!cmd) {
        return interaction.reply({
          content: 'Command Not Found.',
          ephemeral: true
        })
      }

      const runOptions = {
        client: bot,
        options: interaction.options,
        interaction
      }

      cmd.run(runOptions)
    }
  }
}

export default Command
