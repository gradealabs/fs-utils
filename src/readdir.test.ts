import * as assert from 'assert'
import * as path from 'path'
import readdir from './readdir'
import { scaffold, unscaffold } from '../test/scaffoldr'

const tree = [
  '.readdir-tmp/',
  '.readdir-tmp/e/',
  '.readdir-tmp/e/f',
  '.readdir-tmp/e/g',
  '.readdir-tmp/a',
  '.readdir-tmp/b',
  '.readdir-tmp/c',
  '.readdir-tmp/.e'
]

describe('raddir', function () {
  before(function () {
    scaffold(tree)
  })

  after(function () {
    unscaffold(tree)
  })

  it('should ignore dot files and directories', function (done) {
    readdir('.readdir-tmp', { recursive: false, filesOnly: true, noDot: true })
      .then(listing => {
        assert.deepStrictEqual(listing, [
          '.readdir-tmp/a',
          '.readdir-tmp/b',
          '.readdir-tmp/c'
        ].map(path.normalize))
      })
      .then(done, done)
  })

  it('should include dot files and directories', function (done) {
    readdir('.readdir-tmp', { recursive: false, filesOnly: false, noDot: false })
      .then(listing => {
        assert.deepStrictEqual(listing, [
          '.readdir-tmp/.e',
          '.readdir-tmp/a',
          '.readdir-tmp/b',
          '.readdir-tmp/c',
          '.readdir-tmp/e'
        ].map(path.normalize))
      })
      .then(done, done)
  })

  it('should recurse sub directories and just list files', function (done) {
    readdir('.readdir-tmp', { recursive: true, filesOnly: true, noDot: true })
      .then(listing => {
        assert.deepStrictEqual(listing, [
          '.readdir-tmp/a',
          '.readdir-tmp/b',
          '.readdir-tmp/c',
          '.readdir-tmp/e/f',
          '.readdir-tmp/e/g'
        ].map(path.normalize))
      })
      .then(done, done)
  })

  it('should recurse sub directories, but list files and directories', function (done) {
    readdir('.readdir-tmp', { recursive: true, filesOnly: false, noDot: false })
      .then(listing => {
        assert.deepStrictEqual(listing, [
          '.readdir-tmp/.e',
          '.readdir-tmp/a',
          '.readdir-tmp/b',
          '.readdir-tmp/c',
          '.readdir-tmp/e',
          '.readdir-tmp/e/f',
          '.readdir-tmp/e/g'
        ].map(path.normalize))
      })
      .then(done, done)
  })
})
