// tip: 脚本的文件名类型应为 .mjs, 如 mb-git-drop-version.mjs，方能使用 ES Modules

//
// 原理：git rebase -i, 会在 .git 目录下生成 rebase-merge/git-rebase-todo，通过编辑它，完成 rebase 操作
// 编辑文件的编辑器则是通过读取环境变量 `GIT_SEQUENCE_EDITOR` 的值（vim/nano...）来选择
// 方案：将 `GIT_SEQUENCE_EDITOR` 改为指定的脚本，参数（process.argv）中会带有 git-rebase-todo 的 path，于是可以通过读写文件内容来为所欲为，oh yeah

// 参考: https://www.the-guild.dev/blog/git-rebase-not-interactive
//
//

// 2023.03.23 因为用 node 调用了 action 文件，不知道怎么让他调用 mjs 时，和 .ts 共存，所以就把依赖都内联。难受。 done
import { spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { colorLog } from '@blurname/core/src/colorLog'
import { parseOptionList } from '@blurname/core/src/cli'
import { getLogList } from '../util/git.js'
import { createFzfKit } from '../util/fzf.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const gitDropVersionDesc = 'drop Commit by commitHash && commitPrefix which default prefix is VERSION'

let options = {
  t: 'targetCommitHash',
  k: 'VERSION',
  I: false
} as any

const gitRebaseInteractive = (scriptFilePath: string) => {
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
  newOperations.forEach((op: string) => {
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
    const actionPath = join(__dirname, '../../dist/commands/07-git-drop-version-action.mjs')
    const runCallback = (selectKey:string) => {
      const commitHash = selectKey.split(' ')[0]
      options.t = commitHash
      gitRebaseInteractive(actionPath)
    }
    options = parseOptionList(argv, options)
    if (options['I']) {
      const fzfKit = createFzfKit({ fzfStringList: getLogList() })
      fzfKit.runFzf({ runCallback })
    } else {
      gitRebaseInteractive(actionPath)
    }
  } else if (argv.includes('-action')) {
    options = parseOptionList(argv, options)
    await action()
  } else {
    console.log('input error')
  }
}

export { gitDropVersion, gitDropVersionDesc }
// 用法： node mb-git-drop-version.mjs ${commitHash}
