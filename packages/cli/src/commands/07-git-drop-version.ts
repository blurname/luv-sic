// tip: 脚本的文件名类型应为 .mjs, 如 mb-git-drop-version.mjs，方能使用 ES Modules

//
// 原理：git rebase -i, 会在 .git 目录下生成 rebase-merge/git-rebase-todo，通过编辑它，完成 rebase 操作
// 编辑文件的编辑器则是通过读取环境变量 `GIT_SEQUENCE_EDITOR` 的值（vim/nano...）来选择
// 方案：将 `GIT_SEQUENCE_EDITOR` 改为指定的脚本，参数（process.argv）中会带有 git-rebase-todo 的 path，于是可以通过读写文件内容来为所欲为，oh yeah

// 参考: https://www.the-guild.dev/blog/git-rebase-not-interactive
//
//

// 2023.03.23 因为用 node 调用了 action 文件，不知道怎么让他调用 mjs 时，和 .ts 共存，所以就把依赖都内联。难受。
// import { parseOptionList } from '@blurname/core/src/cli'
// import { colorLog } from '@blurname/core/src/colorLog'
//
//
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const colorToken = {
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Reset: '\x1b[0m',
  Yellow: '\x1b[33m'
}
const colorLog = ({ msg, fg }) => {
  return `${colorToken['Reset']}${colorToken[fg]}${msg}${colorToken['Reset']}`
}
const reduceDash = (strHasDash: string) => {
  return strHasDash.split('-').at(-1)
}
const parseOptionList = (argv: any[], kvMapFromScript: {t?: string; k?: string}) => {
  const parsedOptionList = {}
  Object.keys(kvMapFromScript).forEach((k) => {
    const paramK = argv.findIndex((arg: any) => {
      return reduceDash(arg) === k
    })
    if (paramK !== -1) {
      const paramV = argv[paramK + 1]
      parsedOptionList[k] = paramV
    }
  })
  return { ...kvMapFromScript, ...parsedOptionList }
}

const gitDropVersionDesc = 'drop Commit by commitHash && commitPrefix which default prefix is VERSION'

let options = {
  t: 'targetCommitHash',
  k: 'VERSION' // keyword
}

const gitRebaseInteractive = (scriptFilePath: string) => {
  console.log(scriptFilePath)
  const { stdout, stderr } = spawnSync('git', ['rebase', '-i', options['t']], {
    env: {
      GIT_SEQUENCE_EDITOR: gitEdit(scriptFilePath)
    }
  })
  console.log(stdout.toString())
  console.log('err', stderr.toString())
}

// 设置环境变量
const gitEdit = (scriptFilePath: any) => {
  return `node ${scriptFilePath} -t ${options['t']} -k ${options['k']} -action`
}

// 就地正法
const action = async () => {
  const [gitRebaseTodoFilePath] = process.argv.slice(-1)
  const content = (await readFile(gitRebaseTodoFilePath)).toString()
  const newOps = resolveOperations(content)
  await writeFile(gitRebaseTodoFilePath, newOps)
}

// 处理文件内容
const resolveOperations = (operations0: string) => {
  const operations = operations0
    // Replace comments
    .replace(/#.*/g, '')
    // Each line would be a cell
    .split('\n')
    // Get rid of empty lines
    .filter(Boolean)
  const opKeyword = options['k']

  const newOperations = operations.map((op: string) => {
    if (op.includes(opKeyword)) {
      // String.replace is case sensitive, 好耶
      return op.replace('pick', 'drop')
    }
    return op
  })
  newOperations.forEach((op: string | string[]) => {
    if (op.includes('drop')) {
      console.log(colorLog({ msg: op, fg: 'Red' }))
    } else {
      console.log(`  ${op}`)
    }
  })
  return newOperations.join('\n')
}

const gitDropVersion = async () => {
  const argv = process.argv
  if (!argv.includes('-action')) {
    // const [scriptFilePath] = process.argv.slice(1)
    // const tmpPath = scriptFilePath.split('/')

    // tmpPath[tmpPath.length - 1] = 'commands/07-git-drop-version-action.mjs'
    // const realPath = tmpPath.join('/')
    console.log(join(__dirname, '../../dist/commands/07-git-drop-version-action.mjs'))
    const actionPath = join(__dirname, '../../dist/commands/07-git-drop-version-action.mjs')
    console.log(actionPath)
    options = parseOptionList(argv, options)
    gitRebaseInteractive(actionPath)
  } else if (argv.includes('-action')) {
    options = parseOptionList(argv, options)
    await action()
  } else {
    console.log('input error')
  }
}

export { gitDropVersion, gitDropVersionDesc }
// 用法： node mb-git-drop-version.mjs ${commitHash}
