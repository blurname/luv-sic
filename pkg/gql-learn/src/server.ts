/**
 * GraphQL 服务器入口
 *
 * 使用 graphql-yoga 创建 GraphQL 服务器
 * graphql-yoga 是一个现代化、轻量级的 GraphQL 服务器实现
 */

import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { createSchema } from 'graphql-yoga'
import { LG } from '@blurname/core/src/colorLog'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { createContext } from './context'

// 创建 GraphQL schema
const schema = createSchema({
  typeDefs,
  resolvers,
})

// 创建 Yoga 实例
const yoga = createYoga({
  schema,
  // 为每个请求创建 context
  context: ({ request }) => createContext(request),
  // GraphQL IDE 配置（GraphiQL）
  graphiql: {
    title: 'GraphQL 学习示例',
    defaultQuery: `# 欢迎使用 GraphQL 学习示例！
# 
# 这是 GraphiQL，一个用于探索 GraphQL API 的交互式工具
# 左侧编写查询，点击播放按钮执行，右侧显示结果
#
# 提示：按 Ctrl+Space 可以获得自动补全

# ========== 基础查询示例 ==========

# 1. 查询所有用户
query GetAllUsers {
  users {
    id
    name
    email
  }
}

# 2. 查询单个用户（带关联的文章）
# query GetUserWithPosts {
#   user(id: "1") {
#     name
#     email
#     posts {
#       title
#       published
#     }
#   }
# }

# 3. 查询已发布的文章
# query GetPublishedPosts {
#   posts(onlyPublished: true) {
#     title
#     content
#     author {
#       name
#     }
#   }
# }

# ========== Mutation 示例 ==========

# 4. 创建新用户
# mutation CreateNewUser {
#   createUser(input: {
#     name: "新用户"
#     email: "new@example.com"
#     age: 22
#   }) {
#     id
#     name
#   }
# }

# 5. 创建新文章
# mutation CreateNewPost {
#   createPost(input: {
#     title: "我的第一篇文章"
#     content: "这是文章内容..."
#     authorId: "1"
#     published: true
#   }) {
#     id
#     title
#     author {
#       name
#     }
#   }
# }
`,
  },
  // 日志
  logging: {
    debug: (...args) => console.log('[GraphQL]', ...args),
    info: (...args) => console.log('[GraphQL]', ...args),
    warn: (...args) => LG.warn(String(args)),
    error: (...args) => LG.error(String(args)),
  },
})

// 创建 HTTP 服务器
const server = createServer(yoga)

const PORT = 4000

server.listen(PORT, () => {
  LG.success(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 GraphQL 学习服务器已启动！                            ║
║                                                            ║
║   📍 GraphQL Endpoint:  http://localhost:${PORT}/graphql      ║
║   🎮 GraphiQL IDE:      http://localhost:${PORT}/graphql      ║
║                                                            ║
║   在浏览器中打开上面的地址，开始探索 GraphQL！             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `)
})
