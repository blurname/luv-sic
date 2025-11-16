import {createPJFilekit, PJFK} from "@blurname/core/src/node/fileKit.js"
import {LG} from "@blurname/core/src/colorLog.js"
import {parseArg} from "@blurname/core/src/node/cli.js"

const fileReplaceKVEff = (pjfk: PJFK,subPkgPathL: string[]) => {
  const arg =  parseArg(process.argv,{
    'nk': {desc:'key', type: 'string'},
    'nv': {desc:'next value', type: 'string'},
  })
  const nk = arg.nk
  const nv = arg.nv
  pjfk.setKV(nk,nv)
  pjfk.commit()
  const rootPathList = pjfk.getPath().split('/')
  rootPathList.pop()
  const rootPath = rootPathList.join('/') + '/' 

  for (const pkgPath of subPkgPathL) {
    const subPjfk = createPJFilekit({path: pkgPath})
    const content = ' ' + subPjfk.getPath().replace(rootPath, '')
    // temp-fix: skip this strange scenario
    if(content.trim() === '/package.json') continue
    subPjfk.setKV(nk, nv)
    subPjfk.commit()
    // subPackageJsonString += content
  }

  LG.success(`replace ${nk} value to ${nv}`)
}
export {
  fileReplaceKVEff
}
