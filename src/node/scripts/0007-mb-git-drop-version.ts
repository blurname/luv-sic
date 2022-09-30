// tip: 脚本的文件名类型应为 .mjs, 如 mb-git-drop-version.mjs，方能使用 ES Modules

//
// 原理：git rebase -i, 会在 .git 目录下生成 rebase-merge/git-rebase-todo，通过编辑它，完成 rebase 操作
// 编辑文件的编辑器则是通过读取环境变量 `GIT_SEQUENCE_EDITOR` 的值（vim/nano...）来选择
// 方案：将 `GIT_SEQUENCE_EDITOR` 改为指定的脚本，参数（process.argv）中会带有 git-rebase-todo 的 path，于是可以通过读写文件内容来为所欲为，oh yeah

// 参考: https://www.the-guild.dev/blog/git-rebase-not-interactive
//
import { parseOptionList } from '../cli'
import { spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'

let options = {
  t: 'targetCommitHash',
  k: 'VERSION', // keyword
}

const gitRebaseInteractive = (scriptFilePath) => {
  const { stdout, stderr } = spawnSync('git', ['rebase', '-i', options['t']], {
    env: {
      GIT_SEQUENCE_EDITOR: gitEdit(scriptFilePath),
    },
  })
  console.log(stdout.toString())
  console.log('err', stderr.toString())
}

// 设置环境变量
const gitEdit = (scriptFilePath) => {
  return `tsx ${scriptFilePath} -t ${options['t']} -k ${options['k']} -action`
}

// 就地正法
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
  const opKeyword = options['k']

  const newOperations = operations.map((op) => {
    if (op.includes(opKeyword)) {
      // String.replace is case sensitive, 好耶
      return op.replace('pick', 'drop')
    }
    return op
  })
  newOperations.forEach((op) => {
    if (op.includes('drop')) {
      console.log(`  ${Reset}${FgRed}${op}${Reset}`)
    } else {
      console.log(`  ${op}`)
    }
  })
  return newOperations.join('\n')
}

const main = () => {
  const argv = process.argv
  if (!argv.includes('-action')) {
    const [scriptFilePath] = process.argv.slice(1)
    console.log('path', scriptFilePath)
    options = parseOptionList(argv, options)
    console.log(options)
    gitRebaseInteractive(scriptFilePath)
  } else if (argv.includes('-action')) {
    options = parseOptionList(argv, options)
    action()
  } else {
    console.log('input error')
  }
}

main()
const FgRed = '\x1b[31m'
const Reset = '\x1b[0m'
export {}
// 用法： node mb-git-drop-version.mjs ${commitHash}
