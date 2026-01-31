/**
 * 异构数据源示例
 *
 * GraphQL 的核心优势之一是可以聚合来自不同数据源的数据：
 * - 内存数据
 * - REST API
 * - 数据库
 * - 缓存
 * - 第三方服务
 *
 * 客户端只需要一个 GraphQL 查询，后端会自动从各个数据源获取数据并组合
 */

// ==========================================
// 模拟不同的数据源
// ==========================================

/**
 * 数据源 1: 内存数据（本地缓存）
 * 适用于：配置信息、静态数据
 */
export const memoryDataSource = {
  getConfig: () => ({
    appName: 'GraphQL Demo',
    version: '1.0.0',
    features: ['users', 'posts', 'comments'],
  }),
}

/**
 * 数据源 2: 模拟 REST API
 * 实际项目中这里会是 fetch 调用外部 API
 */
export const restApiDataSource = {
  // 模拟从外部天气 API 获取数据
  getWeather: async (city: string) => {
    // 模拟网络延迟
    await sleep(100)
    const weatherData: Record<string, { temp: number; condition: string }> = {
      北京: { temp: 15, condition: '晴' },
      上海: { temp: 18, condition: '多云' },
      深圳: { temp: 25, condition: '阴' },
    }
    return weatherData[city] || { temp: 20, condition: '未知' }
  },

  // 模拟从外部汇率 API 获取数据
  getExchangeRate: async (from: string, to: string) => {
    await sleep(50)
    const rates: Record<string, number> = {
      'USD-CNY': 7.24,
      'EUR-CNY': 7.89,
      'JPY-CNY': 0.048,
      'CNY-USD': 0.138,
    }
    return rates[`${from}-${to}`] || 1
  },
}

/**
 * 数据源 3: 模拟数据库
 * 实际项目中这里会是 Prisma、Drizzle、TypeORM 等 ORM
 */
export const databaseDataSource = {
  // 模拟从数据库查询订单
  getOrders: async (userId: string) => {
    await sleep(80)
    const orders = [
      { id: '1', userId: '1', product: 'MacBook Pro', amount: 14999, status: 'delivered' },
      { id: '2', userId: '1', product: 'iPhone 15', amount: 7999, status: 'shipped' },
      { id: '3', userId: '2', product: 'AirPods Pro', amount: 1899, status: 'pending' },
    ]
    return orders.filter((o) => o.userId === userId)
  },

  // 模拟数据库聚合查询
  getUserStats: async (userId: string) => {
    await sleep(60)
    const stats: Record<string, { totalOrders: number; totalSpent: number }> = {
      '1': { totalOrders: 5, totalSpent: 35000 },
      '2': { totalOrders: 2, totalSpent: 5000 },
      '3': { totalOrders: 0, totalSpent: 0 },
    }
    return stats[userId] || { totalOrders: 0, totalSpent: 0 }
  },
}

/**
 * 数据源 4: 模拟 Redis 缓存
 * 用于存储频繁访问的数据
 */
const cacheStore = new Map<string, { data: unknown; expireAt: number }>()

export const cacheDataSource = {
  get: <T>(key: string): T | null => {
    const cached = cacheStore.get(key)
    if (!cached) return null
    if (Date.now() > cached.expireAt) {
      cacheStore.delete(key)
      return null
    }
    return cached.data as T
  },

  set: <T>(key: string, data: T, ttlMs: number = 60000) => {
    cacheStore.set(key, { data, expireAt: Date.now() + ttlMs })
  },
}

/**
 * 数据源 5: 模拟第三方服务（如支付、通知）
 */
export const thirdPartyDataSource = {
  // 模拟检查支付状态
  getPaymentStatus: async (orderId: string) => {
    await sleep(120)
    const statuses = ['pending', 'processing', 'completed', 'failed']
    return {
      orderId,
      status: statuses[Math.floor(Math.random() * 4)],
      lastUpdated: new Date().toISOString(),
    }
  },

  // 模拟发送通知
  sendNotification: async (userId: string, message: string) => {
    await sleep(50)
    console.log(`[Notification] To user ${userId}: ${message}`)
    return { success: true, messageId: `msg_${Date.now()}` }
  },
}

// 工具函数
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
