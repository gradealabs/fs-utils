import * as assert from 'assert'
import * as fs from 'fs'
import mkdir from './mkdir'

describe('mkdir', function () {
  it('should make a directory and all missing directories in the path', function (done) {
    mkdir('.tmp/a/b/c/d')
    .then(() => assert.ok(fs.existsSync('.tmp/a/b/c/d')))
    .then(() => mkdir('.tmp/a/b/c/d/e/f'))
    .then(() => assert.ok(fs.existsSync('.tmp/a/b/c/d/e/f')))
    .then(() => mkdir('.tmp/a/b/c/d/e/f'))
    .then(() => assert.ok(fs.existsSync('.tmp/a/b/c/d/e/f')))
    .then(() => fs.writeFileSync('.tmp/a/b/c/d/e/f/g', '', 'utf8'))
    .then(() => mkdir('.tmp/a/b/c/d/e/f/g/h'))
    .catch(error => assert.strictEqual(error.code, 'ENOTDIR'))
    .then(() => {
      fs.unlinkSync('.tmp/a/b/c/d/e/f/g')
      fs.rmdirSync('.tmp/a/b/c/d/e/f')
      fs.rmdirSync('.tmp/a/b/c/d/e')
      fs.rmdirSync('.tmp/a/b/c/d')
      fs.rmdirSync('.tmp/a/b/c')
      fs.rmdirSync('.tmp/a/b')
      fs.rmdirSync('.tmp/a')
      fs.rmdirSync('.tmp')
    })
    .then(done, done)
  })
})
