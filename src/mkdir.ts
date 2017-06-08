import * as fs from 'fs'
import * as path from 'path'

/**
 * Makes a directory path and any directories in that path. Similar behaviour as
 * calling `mkdir -p {path}` in Bash.
 */
export default function mkdir (dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  }).catch(error => {
    if (error.code === 'EEXIST') {
      return Promise.resolve()
    } else if (error.code === 'ENOENT') {
      return mkdir(path.dirname(dir)).then(() => {
        return mkdir(dir)
      })
    } else {
      return Promise.reject(error)
    }
  })
}
