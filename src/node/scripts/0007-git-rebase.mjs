#!/usr/bin/env node
import child_process from 'node:child_process'
// Main
// 1
// 2
// 3
const main = () => {
  const [commitHash] = process.argv.slice(-2)
  gitRebaseInteractive(commitHash)
}
main()

// Runs a git-rebase-interactive in a non interactive manner by providing a script
// which will handle things automatically
function gitRebaseInteractive(head) {
  child_process.spawnSync('git', ['rebase', '-i', head], {
    env: {
      GIT_SEQUENCE_EDITOR: gitEdit(),
    },
  })
}

// Evaluates a script in a new process which should edit a git file.
// The input of the provided function should be the contents of the file and the output
// should be the new contents of the file
function gitEdit() {
  //fn()
  //const gitRebaseInteractive =
  //(anchor,
  //(operations, amount) => {
  //operations = operations
  //// Replace comments
  //.replace(/#.*/g, '')
  //// Each line would be a cell
  //.split('\n')
  //// Get rid of empty lines
  //.filter(Boolean)

  //const anchorPos = operations.findIndex(anchor)
  //console.log('pos', anchorPos)

  //// Commits we would like to drop
  //const dropOperations = operations
  //.slice(0, anchorPos)
  //.filter((operation) => operation.includes('num'))
  //.map((operation) => operation.replace('pick', 'fixup'))
  //console.log(dropOperations)
  //// Commits we would like to pick
  //const pickOperations = operations.filter((operation) => !operation.includes('num'))
  //console.log(pickOperations)

  //// Composing final rebase file
  //return [].concat(dropOperations).concat(pickOperations).join('\n')
  //})
  return 'console.log("hellow")'
}
export {}
