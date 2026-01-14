import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { getCallPath } from '@blurname/core/src/node/cli.js'

const EXTRA_FILES = ['.env.local']

const copyWithVersionDesc = '复制当前目录下非 gitignore 的文件到上一层的新同名带数字文件夹 (支持 sync 子命令)'

const copyWithVersion = async () => {
  const currentPath = getCallPath()
  const parentPath = path.dirname(currentPath)
  const currentDirName = path.basename(currentPath)
  
  // 提取基础名称（去掉后缀的 -数字）
  const baseNameMatch = currentDirName.match(/^(.*?)(?:-(\d+))?$/)
  const baseName = baseNameMatch ? baseNameMatch[1] : currentDirName

  const subCommand = process.argv[3]

  if (subCommand === 'sync') {
    await syncExtraFiles(currentPath, parentPath, baseName, currentDirName)
    return
  }

  // 默认执行原来的复制逻辑
  await doCopyWithVersion(currentPath, parentPath, baseName)
}

const syncExtraFiles = async (currentPath: string, parentPath: string, baseName: string, currentDirName: string) => {
  const items = fs.readdirSync(parentPath)
  
  // 匹配模式: 基础名 或 基础名-数字
  const pattern = new RegExp(`^${baseName}(?:-(\\d+))?$`)
  const targetDirs: string[] = []

  items.forEach(item => {
    const itemPath = path.join(parentPath, item)
    if (fs.statSync(itemPath).isDirectory() && item !== currentDirName) {
      const match = item.match(pattern)
      if (match) {
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
  // 查找父目录下已有的同名或带数字后缀的文件夹
  const items = fs.readdirSync(parentPath)
  let maxVersion = 0
  
  // 匹配模式: 基础名 或 基础名-数字
  const pattern = new RegExp(`^${baseName}(?:-(\\d+))?$`)

  items.forEach(item => {
    const itemPath = path.join(parentPath, item)
    if (fs.statSync(itemPath).isDirectory()) {
      const match = item.match(pattern)
      if (match) {
        if (match[1]) {
          const v = parseInt(match[1], 10)
          if (v > maxVersion) maxVersion = v
        } else {
          // 如果原名文件夹存在，视为版本 0
          if (maxVersion === 0) maxVersion = 0 
        }
      }
    }
  })

  const nextVersion = maxVersion + 1
  const newDirName = `${baseName}-${nextVersion}`
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

