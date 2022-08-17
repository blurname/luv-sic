#!/usr/bin/env node

//
// 原理：git rebase -i, 会在 .git 目录下生成 rebase-merge/git-rebase-todo，通过编辑它，完成 rebase 操作
// 编辑文件的编辑器则是通过读取环境变量 `GIT_SEQUENCE_EDITOR` 的值（vim/nano...）来选择
// 方案：将 `GIT_SEQUENCE_EDITOR` 改为指定的脚本，参数（process.argv）中会带有 git-rebase-todo 的 path，于是可以通过读写文件内容来为所欲为，oh yeah

// 参考: https://www.the-guild.dev/blog/git-rebase-not-interactive
//
import child_process from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'

const gitRebaseInteractive = (scriptFilePath, commitHash) => {
  const { stdout, stderr } = child_process.spawnSync('git', ['rebase', '-i', commitHash], {
    env: {
      GIT_SEQUENCE_EDITOR: gitEdit(scriptFilePath, commitHash),
    },
  })
  //console.log(stdout.toString())
  console.log('err', stderr.toString())
}

const gitEdit = (scriptFilePath, commitHash) => {
  return `node ${scriptFilePath} ${commitHash}`
}

//
const action = async () => {
  const [gitRebaseTodoFilePath] = process.argv.slice(-1)
  const content = (await readFile(gitRebaseTodoFilePath)).toString()
  const newOps = resolveOperations(content)
  await writeFile(gitRebaseTodoFilePath, newOps)
}
// 处理文件内容
const resolveOperations = (operations0) => {
  const operations = operations0
    //Replace comments
    .replace(/#.*/g, '')
    // Each line would be a cell
    .split('\n')
    // Get rid of empty lines
    .filter(Boolean)
  const opKeyword = 'VERSION'

  const newOperations = operations.map((op) => {
    if (op.includes(opKeyword)) {
      // String.replace is case sensitive, 好耶
      return op.replace('pick', 'drop')
    }
    return op
  })
  return newOperations.join('\n')
}

const main = () => {
  const argvLength = process.argv.length
  if (argvLength === 3) {
    console.log('argvLength', process.argv.slice(-2))
    const [scriptFilePath, commitHash] = process.argv.slice(-2)

    gitRebaseInteractive(scriptFilePath, commitHash)
  } else if (argvLength === 4) {
    action()
  } else {
    console.log('input error')
  }
}

main()
