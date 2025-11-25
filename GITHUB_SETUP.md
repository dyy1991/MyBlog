# 上传项目到 GitHub 指南

## 方法一：在 Cursor 编辑器中直接操作（推荐）

### 步骤 1: 在 GitHub 上创建新仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 **+** 号，选择 **New repository**
3. 填写仓库信息：
   - **Repository name**: `philosophy-blog` (或你喜欢的名字)
   - **Description**: `个人博客系统 - 支持在线编辑、文件上传、评论和AI问答`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
4. 点击 **Create repository**

### 步骤 2: 在 Cursor 中连接远程仓库

#### 方式 A: 使用源代码管理面板（Source Control）

1. **打开源代码管理面板**：
   - 点击左侧边栏的源代码管理图标（分支图标）或按 `Ctrl+Shift+G`
   - 或者点击顶部菜单 **View** → **Source Control**

2. **添加远程仓库**：
   - 点击源代码管理面板右上角的 **...** (三个点)
   - 选择 **Remote** → **Add Remote**
   - 输入远程名称：`origin`
   - 输入远程 URL：`https://github.com/你的用户名/philosophy-blog.git`
     （将 `你的用户名` 替换为你的 GitHub 用户名）

3. **推送代码**：
   - 点击源代码管理面板右上角的 **...**
   - 选择 **Push** → **Push to...**
   - 选择 `origin` 和 `master` 分支
   - 或者直接点击 **↑** 图标（如果已设置默认远程）

#### 方式 B: 使用命令面板

1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 `Git: Add Remote`，选择并输入：
   - Remote name: `origin`
   - Remote URL: `https://github.com/你的用户名/philosophy-blog.git`
3. 再次按 `Ctrl+Shift+P`，输入 `Git: Push`，选择远程和分支

### 步骤 3: 验证上传

访问你的 GitHub 仓库页面，应该能看到所有文件都已上传。

---

## 方法二：使用终端命令（备选）

如果你更喜欢使用命令行，可以在 Cursor 的集成终端中执行：

### 1. 添加远程仓库

```bash
git remote add origin https://github.com/你的用户名/philosophy-blog.git
```

### 2. 重命名分支为 main（如果 GitHub 使用 main 作为默认分支）

```bash
git branch -M main
```

### 3. 推送代码

```bash
git push -u origin main
```

如果遇到分支名称问题，使用：

```bash
git push -u origin master
```

---

## 常见问题解决

### 问题 1: 需要身份验证

如果推送时要求输入用户名和密码：

**解决方案**：使用 Personal Access Token (PAT)

1. 访问 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限
4. 生成后复制 token
5. 推送时：
   - Username: 你的 GitHub 用户名
   - Password: 粘贴刚才复制的 token

### 问题 2: 分支名称不匹配

如果 GitHub 默认分支是 `main`，而本地是 `master`：

```bash
git branch -M main
git push -u origin main
```

### 问题 3: 远程仓库已存在文件

如果 GitHub 仓库初始化时创建了 README：

```bash
git pull origin main --allow-unrelated-histories
# 解决可能的冲突后
git push -u origin main
```

---

## 后续操作

### 日常更新代码到 GitHub

1. **在源代码管理面板中**：
   - 修改文件后，文件会出现在 "Changes" 区域
   - 点击 **+** 号暂存更改（或点击文件名旁的 **+**）
   - 在消息框中输入提交信息
   - 点击 **✓** 提交
   - 点击 **↑** 推送到 GitHub

2. **使用命令**：
   ```bash
   git add .
   git commit -m "你的提交信息"
   git push
   ```

### 查看提交历史

- 在源代码管理面板中点击提交历史图标
- 或使用命令：`git log`

### 创建分支

- 点击源代码管理面板左下角的分支名称
- 选择 "Create new branch"
- 输入分支名称

---

## 提示

- ✅ 每次推送前先提交更改
- ✅ 提交信息要清晰描述改动内容
- ✅ 定期推送，避免本地代码丢失
- ✅ 重要更改前创建分支备份

