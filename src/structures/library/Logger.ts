import chalk from 'chalk'

type LogType = 'info' | 'warn' | 'error' | 'debug'

function Logger () {
  for (const what of ['info', 'warn', 'error', 'debug']) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const backup = console[what]
    const d = new Date().toLocaleString().replace(',', '').toUpperCase()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console[what] = (text: string, group?: text) => {
      if (group) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        backup(`[${d} ${colorize(what)}] [${group}] ${text}`)
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        backup(`[${d} ${colorize(what)}] ${text}`)
      }
    }
  }
}

const colorize = (level: LogType): string => {
  const obj = {
    info: chalk.green('INFO'),
    warn: chalk.yellow('WARN'),
    error: chalk.red('ERROR'),
    debug: chalk.whiteBright('DEBUG')
  }

  return obj[level]
}

export default Logger
