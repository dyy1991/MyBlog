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
- **数据库**: JSON 文件存储（无需编译，跨平台）
- **Markdown 渲染**: react-markdown
- **代码高亮**: react-syntax-highlighter
- **AI 集成**: OpenAI API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量（可选）

创建 `.env.local` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

如果不配置 OpenAI API Key，AI 助手会返回模拟回答。

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

## 数据库

项目使用 JSON 文件存储数据，数据文件会自动创建在 `data/` 目录下。

数据文件：
- `data/posts.json` - 文章数据
- `data/comments.json` - 评论数据
- `data/files.json` - 文件数据
- `data/ai_conversations.json` - AI 对话历史数据

**注意**: JSON 文件存储方案无需编译原生模块，适合快速开发和跨平台部署。如需更高性能，可以迁移到其他数据库系统。

## 注意事项

1. 上传的文件会保存在 `public/uploads` 目录
2. 确保该目录有写入权限
3. 生产环境建议使用更强大的数据库（如 PostgreSQL）
4. 建议配置环境变量来保护敏感信息

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

