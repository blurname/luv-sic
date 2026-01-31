# GraphQL 学习示例

这是一个用于学习 GraphQL 的完整示例项目。

## 快速开始

```bash
# 安装依赖
bun install

# 启动开发服务器（支持热重载）
bun run dev

# 或者直接运行
bun run start
```

启动后访问 http://localhost:4000/graphql 打开 GraphiQL 交互式界面。

## 项目结构

```
src/
├── server.ts     # 服务器入口
├── schema.ts     # GraphQL Schema 定义（类型系统）
├── resolvers.ts  # Resolvers 解析器（业务逻辑）
└── data.ts       # 模拟数据
```

## GraphQL 核心概念

### 1. Schema（模式）

Schema 定义了 API 的类型系统，包括：

- **Object Types**: 定义数据结构（如 `User`, `Post`）
- **Query**: 读取数据的入口
- **Mutation**: 修改数据的入口
- **Input Types**: Mutation 的输入参数类型

```graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]!  # 关联查询
}
```

### 2. Resolvers（解析器）

Resolver 是实际执行查询的函数：

```typescript
const resolvers = {
  Query: {
    user: (_, { id }) => users.find(u => u.id === id)
  },
  User: {
    posts: (parent) => posts.filter(p => p.authorId === parent.id)
  }
}
```

### 3. 标量类型

- `ID`: 唯一标识符
- `String`: 字符串
- `Int`: 整数
- `Float`: 浮点数
- `Boolean`: 布尔值

### 4. 类型修饰符

- `String!`: 非空字符串
- `[String]`: 字符串数组（可为 null）
- `[String!]!`: 非空的非空字符串数组

## 查询示例

### 基础查询

```graphql
# 获取所有用户
query {
  users {
    id
    name
    email
  }
}

# 获取单个用户
query {
  user(id: "1") {
    name
    age
  }
}
```

### 关联查询

```graphql
# 获取用户及其文章
query {
  user(id: "1") {
    name
    posts {
      title
      published
    }
  }
}

# 获取文章及其作者
query {
  posts(onlyPublished: true) {
    title
    author {
      name
    }
  }
}
```

### Mutation（修改数据）

```graphql
# 创建用户
mutation {
  createUser(input: {
    name: "新用户"
    email: "new@example.com"
    age: 25
  }) {
    id
    name
  }
}

# 创建文章
mutation {
  createPost(input: {
    title: "我的文章"
    content: "文章内容..."
    authorId: "1"
    published: true
  }) {
    id
    title
    author {
      name
    }
  }
}
```

### 使用变量

```graphql
# 定义查询
query GetUser($userId: ID!) {
  user(id: $userId) {
    name
    email
  }
}

# 变量值（在 GraphiQL 的 Variables 面板中）
{
  "userId": "1"
}
```

## 学习路径

1. **理解 Schema** - 查看 `src/schema.ts`，了解类型定义
2. **理解 Resolvers** - 查看 `src/resolvers.ts`，了解解析逻辑
3. **实践查询** - 在 GraphiQL 中尝试各种查询
4. **添加新功能** - 尝试添加新的类型、查询和 Mutation

## 扩展练习

1. 添加 `Comment` 类型，实现评论功能
2. 添加分页查询（limit, offset）
3. 添加用户认证（通过 context）
4. 添加 Subscription（实时订阅）

## 参考资料

- [GraphQL 官方文档](https://graphql.org/learn/)
- [graphql-yoga 文档](https://the-guild.dev/graphql/yoga-server)
- [GraphQL 中文网](https://graphql.cn/)
