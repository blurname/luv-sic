/**
 * GraphQL Schema 定义
 *
 * Schema 是 GraphQL 的核心，定义了：
 * 1. 可查询的数据类型 (Type)
 * 2. 查询入口 (Query)
 * 3. 修改入口 (Mutation)
 * 4. 订阅入口 (Subscription)
 */

export const typeDefs = /* GraphQL */ `
  # ==========================================
  # 基础类型定义 (Object Types)
  # ==========================================

  """
  用户类型
  每个字段后面的 ! 表示非空（必须有值）
  """
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    # 关联查询：获取该用户的所有文章
    posts: [Post!]!
    # ↓↓↓ 异构数据源示例：这些字段来自不同的数据源 ↓↓↓
    # 来自数据库的订单数据
    orders: [Order!]!
    # 来自数据库的统计数据
    stats: UserStats!
  }

  # ==========================================
  # 异构数据源类型 (Heterogeneous Data Sources)
  # 演示如何从多个数据源聚合数据
  # ==========================================

  """
  订单类型 - 数据来源：数据库
  """
  type Order {
    id: ID!
    product: String!
    amount: Float!
    status: String!
  }

  """
  用户统计 - 数据来源：数据库聚合查询
  """
  type UserStats {
    totalOrders: Int!
    totalSpent: Float!
  }

  """
  天气信息 - 数据来源：外部 REST API
  """
  type Weather {
    city: String!
    temp: Float!
    condition: String!
  }

  """
  汇率信息 - 数据来源：外部 REST API
  """
  type ExchangeRate {
    from: String!
    to: String!
    rate: Float!
  }

  """
  应用配置 - 数据来源：内存/配置文件
  """
  type AppConfig {
    appName: String!
    version: String!
    features: [String!]!
  }

  """
  支付状态 - 数据来源：第三方支付服务
  """
  type PaymentStatus {
    orderId: ID!
    status: String!
    lastUpdated: String!
  }

  """
  通知结果 - 数据来源：第三方通知服务
  """
  type NotificationResult {
    success: Boolean!
    messageId: String!
  }

  """
  聚合仪表板 - 演示一次查询从多个数据源获取数据
  """
  type Dashboard {
    config: AppConfig!
    weather: Weather!
    exchangeRate: ExchangeRate!
  }

  """
  文章类型
  """
  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    # 关联查询：获取文章的作者
    author: User!
  }

  # ==========================================
  # 输入类型 (Input Types)
  # 用于 Mutation 的参数
  # ==========================================

  """
  创建用户的输入参数
  """
  input CreateUserInput {
    name: String!
    email: String!
    age: Int!
  }

  """
  更新用户的输入参数
  所有字段都是可选的
  """
  input UpdateUserInput {
    name: String
    email: String
    age: Int
  }

  """
  创建文章的输入参数
  """
  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
    published: Boolean = false
  }

  # ==========================================
  # 查询类型 (Query)
  # 所有的读取操作都在这里定义
  # ==========================================

  type Query {
    """
    获取所有用户
    """
    users: [User!]!

    """
    根据 ID 获取单个用户
    返回值可能为 null（用户不存在）
    """
    user(id: ID!): User

    """
    获取所有文章
    可选参数：onlyPublished - 是否只返回已发布的文章
    """
    posts(onlyPublished: Boolean): [Post!]!

    """
    根据 ID 获取单个文章
    """
    post(id: ID!): Post

    """
    搜索文章（按标题模糊匹配）
    """
    searchPosts(keyword: String!): [Post!]!

    # ==========================================
    # 异构数据源查询
    # ==========================================

    """
    获取天气信息 - 数据源：REST API
    """
    weather(city: String!): Weather!

    """
    获取汇率 - 数据源：REST API
    """
    exchangeRate(from: String!, to: String!): ExchangeRate!

    """
    获取应用配置 - 数据源：内存
    """
    appConfig: AppConfig!

    """
    获取支付状态 - 数据源：第三方服务
    """
    paymentStatus(orderId: ID!): PaymentStatus!

    """
    获取聚合仪表板 - 一次查询多个数据源
    演示 GraphQL 如何并行从多个数据源获取数据
    """
    dashboard(city: String!, fromCurrency: String!, toCurrency: String!): Dashboard!

    # ==========================================
    # Context 示例：需要认证的查询
    # ==========================================

    """
    获取当前登录用户信息（需要认证）
    需要在请求头中添加: Authorization: Bearer token-admin-123
    """
    me: AuthUser

    """
    获取管理员统计（需要管理员权限）
    """
    adminStats: AdminStats!
  }

  """
  认证用户信息
  """
  type AuthUser {
    id: ID!
    name: String!
    role: String!
  }

  """
  管理员统计（仅管理员可见）
  """
  type AdminStats {
    totalUsers: Int!
    totalPosts: Int!
    requestId: String!
  }

  # ==========================================
  # 修改类型 (Mutation)
  # 所有的写入操作都在这里定义
  # ==========================================

  type Mutation {
    """
    创建新用户
    """
    createUser(input: CreateUserInput!): User!

    """
    更新用户信息
    """
    updateUser(id: ID!, input: UpdateUserInput!): User

    """
    删除用户
    返回被删除的用户，如果用户不存在则返回 null
    """
    deleteUser(id: ID!): User

    """
    创建新文章
    """
    createPost(input: CreatePostInput!): Post!

    """
    发布/取消发布文章
    """
    togglePostPublished(id: ID!): Post

    """
    发送通知 - 数据源：第三方通知服务
    """
    sendNotification(userId: ID!, message: String!): NotificationResult!
  }
`
