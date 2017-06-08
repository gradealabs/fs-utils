import { spawn } from 'child_process'
import * as path from 'path'

/**
 * Runs a command via npm run.
 *
 * Example:
 * run('mycommand -arg1 value') // will call: npm run mycommand -- -arg1 value
 *
 * @param {string} cmd The command to run via npm run
 */
export default function run (cmd, $out = null) {
  const args = cmd.split(' ')

  return new Promise((resolve, reject) => {
    // npm run script -- arg arg arg ...
    let child = spawn('npm', ['run'].concat(args[0], '--', args.slice(1)), {
      cwd: path.resolve(__dirname, '..'),
      stdio: $out ? 'pipe' : 'inherit',
      env: process.env
    })

    if ($out) {
      $out.child = child
    }

    process.on('SIGINT', () => {
      if (child) {
        child.kill('SIGINT')
      }
    })

    process.on('exit', () => {
      if (child) {
        child.kill()
      }
    })

    child.on('close', () => {
      child = null
      resolve()
    })
    .on('error', error => {
      child = null
      reject(error)
    })
  })
}
