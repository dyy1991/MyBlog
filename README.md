# Philosophy Blog - 个人博客系统

一个功能完整的个人博客网站，参考 Philosophy 设计风格，支持在线编辑、文件上传、评论和 AI 问答功能。

## 功能特性

- ✅ **在线编辑文章** - 支持 Markdown 格式，实时预览
- ✅ **文件上传** - 支持 Markdown、视频、图片等多种文件格式
- ✅ **评论系统** - 完整的评论功能，支持回复
- ✅ **AI 问答助手** - 集成 OpenAI API，支持文章相关问答
- ✅ **分类管理** - 后台可增删分类并在编辑器中选择
- ✅ **About 页面** - Markdown 介绍页，记录博客理念
- ✅ **主题切换** - 首页 Styles 下拉支持暗黑、亮色、霓虹主题
- ✅ **联系页面** - Contact 页面集中展示邮箱等联系方式
- ✅ **响应式设计** - 适配各种设备
- ✅ **深色主题** - 参考 Philosophy 博客的深色设计风格

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: Supabase Postgres（云端托管，实时 API）
- **Markdown 渲染**: react-markdown
- **代码高亮**: react-syntax-highlighter
- **AI 集成**: OpenAI API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local`（或在 Vercel 项目中配置环境变量）：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=optional_public_anon_key
OPENAI_API_KEY=your_openai_api_key_here # 可选
```

> 若暂不使用 OpenAI，可留空；Supabase 变量则为必填。

### 3. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 访问管理后台

访问 [http://localhost:3000/admin](http://localhost:3000/admin) 来管理文章和文件。
首次进入需要输入访问密码：`Dyy5741948`，登录后会存储在当前会话中。

## 项目结构

```
blog/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── admin/             # 管理后台
│   ├── post/              # 文章详情页
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── Header.tsx         # 头部导航
│   ├── PostCard.tsx       # 文章卡片
│   ├── PostEditor.tsx     # 文章编辑器
│   ├── CommentsSection.tsx # 评论组件
│   ├── AIAssistant.tsx    # AI 助手组件
│   └── FileUploader.tsx   # 文件上传组件
├── lib/                   # 工具库
│   └── db.ts              # 数据库操作
└── public/                # 静态文件
    └── uploads/           # 上传的文件
```

## 使用说明

### 创建文章

1. 访问 `/admin` 页面
2. 点击"新建文章"按钮
3. 填写文章信息（标题、内容、分类等）
4. 支持 Markdown 格式编写
5. 可以上传特色图片
6. 点击"保存"按钮

### 管理分类

1. 在 `/admin` 页面下方找到 **分类管理**
2. 输入分类名称（slug 可选，不填会自动生成）
3. 点击"新增分类"
4. 列表中可以删除不需要的分类

### 上传文件

1. 在管理后台的"文件管理"区域
2. 点击"选择文件上传"
3. 支持的文件类型：
   - Markdown: `.md`, `.markdown`
   - 视频: `.mp4`, `.mov`, `.avi`
   - 图片: `.jpg`, `.jpeg`, `.png`, `.gif`

### 评论功能

1. 在文章详情页底部
2. 填写姓名和评论内容
3. 点击"提交评论"

### AI 问答助手

1. 在文章详情页底部找到"AI 助手"区域
2. 输入问题
3. 点击"发送"
4. AI 会基于文章内容回答问题（如果配置了 OpenAI API Key）

### About 页面

- 访问 `/about` 查看博客介绍（Markdown 渲染）
- 内容描述了博客定位与“随缘更新”的理念

### Styles 主题切换

- 首页顶部导航的 `Styles` 下拉可切换主题
- 提供 `暗黑 / 亮色 / 霓虹` 三种默认风格
- 选择会自动保存，下次访问仍会保留

### 联系方式

- 访问 `/contact` 查看联系方式
- 默认列出邮箱 `787833823@qq.com`、GitHub、微博等链接

## 数据库（Supabase）

项目使用 [Supabase](https://supabase.com/) 托管 PostgreSQL 数据库。请在 Supabase 控制台中创建以下数据表（可在 Table Editor 中手动添加或使用 SQL）：

### posts
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK, default uuid_generate_v4()) | 文章 ID |
| title | text | 标题 |
| content | text | 正文 |
| excerpt | text | 摘要 |
| category | text | 分类名 |
| author | text | 作者 |
| featured_image | text | 配图 URL |
| is_published | boolean (default true) | 是否发布 |
| created_at | timestamptz (default now()) | 创建时间 |
| updated_at | timestamptz | 更新时间 |

### comments
| 字段 | 类型 |
| --- | --- |
| id (PK) | uuid |
| post_id (FK → posts.id) | uuid |
| author | text |
| email | text |
| content | text |
| parent_id | uuid |
| created_at | timestamptz default now() |

### files
| 字段 | 类型 |
| --- | --- |
| id (PK) | uuid |
| filename | text |
| original_name | text |
| file_type | text |
| file_size | bigint |
| file_path | text |
| post_id | uuid |
| uploaded_at | timestamptz default now() |

### categories
| 字段 | 类型 |
| --- | --- |
| id (PK) | uuid |
| name | text |
| slug | text (unique) |
| description | text |
| created_at | timestamptz default now() |

### ai_conversations
| 字段 | 类型 |
| --- | --- |
| id (PK) | uuid |
| question | text |
| answer | text |
| post_id | uuid |
| created_at | timestamptz default now() |

> 提示：在 Supabase SQL Editor 中执行 `create extension if not exists "uuid-ossp";` 以便使用 `uuid_generate_v4()`。

### 环境变量

在根目录创建 `.env.local` 并填入：

```
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase 项目 URL
SUPABASE_SERVICE_ROLE_KEY=你的 service role key（仅在服务端使用）
SUPABASE_ANON_KEY=可选，匿名 key
OPENAI_API_KEY=可选，OpenAI key
```

> Service Role Key 仅会在服务端使用，请勿泄露。部署到 Vercel 时，将上述变量配置到 Project Settings → Environment Variables 中。

## Supabase Storage 设置

文件上传功能使用 Supabase Storage，需要先设置：

1. 在 Supabase Dashboard 中，进入 **Storage** 页面
2. 点击 **Create a new bucket**
3. 创建名为 `files` 的 bucket
4. 设置权限：
   - **Public bucket**: 勾选（允许公开访问）
   - 或者设置 Policy 允许读取：
     ```sql
     -- 允许所有人读取
     CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'files');
     ```
5. 如果需要上传权限，添加 Policy：
   ```sql
   -- 允许服务端上传（使用 Service Role Key）
   CREATE POLICY "Service Role Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files');
   ```

## 注意事项

1. 上传的文件会保存在 Supabase Storage 的 `files` bucket 中
2. 确保 Supabase Storage bucket 已正确配置权限
3. 建议配置环境变量来保护敏感信息

## 开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 许可证

MIT

