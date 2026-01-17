# Luv-sic 开发指南

## 🛠 开发规范 (Rules)

为确保 AI 和开发者遵循本项目的一致风格，请遵循以下规则：

### 1. 命名与函数设计
- **副作用标识 (Effect Suffix)**：所有具有副作用（如修改文件、网络请求、执行系统命令） of 函数，**必须**以 `Eff` 结尾。例如：`updateVersionEff`, `fileReplaceKVEff`。
- **命名法**：
  - 变量与函数：使用 `camelCase`（小驼峰）。
  - CLI 命令文件：在 `pkg/cli/src/commands/` 下，使用 `数字编号-功能描述.ts` 格式。

### 2. CLI 命令开发
- **导出模式**：每个命令文件导出描述字符串 `[commandName]Desc` 和异步主函数 `[commandName]`。
- **参数解析**：优先使用 `@blurname/core` 中的 `parseArg` 或 `createCliStoreEff`。

### 3. 模块导入规范 (ESM)
- **文件后缀**：进行相对路径导入时，**严禁**包含 `.js` 或 `.ts` 后缀。
- **内置模块**：使用 `node:` 协议前缀。例如：`import { execSync } from 'node:child_process'`。

### 4. 工具类偏好
- **日志记录**：严禁直接使用 `console.log`，必须使用 `@blurname/core` 提供的 `LG` 或 `colorLog`。
- **文件操作**：结构化文件（如 `package.json`）应使用 `PJFK` (Package JSON File Kit)。
- **系统命令**：优先使用 `node:child_process` 中的 `execSync`。

### 5. 核心架构
- **Monorepo 结构**：
  - `pkg/cli`: 命令行工具代理。
  - `pkg/monorepo`: Monorepo 管理相关的代理。
  - `pkg/core`: 内部核心共享库 (`@blurname/core`)。
- **运行时**：首选 `bun`。
- **构建系统**：使用 `turbo`。
