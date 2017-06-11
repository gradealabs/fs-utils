import * as assert from 'assert'
import * as fs from 'fs'
import { scaffold } from '../test/scaffoldr'
import rmdir from './rmdir'
import touch from './touch'

const tree = [
  '.tmp/',
  '.tmp/a'
]

describe('touch', function () {
  beforeEach(function () {
    scaffold(tree)
  })

  afterEach(function () {
    return rmdir('.tmp')
  })

  it('should throw when attempting to touch directories', function (done) {
    touch('.tmp')
      .then(() => done(new Error('Expected error to be thrown')))
      .catch(() => done())
  })

  it('should change the mtime of existing files', function (done) {
    this.timeout(3000)
    const stats = fs.statSync('.tmp/a')
    setTimeout(function() {
      touch('.tmp/a')
        .then(() => {
          const s = fs.statSync('.tmp/a')
          assert.ok(s.mtime.getTime() > stats.mtime.getTime())
        })
        .then(done, done)
    }, 1500)
  })

  it('should create an empty touched file', function (done) {
    touch('.tmp/b')
      .then(() => assert.ok(fs.existsSync('.tmp/b')))
      .then(done, done)
  })
})
