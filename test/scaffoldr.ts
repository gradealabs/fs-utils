import * as fs from 'fs'

const mkdir = dir => fs.mkdirSync(dir)
const touch = fileName => fs.appendFileSync(fileName, '', 'utf8')

export function scaffold (tree: string[]) {
  const files = tree.filter(node => !node.endsWith('/'))
  const directories = tree.filter(node => node.endsWith('/'))

  directories.sort((a, b) => a.length - b.length).forEach(mkdir)
  files.forEach(touch)
}

export function unscaffold (tree: string[]) {
  const files = tree.filter(node => !node.endsWith('/'))
  const directories = tree.filter(node => node.endsWith('/'))

  files.forEach(node => fs.unlinkSync(node))
  directories.sort((a, b) => b.length - a.length)
    .forEach(node => fs.rmdirSync(node))
}
