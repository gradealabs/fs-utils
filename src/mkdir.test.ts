import * as assert from 'assert'
import * as fs from 'fs'
import mkdir from './mkdir'

describe('mkdir', function () {
  it('should make a directory and all missing directories in the path', function (done) {
    mkdir('.mkdir-tmp/a/b/c/d')
    .then(() => assert.ok(fs.existsSync('.mkdir-tmp/a/b/c/d')))
    .then(() => mkdir('.mkdir-tmp/a/b/c/d/e/f'))
    .then(() => assert.ok(fs.existsSync('.mkdir-tmp/a/b/c/d/e/f')))
    .then(() => mkdir('.mkdir-tmp/a/b/c/d/e/f'))
    .then(() => assert.ok(fs.existsSync('.mkdir-tmp/a/b/c/d/e/f')))
    .then(() => fs.writeFileSync('.mkdir-tmp/a/b/c/d/e/f/g', '', { encoding: 'utf8' }))
    .then(() => mkdir('.mkdir-tmp/a/b/c/d/e/f/g/h'))
    .catch(error => assert.strictEqual(error.code, 'ENOTDIR'))
    .then(() => {
      fs.unlinkSync('.mkdir-tmp/a/b/c/d/e/f/g')
      fs.rmdirSync('.mkdir-tmp/a/b/c/d/e/f')
      fs.rmdirSync('.mkdir-tmp/a/b/c/d/e')
      fs.rmdirSync('.mkdir-tmp/a/b/c/d')
      fs.rmdirSync('.mkdir-tmp/a/b/c')
      fs.rmdirSync('.mkdir-tmp/a/b')
      fs.rmdirSync('.mkdir-tmp/a')
      fs.rmdirSync('.mkdir-tmp')
    })
    .then(done, done)
  })
})
