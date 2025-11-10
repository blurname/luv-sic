import { defineConfig } from '@rslib/core';

// 具体功能: 配置 monorepo 包的打包选项，包含 node_modules 依赖
export default defineConfig({
  // 配置多入口点
  source: {
    entry: {
      index: './src/index.ts',
      'monorepo-main': './src/monorepo-main.ts'
    }
  },
  
  lib: [
    {
      // 输出格式为 CommonJS，适合 CLI 工具
      format: 'cjs',
      
      // 启用 bundle 模式
      bundle: true,
      
      // 禁用自动 externalize 依赖，确保所有依赖都被打包
      autoExternal: false,
      
      // 启用 sourcemap 便于调试
      sourcemap: true,
    }
  ],
  
  // 配置输出
  output: {
    // 清理输出目录
    cleanDistPath: true,
    
    // 打包目标为 node，确保兼容性
    target: 'node',
  },
  
  // 配置别名
  alias: {
    // 确保正确解析路径
    '@blurname/core': '../core/src',
  },
});