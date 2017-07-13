import * as assert from 'assert'
import * as fs from 'fs'
import rmdirfiles from './rmdirfiles'
import rmdir from './rmdir'

describe('rmdirfiles', function () {
  afterEach(function () {
    return rmdir('.rmdirfiles-tmp')
      .catch(error => {
        if (error.code !== 'ENOENT') {
          return Promise.reject(error)
        } else {
          return Promise.resolve()
        }
      })
  })

  it('should throw if the directory does not exist', function (done) {
    rmdirfiles('.rmdirfiles-tmp').then(() => {
      done(new Error('Error expected'))
    }, error => {
      error.code === 'ENOENT' ? done() : done(error)
    })
  })

  it('should throw if the directory is a file', function (done) {
    fs.mkdirSync('.rmdirfiles-tmp')
    fs.appendFileSync('.rmdirfiles-tmp/file', '', { encoding: 'utf8' })

    rmdirfiles('.rmdirfiles-tmp/file').then(() => {
      fs.unlinkSync('.rmdirfiles-tmp/file')
      fs.rmdirSync('.rmdirfiles-tmp')
      done(new Error('Error expected'))
    }, () => {
      fs.unlinkSync('.rmdirfiles-tmp/file')
      fs.rmdirSync('.rmdirfiles-tmp')
      done()
    })
  })

  it('should remove no files from empty directories', function (done) {
    fs.mkdirSync('.rmdirfiles-tmp')
    rmdirfiles('.rmdirfiles-tmp')
      .then(() => {
        assert.ok(fs.existsSync('.rmdirfiles-tmp'))
        assert.deepStrictEqual(fs.readdirSync('.rmdirfiles-tmp'), [])
        done()
      })
      .catch(done)
  })

  it('should remove directories with files and sub directories', function (done) {
    fs.mkdirSync('.rmdirfiles-tmp')
    fs.appendFileSync('.rmdirfiles-tmp/file', '', { encoding: 'utf8' })
    fs.mkdirSync('.rmdirfiles-tmp/a')
    fs.mkdirSync('.rmdirfiles-tmp/a/b')
    fs.appendFileSync('.rmdirfiles-tmp/a/b/file', '', { encoding: 'utf8' })
    rmdirfiles('.rmdirfiles-tmp')
      .then(() => {
        assert.ok(fs.existsSync('.rmdirfiles-tmp'))
        assert.deepStrictEqual(fs.readdirSync('.rmdirfiles-tmp'), [])
        done()
      })
      .catch(done)
  })
})
