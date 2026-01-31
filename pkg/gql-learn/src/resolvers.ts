/**
 * GraphQL Resolvers（解析器）
 *
 * Resolver 是实际执行查询逻辑的函数
 * 每个字段都可以有对应的 resolver
 *
 * Resolver 函数签名：(parent, args, context, info) => result
 * - parent: 父级 resolver 的返回值
 * - args: 查询参数
 * - context: 上下文（通常包含数据库连接、认证信息等）
 * - info: 查询的元信息
 */

import { LG } from '@blurname/core/src/colorLog'
import {
  users,
  posts,
  generateUserId,
  generatePostId,
  type User,
  type Post,
} from './data'
import {
  memoryDataSource,
  restApiDataSource,
  databaseDataSource,
  thirdPartyDataSource,
} from './datasources'
import { type GraphQLContext, requireAuth, requireAdmin } from './context'

export const resolvers = {
  // ==========================================
  // Query Resolvers
  // ==========================================
  Query: {
    // 获取所有用户
    users: () => users,

    // 获取单个用户
    user: (_: unknown, args: { id: string }) => {
      return users.find((u) => u.id === args.id) || null
    },

    // 获取所有文章
    posts: (_: unknown, args: { onlyPublished?: boolean }) => {
      if (args.onlyPublished) {
        return posts.filter((p) => p.published)
      }
      return posts
    },

    // 获取单个文章
    post: (_: unknown, args: { id: string }) => {
      return posts.find((p) => p.id === args.id) || null
    },

    // 搜索文章
    searchPosts: (_: unknown, args: { keyword: string }) => {
      const keyword = args.keyword.toLowerCase()
      return posts.filter((p) => p.title.toLowerCase().includes(keyword))
    },

    // ==========================================
    // 异构数据源查询
    // ==========================================

    // 数据源：REST API
    weather: async (_: unknown, args: { city: string }) => {
      console.log(`[REST API] 获取天气: ${args.city}`)
      const data = await restApiDataSource.getWeather(args.city)
      return { city: args.city, ...data }
    },

    // 数据源：REST API
    exchangeRate: async (_: unknown, args: { from: string; to: string }) => {
      console.log(`[REST API] 获取汇率: ${args.from} -> ${args.to}`)
      const rate = await restApiDataSource.getExchangeRate(args.from, args.to)
      return { from: args.from, to: args.to, rate }
    },

    // 数据源：内存
    appConfig: () => {
      console.log('[Memory] 获取应用配置')
      return memoryDataSource.getConfig()
    },

    // 数据源：第三方服务
    paymentStatus: async (_: unknown, args: { orderId: string }) => {
      console.log(`[Third Party] 获取支付状态: ${args.orderId}`)
      return thirdPartyDataSource.getPaymentStatus(args.orderId)
    },

    // 聚合查询：一次请求从多个数据源获取数据
    // GraphQL 会并行执行这些解析器
    dashboard: async (
      _: unknown,
      args: { city: string; fromCurrency: string; toCurrency: string }
    ) => {
      console.log('[Dashboard] 聚合查询 - 从多个数据源并行获取数据')

      // 这些请求会并行执行
      const [config, weatherData, rate] = await Promise.all([
        Promise.resolve(memoryDataSource.getConfig()),
        restApiDataSource.getWeather(args.city),
        restApiDataSource.getExchangeRate(args.fromCurrency, args.toCurrency),
      ])

      return {
        config,
        weather: { city: args.city, ...weatherData },
        exchangeRate: {
          from: args.fromCurrency,
          to: args.toCurrency,
          rate,
        },
      }
    },

    // ==========================================
    // Context 示例：使用认证信息
    // ==========================================

    /**
     * 获取当前用户信息
     * 演示如何从 context 获取认证用户
     *
     * 测试方式：
     * curl -X POST http://localhost:4000/graphql \
     *   -H "Content-Type: application/json" \
     *   -H "Authorization: Bearer token-admin-123" \
     *   -d '{"query": "{ me { id name role } }"}'
     */
    me: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      // 使用 context 中的 logger
      ctx.logger.info('Query: me')

      // 返回当前用户（可能为 null）
      return ctx.currentUser
    },

    /**
     * 管理员统计
     * 演示如何进行权限检查
     */
    adminStats: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      // 权限检查：必须是管理员
      requireAdmin(ctx)

      ctx.logger.info('Query: adminStats (admin only)')

      return {
        totalUsers: users.length,
        totalPosts: posts.length,
        // 展示 context 中的 requestId
        requestId: ctx.requestId,
      }
    },
  },

  // ==========================================
  // Mutation Resolvers
  // ==========================================
  Mutation: {
    // 创建用户
    createUser: (
      _: unknown,
      args: { input: { name: string; email: string; age: number } }
    ) => {
      const newUser: User = {
        id: generateUserId(),
        ...args.input,
      }
      users.push(newUser)
      LG.success(`User_created: ${newUser.id}`)
      return newUser
    },

    // 更新用户
    updateUser: (
      _: unknown,
      args: { id: string; input: Partial<Omit<User, 'id'>> }
    ) => {
      const index = users.findIndex((u) => u.id === args.id)
      if (index === -1) {
        return null
      }
      users[index] = { ...users[index], ...args.input }
      LG.success(`User_updated: ${users[index].id}`)
      return users[index]
    },

    // 删除用户
    deleteUser: (_: unknown, args: { id: string }) => {
      const index = users.findIndex((u) => u.id === args.id)
      if (index === -1) {
        return null
      }
      const deleted = users.splice(index, 1)[0]
      LG.success(`User_deleted: ${deleted.id}`)
      return deleted
    },

    // 创建文章
    createPost: (
      _: unknown,
      args: {
        input: {
          title: string
          content: string
          authorId: string
          published?: boolean
        }
      }
    ) => {
      const author = users.find((u) => u.id === args.input.authorId)
      if (!author) {
        throw new Error(`作者不存在: ${args.input.authorId}`)
      }

      const newPost: Post = {
        id: generatePostId(),
        title: args.input.title,
        content: args.input.content,
        authorId: args.input.authorId,
        published: args.input.published ?? false,
        createdAt: new Date().toISOString().split('T')[0],
      }
      posts.push(newPost)
      LG.success(`Post_created: ${newPost.id}`)
      return newPost
    },

    // 切换文章发布状态
    togglePostPublished: (_: unknown, args: { id: string }) => {
      const post = posts.find((p) => p.id === args.id)
      if (!post) {
        return null
      }
      post.published = !post.published
      LG.success(`Toggle_post_published: ${post.id}`)
      return post
    },

    // 数据源：第三方通知服务
    sendNotification: async (_: unknown, args: { userId: string; message: string }) => {
      console.log(`[Third Party] 发送通知给用户: ${args.userId}`)
      return thirdPartyDataSource.sendNotification(args.userId, args.message)
    },
  },

  // ==========================================
  // 类型级别的 Resolvers（处理关联查询）
  // ==========================================

  // User 类型的字段解析器
  User: {
    // 当查询 User.posts 时，返回该用户的所有文章（内存数据）
    posts: (parent: User) => {
      return posts.filter((p) => p.authorId === parent.id)
    },

    // 当查询 User.orders 时，从数据库获取订单（异构数据源）
    orders: async (parent: User) => {
      console.log(`[Database] 获取用户 ${parent.id} 的订单`)
      return databaseDataSource.getOrders(parent.id)
    },

    // 当查询 User.stats 时，从数据库获取统计（异构数据源）
    stats: async (parent: User) => {
      console.log(`[Database] 获取用户 ${parent.id} 的统计`)
      return databaseDataSource.getUserStats(parent.id)
    },
  },

  // Post 类型的字段解析器
  Post: {
    // 当查询 Post.author 时，返回文章的作者
    author: (parent: Post) => {
      return users.find((u) => u.id === parent.authorId)
    },
  },
}
