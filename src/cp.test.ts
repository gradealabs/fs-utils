import * as assert from 'assert'
import * as fs from 'fs'
import { scaffold } from '../test/scaffoldr'
import rmdir from './rmdir'
import cp from './cp'

const tree = [
  '.cp-tmp/',
  '.cp-tmp/a',
  '.cp-tmp/b/',
  '.cp-tmp/b/c',
  '.cp-tmp/b/d',
  '.cp-tmp/b/.e'
]

describe('cp', function () {
  beforeEach(function () {
    scaffold(tree)
  })

  afterEach(function () {
    return rmdir('.cp-tmp')
  })

  it('should throw when copying a directory to an existing file', function (done) {
    cp('.cp-tmp/b', '.cp-tmp/a', { newerOnly: false, noDot: false })
      .then(() => done(new Error('Expected an erro to be thrown')))
      .catch(error => error.code === 'EFILEDEST' ? done() : done(error))
  })

  it('should copy files and create output path', function (done) {
    cp('.cp-tmp/a', '.cp-tmp/out/', { newerOnly: false, noDot: false })
      .then(() => {
        assert.ok(fs.statSync('.cp-tmp/out/a').isFile())
      })
      .then(done, done)
  })

  it('should copy directories and create output path', function (done) {
    cp('.cp-tmp/b', '.cp-tmp/out/', { newerOnly: false, noDot: false })
      .then(() => {
        assert.deepStrictEqual(fs.readdirSync('.cp-tmp/out/b'), [
          '.e',
          'c',
          'd'
        ])
      })
      .then(done, done)
  })

  it('should copy directory contents and create output path', function (done) {
    cp('.cp-tmp/b/', '.cp-tmp/out/', { newerOnly: false, noDot: false })
      .then(() => {
        assert.deepStrictEqual(fs.readdirSync('.cp-tmp/out'), [
          '.e',
          'c',
          'd'
        ])
      })
      .then(done, done)
  })

  it('should only copy newer files', function (done) {
    this.timeout(3000)

    cp('.cp-tmp/a', '.cp-tmp/out/', { newerOnly: true })
      .then(() => fs.statSync('.cp-tmp/out/a'))
      .then(s => cp('.cp-tmp/a', '.cp-tmp/out', { newerOnly: true }).then(() => s))
      .then(s => {
        const destStats = fs.statSync('.cp-tmp/out/a')
        assert.strictEqual(destStats.mtime.getTime(), s.mtime.getTime())
        return s
      })
      .then(s => {
        return new Promise<fs.Stats>((resolve, reject) => {
          setTimeout(() => resolve(s), 1200)
        })
      })
      .then(s => {
        fs.appendFileSync('.cp-tmp/a', 'r', 'utf8')
        return s
      })
      .then(s => cp('.cp-tmp/a', '.cp-tmp/out').then(() => s))
      .then(s => {
        const destStats = fs.statSync('.cp-tmp/out/a')
        assert.ok(destStats.mtime.getTime() > s.mtime.getTime())
      })
      .then(done, done)
  })
})
