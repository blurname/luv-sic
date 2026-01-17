import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { getCallPath } from '@blurname/core/src/node/cli'

const EXTRA_FILES = ['.env.local']
const SEP = '__'

const copyWithVersionDesc = '复制当前目录下非 gitignore 的文件到上一层的新同名带数字文件夹 (支持 sync 子命令)'

const getCurBranch = (cwd: string) => {
  try {
    return execSync('git branch --show-current', { cwd }).toString().trim()
  } catch (e) {
    return ''
  }
}

const getBaseName = (currentPath: string, currentDirName: string) => {
  try {
    const pkgPath = path.join(currentPath, 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      if (pkg.name) {
        // 去掉 scoped name 的前缀 @xxx/
        const name = pkg.name.split('/').pop()
        return name
      }
    }
  } catch (e) {}
  
  // 如果没有 package.json，尝试从目录名中提取（使用新的分隔符 __）
  const parts = currentDirName.split(SEP)
  return parts[0]
}

const copyWithVersion = async () => {
  const currentPath = getCallPath()
  const parentPath = path.dirname(currentPath)
  const currentDirName = path.basename(currentPath)
  
  const baseName = getBaseName(currentPath, currentDirName)
  const subCommand = process.argv[3]

  if (subCommand === 'sync') {
    await syncExtraFiles(currentPath, parentPath, baseName, currentDirName)
    return
  }

  if (subCommand === 'rb') {
    await renameByBranch(currentPath, parentPath, baseName, currentDirName)
    return
  }

  // 默认执行原来的复制逻辑
  await doCopyWithVersion(currentPath, parentPath, baseName)
}

const renameByBranch = async (currentPath: string, parentPath: string, baseName: string, currentDirName: string) => {
  const branch = getCurBranch(currentPath)
  if (!branch) {
    console.log('无法获取当前 Git 分支，重命名取消。')
    return
  }

  // 使用 __ 分隔符提取信息: 项目名__数字__分支名
  const parts = currentDirName.split(SEP)
  let version = ''
  
  // 检查当前文件夹名是否符合新格式且属于该项目
  if (parts.length >= 2 && parts[0] === baseName && /^\d+$/.test(parts[1])) {
    version = parts[1]
  } else {
    // 如果当前文件夹没有正确的新格式，则找一个新版本号
    const items = fs.readdirSync(parentPath)
    let maxVersion = 0
    items.forEach(item => {
      const p = item.split(SEP)
      if (p.length >= 2 && p[0] === baseName && /^\d+$/.test(p[1])) {
        const v = parseInt(p[1], 10)
        if (v > maxVersion) maxVersion = v
      }
    })
    version = (maxVersion + 1).toString()
  }

  const targetName = branch ? `${baseName}${SEP}${version}${SEP}${branch}` : `${baseName}${SEP}${version}`
  const targetPath = path.join(parentPath, targetName)

  if (currentDirName === targetName) {
    console.log('当前文件夹名已经是最新且匹配分支名，无需重命名。')
    return
  }

  console.log(`正在将文件夹重命名为: ${targetName}`)
  try {
    fs.renameSync(currentPath, targetPath)
    console.log('重命名成功！')
    console.log(`提示: 请运行 'cd ../${targetName}' 以更新你的 shell 路径。`)
  } catch (err) {
    console.error('重命名失败，可能是目录被占用或权限不足。')
  }
}

const syncExtraFiles = async (currentPath: string, parentPath: string, baseName: string, currentDirName: string) => {
  const items = fs.readdirSync(parentPath)
  
  // 匹配以 baseName 开头且使用新分隔符的文件夹
  const targetDirs: string[] = []

  items.forEach(item => {
    const itemPath = path.join(parentPath, item)
    if (fs.statSync(itemPath).isDirectory() && item !== currentDirName) {
      const p = item.split(SEP)
      if (p[0] === baseName) {
        targetDirs.push(itemPath)
      }
    }
  })

  if (targetDirs.length === 0) {
    console.log('未找到需要同步的相关仓库目录。')
    return
  }

  console.log(`正在从 ${currentDirName} 同步文件到 ${targetDirs.length} 个目录: ${EXTRA_FILES.join(', ')}`)

  targetDirs.forEach(dir => {
    EXTRA_FILES.forEach(file => {
      const srcFile = path.join(currentPath, file)
      const destFile = path.join(dir, file)
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile)
        console.log(`  -> 已同步 ${file} 到 ${path.basename(dir)}`)
      }
    })
  })
}

const doCopyWithVersion = async (currentPath: string, parentPath: string, baseName: string) => {
  const branch = getCurBranch(currentPath)
  // 查找父目录下已有的同名或带数字后缀的文件夹
  const items = fs.readdirSync(parentPath)
  let maxVersion = 0
  
  items.forEach(item => {
    const itemPath = path.join(parentPath, item)
    if (fs.statSync(itemPath).isDirectory()) {
      const p = item.split(SEP)
      // 匹配 项目名__数字...
      if (p.length >= 2 && p[0] === baseName && /^\d+$/.test(p[1])) {
        const v = parseInt(p[1], 10)
        if (v > maxVersion) maxVersion = v
      } else if (item === baseName) {
        if (maxVersion === 0) maxVersion = 0
      }
    }
  })

  const nextVersion = maxVersion + 1
  const newDirName = branch ? `${baseName}${SEP}${nextVersion}${SEP}${branch}` : `${baseName}${SEP}${nextVersion}`
  const targetPath = path.join(parentPath, newDirName)

  console.log(`正在复制文件到 ${targetPath}...`)

  try {
    // 获取所有非 gitignore 的文件 (包含未追踪但未忽略的文件)
    const filesToCopy = execSync('git ls-files --cached --others --exclude-standard', { cwd: currentPath })
      .toString()
      .split('\n')
      .filter(f => f.trim() !== '')

    // 额外包含特殊文件 (即便它在 gitignore 中)
    EXTRA_FILES.forEach(file => {
      if (fs.existsSync(path.join(currentPath, file)) && !filesToCopy.includes(file)) {
        filesToCopy.push(file)
      }
    })

    if (filesToCopy.length === 0) {
      console.log('没有发现需要复制的文件。')
      return
    }

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true })
    }

    // 复制 .git 目录以保持 git repo 状态
    const gitDir = path.join(currentPath, '.git')
    let gitUser = ''
    let gitEmail = ''
    if (fs.existsSync(gitDir)) {
      console.log('正在获取 Git 用户信息...')
      try {
        gitUser = execSync('git config user.name', { cwd: currentPath }).toString().trim()
        gitEmail = execSync('git config user.email', { cwd: currentPath }).toString().trim()
      } catch (e) {
        // 可能没有设置
      }

      console.log('正在复制 .git 目录...')
      fs.cpSync(gitDir, path.join(targetPath, '.git'), { recursive: true })

      if (gitUser || gitEmail) {
        console.log(`正在同步 Git 用户配置: ${gitUser} <${gitEmail}>`)
        if (gitUser) execSync(`git config user.name "${gitUser}"`, { cwd: targetPath })
        if (gitEmail) execSync(`git config user.email "${gitEmail}"`, { cwd: targetPath })
      }
    }

    filesToCopy.forEach(file => {
      const srcFile = path.join(currentPath, file)
      const destFile = path.join(targetPath, file)
      const destDir = path.dirname(destFile)

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }

      // 只有文件才复制，目录会在创建父目录时处理
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile)
      }
    })

    console.log(`成功将 ${filesToCopy.length} 个文件复制到 ${newDirName}`)
  } catch (err) {
    console.error('复制出错。请确保当前目录是一个 git 仓库。')
    // @ts-ignore
    console.error(err?.message || err)
  }
}

export { copyWithVersion, copyWithVersionDesc }

