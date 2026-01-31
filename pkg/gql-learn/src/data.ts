/**
 * 模拟数据库
 * 在实际项目中，这些数据会来自真实的数据库
 */

export interface User {
  id: string
  name: string
  email: string
  age: number
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  published: boolean
  createdAt: string
}

// 模拟用户数据
export const users: User[] = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: '2', name: '李四', email: 'lisi@example.com', age: 30 },
  { id: '3', name: '王五', email: 'wangwu@example.com', age: 28 },
]

// 模拟文章数据
export const posts: Post[] = [
  {
    id: '1',
    title: 'GraphQL 入门指南',
    content: 'GraphQL 是一种用于 API 的查询语言...',
    authorId: '1',
    published: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'TypeScript 最佳实践',
    content: 'TypeScript 是 JavaScript 的超集...',
    authorId: '1',
    published: true,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Bun 运行时介绍',
    content: 'Bun 是一个快速的 JavaScript 运行时...',
    authorId: '2',
    published: false,
    createdAt: '2024-02-01',
  },
]

// 用于生成新 ID
let userIdCounter = users.length
let postIdCounter = posts.length

export const generateUserId = () => String(++userIdCounter)
export const generatePostId = () => String(++postIdCounter)
