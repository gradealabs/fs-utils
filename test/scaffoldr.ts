import * as fs from 'fs'

const mkdir = dir => fs.mkdirSync(dir)
const touch = fileName => fs.appendFileSync(fileName, '', 'utf8')

/**
 * Synchronously creates a set of files and directories.
 *
 * Example:
 *
 * scaffold([
 *  'tmp/',
 *  'tmp/a.txt',
 *  'tmp/b.txt'
 * ])
 *
 * @param tree The tree of files/directories to create
 */
export function scaffold (tree: string[]) {
  const files = tree.filter(node => !node.endsWith('/'))
  const directories = tree.filter(node => node.endsWith('/'))

  directories.sort((a, b) => a.length - b.length).forEach(mkdir)
  files.forEach(touch)
}

/**
 * Synchronously delets a set of files and directories.
 *
 * Example:
 *
 * unscaffold([
 *  'tmp/',
 *  'tmp/a.txt',
 *  'tmp/b.txt'
 * ])
 *
 * @param tree The tree of files/directories to create
 */
export function unscaffold (tree: string[]) {
  const files = tree.filter(node => !node.endsWith('/'))
  const directories = tree.filter(node => node.endsWith('/'))

  files.forEach(node => fs.unlinkSync(node))
  directories.sort((a, b) => b.length - a.length)
    .forEach(node => fs.rmdirSync(node))
}
