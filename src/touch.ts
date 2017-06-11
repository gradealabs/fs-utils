import * as fs from 'fs'

export default function touch (fileName) {
  return new Promise((resolve, reject) => {
    fs.stat(fileName, (error, stats) => {
      if (error) {
        resolve({ fileName, exists: false })
      } else if (stats.isFile()) {
        resolve({ fileName, exists: true })
      } else {
        reject(new Error(`${fileName} is not a file so cannot be touched`))
      }
    })
  }).then(({ fileName, exists }) => {
    if (exists) {
      return new Promise<number>((resolve, reject) => {
        fs.open(fileName, 'r+', (error, fd) => {
          error ? reject(error) : resolve(fd)
        })
      }).then(fd => {
        return new Promise<{stats:fs.Stats, fd:number}>((resolve, reject) => {
          fs.stat(fileName, (error, stats) => {
            error ? reject(error) : resolve({ stats, fd })
          })
        })
      }).then(({ fd, stats }) => {
        return new Promise((resolve, reject) => {
          fs.futimes(fd, stats.atime.getTime(), Date.now(), error => {
            error ? reject(error) : resolve()
          })
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        fs.appendFile(fileName, '', 'utf8', error => {
          error ? reject(error) : resolve()
        })
      })
    }
  })
}
