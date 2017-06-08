import * as yargs from 'yargs'
import clean from './index'

if (require.main === module) {
  yargs(process.argv.slice(2))
    .usage('Usage: $0 file file ...')
    .help()

  const argv = yargs.argv

  if (argv._.length === 0) {
    yargs.showHelp()
  } else {
    const start = new Date().getTime()
    clean(argv._)
      .then(() => new Date().getTime() - start)
      .then(elapsed => {
        console.log('Clean complete!', (elapsed / 1000).toFixed(2), 'seconds')
      })
      .catch(error => console.error(error))
  }
} else {
  throw new Error(
    'clean/cli is only meant to be run at the command line'
  )
}
