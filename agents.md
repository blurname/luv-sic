# Luv-sic 仓库指南

## 🚀 Agents 概览

本仓库包含了一系列自动化的工具代理（Agents），旨在提升开发效率、自动化运维任务以及管理复杂的 Monorepo 结构。

### CLI Agents (`pkg/cli`)

| 代理名称 | 功能描述 | 核心脚本 |
| :--- | :--- | :--- |
| **SwitchNpmrc** | 快速切换 `.npmrc` 和 `.npmrb`（备份文件）。 | `01-switch-npmrc.ts` |
| **DuFolder** | 列出当前目录下各子文件夹的大小。 | `03-du-current-folder.ts` |
| **WorkingTime** | 计算周六的加班工时。 | `05-calc-working-time.ts` |
| **GitCIStatus** | 使用 `glab` 监控 Gitlab CI 的运行状态。 | `0a-git-detect-ci-status.ts` |
| **GitDropVersion** | 快速撤销/删除特定的版本提交或 Tag。 | `07-git-drop-version.ts` |
| **GitPackageCommit** | 针对 package 的提交代理，规范化提交信息。 | `08-git-package-commit.ts` |
| **GitReplacePackage** | 在 Git 历史中替换特定的 package 内容或依赖。 | `09-git-package-replace.ts` |
| **GitForgetLog** | 清理或忽略特定的 Git 提交日志记录。 | `10-git-forget-log.ts` |
| **GitViewDiff** | 增强型的 Git Diff 查看工具。 | `12-git-view-diff.ts` |
| **ShellCompletions** | 为 CLI 工具生成 Shell 补全脚本。 | `06-generate-shell-completions.ts` |
| **ZellijTabRename** | 自动根据环境重命名 Zellij 的 Tab。 | `13-zellij-tab-rename.ts` |
| **CopyWithVersion** | 复制或重命名带版本的文件夹。 | `15-copy-with-version.ts` |
| **MetaScriptFzf** | 集成 FZF 的元脚本搜索与执行工具。 | `11-meta-script-fzf.ts` |
| **NpmInstaller** | 简化的 npm 安装命令 (`ni`)。 | `14-npm-i.ts` |
| **TsPercent** | 计算项目中 TypeScript 文件占比。 | `04-calc-ts-percent-in-project.ts` |
| **UnderScore2Camel** | 将 JSON 中的下划线命名转换为小驼峰。 | `0d-underScore2camelCase.ts` |
| **LogRemoteJson** | 静默下载远程 JSON 文件并记录日志。 | `0e-log-remote-json.ts` |
| **StartEnv** | (Elvish) 初始化开发环境变量。 | `0b-start-env.elv` |
| **ZellijStarter** | 尝试连接或启动名为 `b` 的 Zellij 会话。 | `0c-start-zellij.ts` |
| **AutoPartHarddisk** | 硬盘自动分区工具。 | `00-auto-part-harddisk.ts` |

### Monorepo Agents (`pkg/monorepo`)

- **Version Bumper**: 自动根据修改情况提升子项目的版本号。
- **Sub-Version Detector**: 检测哪些子项目需要更新版本。
- **Tag Pusher**: 自动化 Git Tag 的创建与推送流程。
- **File Replacer**: 批量执行特定文件或字段的替换。

---

## 🛠 开发规范 (Rules)

为确保 AI 和开发者遵循本项目的一致风格，请遵循以下规则：

### 1. 命名与函数设计
- **副作用标识 (Effect Suffix)**：所有具有副作用（如修改文件、网络请求、执行系统命令）的函数，**必须**以 `Eff` 结尾。例如：`updateVersionEff`, `fileReplaceKVEff`。
- **命名法**：
  - 变量与函数：使用 `camelCase`（小驼峰）。
  - CLI 命令文件：在 `pkg/cli/src/commands/` 下，使用 `数字编号-功能描述.ts` 格式。

### 2. CLI 命令开发
- **导出模式**：每个命令文件导出描述字符串 `[commandName]Desc` 和异步主函数 `[commandName]`。
- **参数解析**：优先使用 `@blurname/core` 中的 `parseArg` 或 `createCliStoreEff`。

### 3. 模块导入规范 (ESM)
- **文件后缀**：进行相对路径导入时，**必须**显式包含 `.js` 后缀（即使实际文件是 `.ts`）。
- **内置模块**：使用 `node:` 协议前缀。例如：`import { execSync } from 'node:child_process'`。

### 4. 工具类偏好
- **日志记录**：严禁直接使用 `console.log`，必须使用 `@blurname/core` 提供的 `LG` 或 `colorLog`。
- **文件操作**：结构化文件（如 `package.json`）应使用 `PJFK` (Package JSON File Kit)。
- **系统命令**：优先使用 `node:child_process` 中的 `execSync`。

### 5. 核心架构
- **Monorepo**：子包位于 `pkg/` 目录下。
- **运行时**：首选 `bun`。
- **构建系统**：使用 `turbo`。
