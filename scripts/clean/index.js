import * as fs from 'fs'
import rmdir from '../../src/rmdir'

/**
 * Delete files and directories.
 *
 * @param {string[]} filesOrDirectories The files and/or directories to delete
 * @return {Promise<void>}
 */
export default function clean (filesOrDirectories) {
  return Promise.all(
    filesOrDirectories.map(fileName => {
      return new Promise((resolve, reject) => {
        fs.unlink(fileName, error => {
          if (error && error.code === 'EPERM') {
            rmdir(fileName).then(resolve, reject)
          } else if (error) {
            if (error.code === 'ENOENT') {
              resolve()
            } else {
              reject(error)
            }
          }
        })
      })
    })
  )
}
