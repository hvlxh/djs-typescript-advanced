import 'dotenv/config.js'
import Bot from './structures/library/Client.js'
const bot = new Bot()

bot.login().then(() => {
  ;[
    'unhandledRejection',
    'uncaughtException',
    'uncaughtExceptionMonitor'
  ].forEach(str => {
    process.on(str, console.error)
  })
})
export default bot
