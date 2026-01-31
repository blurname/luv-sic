/**
 * GraphQL Context（上下文）
 *
 * Context 是每个 GraphQL 请求共享的对象，用于：
 * 1. 传递认证信息（当前用户、权限等）
 * 2. 注入数据源（数据库、API 客户端）
 * 3. 请求级别的工具（日志、缓存、DataLoader）
 *
 * 每个 resolver 都可以访问 context：
 * resolver(parent, args, context, info) => result
 */

import {
  memoryDataSource,
  restApiDataSource,
  databaseDataSource,
  thirdPartyDataSource,
} from './datasources'

// ==========================================
// 类型定义
// ==========================================

export interface User {
  id: string
  name: string
  role: 'admin' | 'user' | 'guest'
}

export interface GraphQLContext {
  // 当前认证用户（从请求头解析）
  currentUser: User | null

  // 数据源（依赖注入，便于测试和替换）
  dataSources: {
    memory: typeof memoryDataSource
    restApi: typeof restApiDataSource
    database: typeof databaseDataSource
    thirdParty: typeof thirdPartyDataSource
  }

  // 请求级别工具
  requestId: string
  logger: {
    info: (msg: string) => void
    error: (msg: string) => void
  }
}

// ==========================================
// 模拟用户数据库（用于认证）
// ==========================================

const userTokens: Record<string, User> = {
  'token-admin-123': { id: '1', name: '张三', role: 'admin' },
  'token-user-456': { id: '2', name: '李四', role: 'user' },
}

// ==========================================
// Context 工厂函数
// ==========================================

/**
 * 为每个请求创建 context
 * 这个函数会在 graphql-yoga 的 context 选项中调用
 */
export function createContext(request: Request): GraphQLContext {
  // 生成请求 ID
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  // 从请求头获取认证 token
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  // 解析当前用户
  const currentUser = token ? userTokens[token] || null : null

  // 创建请求级别的 logger
  const logger = {
    info: (msg: string) => console.log(`[${requestId}] INFO: ${msg}`),
    error: (msg: string) => console.error(`[${requestId}] ERROR: ${msg}`),
  }

  if (currentUser) {
    logger.info(`User authenticated: ${currentUser.name} (${currentUser.role})`)
  }

  return {
    currentUser,
    requestId,
    logger,
    dataSources: {
      memory: memoryDataSource,
      restApi: restApiDataSource,
      database: databaseDataSource,
      thirdParty: thirdPartyDataSource,
    },
  }
}

// ==========================================
// 权限检查辅助函数
// ==========================================

export function requireAuth(ctx: GraphQLContext): User {
  if (!ctx.currentUser) {
    throw new Error('Unauthorized: 请先登录')
  }
  return ctx.currentUser
}

export function requireAdmin(ctx: GraphQLContext): User {
  const user = requireAuth(ctx)
  if (user.role !== 'admin') {
    throw new Error('Forbidden: 需要管理员权限')
  }
  return user
}
