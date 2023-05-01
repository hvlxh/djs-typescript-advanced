import 'dotenv/config.js'
import Bot from './structures/library/Client.js'
const bot = new Bot()

bot.login()
export default bot
