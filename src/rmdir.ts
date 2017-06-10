import * as fs from 'fs'
import * as path from 'path'

function readdir (dir: string) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(dir, (error, files) => error ? reject(error) : resolve(files))
  })
}

function stat (file: string) {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(file, (error, stats) => error ? reject(error) : resolve(stats))
  })
}

function unlink (file: string) {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(file, error => error ? reject(error) : resolve())
  })
}

/**
 * Removes a directory and its contents. Similar behaviour as calling
 * `rm -fr {path}` in Bash.
 */
export default function rmdir (dirPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.rmdir(dirPath, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  }).catch(error => {
    if (error.code === 'ENOTEMPTY' || error.code === 'EPERM') {
      return readdir(dirPath).then(files => {
        files = files.map(file => path.join(dirPath, file))
        return Promise.all(
          files.map(
            file => stat(file).then(stats => {
              return { path: file, stats }
            }).catch(error => {
              if (error.code === 'EPERM' || error.code === 'ENOENT') {
                return null
              } else {
                return Promise.reject(error)
              }
            })
          )
        ).then(results => {
          return {
            dirs: results.filter(Boolean)
              .filter(({ stats }) => stats.isDirectory())
              .map(({ path }) => path),
            files: results.filter(Boolean)
              .filter(({ stats }) => stats.isFile())
              .map(({ path }) => path)
          }
        }).then(({ dirs, files }) => {
          return Promise.all(files.map(unlink)).then(() => {
            return Promise.all(dirs.map(rmdir))
          }).then(() => rmdir(dirPath))
        })
      })
    } else {
      return Promise.reject(error)
    }
  })
}
