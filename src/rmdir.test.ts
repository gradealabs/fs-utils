import * as assert from 'assert'
import * as fs from 'fs'
import rmdir from './rmdir'

describe('rmdir', function () {
  it('should throw if the directory does not exist', function (done) {
    rmdir('.rmdir-tmp').then(() => {
      done(new Error('Error expected'))
    }, error => {
      error.code === 'ENOENT' ? done() : done(error)
    })
  })

  it('should throw if the directory is a file', function (done) {
    fs.mkdirSync('.rmdir-tmp')
    fs.appendFileSync('.rmdir-tmp/file', '', { encoding: 'utf8' })

    rmdir('.rmdir-tmp/file').then(() => {
      fs.unlinkSync('.rmdir-tmp/file')
      fs.rmdirSync('.rmdir-tmp')
      done(new Error('Error expected'))
    }, () => {
      fs.unlinkSync('.rmdir-tmp/file')
      fs.rmdirSync('.rmdir-tmp')
      done()
    })
  })

  it('should remove empty directories', function (done) {
    fs.mkdirSync('.rmdir-tmp')
    rmdir('.rmdir-tmp')
      .then(() => {
        assert.ok(!fs.existsSync('.rmdir-tmp'))
        done()
      }, done)
  })

  it('should remove directories with files and sub directories', function (done) {
    fs.mkdirSync('.rmdir-tmp')
    fs.appendFileSync('.rmdir-tmp/file', '', { encoding: 'utf8' })
    fs.mkdirSync('.rmdir-tmp/a')
    fs.mkdirSync('.rmdir-tmp/a/b')
    fs.appendFileSync('.rmdir-tmp/a/b/file', '', { encoding: 'utf8' })
    rmdir('.rmdir-tmp').then(done, done)
  })
})
