import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import PATH from 'node:path'

export const createFileKit = (path: string) => {
  const _rawFile = readFileSync(path).toString()
  let _modifiedFile: string | undefined
  return {
    modify: (modifyFn: (f: string) => string) => { _modifiedFile = modifyFn(_rawFile.slice()) },
    commit: () => { if (_modifiedFile) writeFileSync(path, _modifiedFile) },
    getPath: () => path,
    getFileContent: () => _rawFile
  }
}

export const findUpPackageJson = (path: string) => {
  let nextPath = path
  while (nextPath !== '/') {
    const p = PATH.join(nextPath, "package.json")
    if (existsSync(p)) return p
    nextPath = PATH.join(nextPath, "../")
  }
  throw new Error("no package.json")
}

export const createJfk = ({ path }: { path: string }) => {
  const fk = createFileKit(path)
  const _jsonKV = JSON.parse(fk.getFileContent())
  const jfk = {
    ...fk,
    getV: <T = string>(key: string): T => _jsonKV[key],
    setKV: (key: string, value: any) => {
      _jsonKV[key] = value
      fk.modify(() => JSON.stringify(_jsonKV, null, 2))
      return jfk
    },
    getJson: () => _jsonKV
  }
  return jfk
}

export const createPJFilekit = ({ path: _path }: { path: string }) => createJfk({ path: findUpPackageJson(_path) })

export const findDownPkg = (pjfk: any) => {
  const cwd = process.cwd()
  const subPkgPathList: string[] = []
  const workspaces = pjfk.getV("workspaces")
  if (!workspaces) return subPkgPathList
  for (const w of workspaces) {
    if (w.endsWith('/*')) {
      const p = PATH.join(cwd, w.split("/*")[0])
      for (const sub of readdirSync(p)) subPkgPathList.push(PATH.join(p, sub))
    } else {
      subPkgPathList.push(PATH.join(cwd, w))
    }
  }
  return subPkgPathList
}
