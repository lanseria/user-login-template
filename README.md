# 用户登录模板

一个基于 Nuxt 4 的用户登录与权限管理模板，包含完整的用户认证、权限控制和用户管理功能。

## 技术栈

- **框架**: Nuxt 4.2.2 + Vue 3.5.27 + Nitro
- **样式**: UnoCSS (presetWind4) + Carbon Icons
- **状态**: Pinia (Setup Store 模式)
- **数据库**: PostgreSQL + Drizzle ORM
- **缓存**: Redis
- **认证**: SHA-512 密码哈希 + PASETO v4 Token
- **工具**: VueUse, dayjs, zod

## 功能特性

- [x] 用户登录/登出
- [x] PASETO Token 认证 (Access Token + Refresh Token)
- [x] 记住密码功能
- [x] 修改密码
- [x] 管理员用户管理 (CRUD)
- [x] 角色权限控制 (admin/user)
- [x] 深色/浅色主题切换
- [x] 自动初始化管理员账户

## 默认账户

- 用户名: `admin`
- 密码: `123456`

> **注意**: 首次登录后请立即修改密码！

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发服务器 (端口: 30000)
pnpm dev

# 数据库迁移
pnpm db:generate    # 生成迁移文件
pnpm db:migrate     # 执行迁移

# 代码质量
pnpm lint          # ESLint 检查
pnpm typecheck     # TypeScript 类型检查

# 构建
pnpm build         # 生产构建
pnpm start         # 运行生产环境
```

## 环境配置

复制 `.env.example` 为 `.env` 并配置：

```env
# PostgreSQL 数据库连接
NUXT_DB_URL=postgresql://postgres:password@localhost:5432/user_auth_app

# Redis 配置
NUXT_REDIS_HOST=localhost
NUXT_REDIS_PASSWORD=
```

## 项目结构

```
app/                          # 前端 (Vue 3)
├── components/               # 组件
├── composables/              # 组合式函数
│   └── useAuthStore.ts      # 认证状态管理
├── middleware/               # 路由中间件
│   ├── auth.global.ts        # 客户端认证中间件
│   └── admin.ts              # 管理员权限中间件
├── pages/                    # 页面
│   ├── index.vue             # 首页
│   ├── login.vue             # 登录页
│   ├── account.vue           # 账户设置
│   └── admin/users.vue       # 用户管理
├── layouts/                  # 布局
├── utils/                    # 工具函数
└── constants/                # 常量

server/                       # 后端 (Nitro)
├── database/
│   └── schemas.ts            # Drizzle Schema 定义
├── middleware/
│   └── auth.ts               # 服务端认证中间件
├── plugins/                  # Nitro 插件
├── tasks/                    # 后台任务
├── routes/api/               # API 路由
│   ├── auth/                 # 认证 API
│   ├── admin/                # 管理员 API
│   └── dev/                  # 开发工具 API
└── utils/                    # 服务端工具
```

## 认证机制

1. **密码存储**: SHA-512 哈希
2. **Token 策略**:
   - Access Token: PASETO v4.local (对称加密, 15天有效期)
   - Refresh Token: PASETO v4.public (非对称签名, 1个月有效期)
3. **Token 传输**: HttpOnly Cookie

## 数据库 Schema

Schema 名称: `user_auth_app`

| 表名   | 字段                                     | 说明         |
| ------ | ---------------------------------------- | ------------ |
| users  | id, username, password, role, createdAt | 用户表       |

## License

MIT
