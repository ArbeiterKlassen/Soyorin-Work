# Soyorin.Work - AKlassen's Blogs

> 基于 EJS 模板 + CSS 变量的静态博客系统，部署于 GitHub Pages

## 技术栈

- **模板引擎**: EJS — 静态生成所有页面
- **样式方案**: CSS 变量 (`variables.css`) — 统一浅色/深色主题切换
- **构建工具**: Node.js 脚本 (`scripts/build.js`)
- **文章转换**: Markdown → HTML (`scripts/md2article.cjs`)
- **托管**: GitHub Pages (`soyorin.work`)

## 项目结构

```
├── src/                     # 源文件（权威来源）
│   ├── templates/           # EJS 模板
│   │   ├── base.ejs         #   主布局（导航栏、头图、页脚、主题切换）
│   │   ├── article.ejs      #   文章包裹模板（含目录 TOC）
│   │   └── pages/           #   各页面内容模板 (9个)
│   ├── styles/              # CSS 源文件
│   ├── data/                # 文章元数据 (articles.json)
│   └── articles/            # 文章正文片段 (31篇)
├── scripts/
│   ├── build.js             # 主构建脚本
│   └── md2article.cjs       # Markdown → 文章 HTML 转换器
├── temp-mds/                # 待转换的 Markdown 文件
├── articles/                # 生成的文章页 (31篇)
├── templates/               # 生成的模板页 (9个)
├── css/                     # 运行时 CSS（构建时从 src/styles/ 复制）
├── js/                      # 运行时 JS
│   ├── base.js              #   公共逻辑（导航菜单、主题）
│   ├── comcode/             #   数据驱动组件（文章列表、搜索）
│   └── ...                  #   第三方库 (jQuery, layer, etc.)
├── headpage/                # 导航页（独立子系统）
├── inner/                   # 密码保护区域
├── img/ fonts/              # 资源文件
├── index.html               # 根导航页
└── package.json             # npm 配置（仅需 ejs）
```

## 本地开发

```bash
npm install                  # 安装依赖
node scripts/build.js        # 生成所有页面
```

用浏览器直接打开 `index.html` 或 `templates/index.html` 预览。

## 添加新文章

### 方式一：从 Markdown 转换（推荐）

```bash
# 1. 将 .md 文件放到 temp-mds/
# 2. 运行转换器
node scripts/md2article.cjs temp-mds/myarticle.md 32

# 3. 编辑 src/data/articles.json 添加文章元数据（number, class, author, name, headpic, detail, hasToc）
# 4. 编辑 js/comcode/com_artmenu.js 在 artmenu 数组首位添加对应条目
# 5. 构建
node scripts/build.js
```

### 方式二：手写 HTML

1. 在 `src/data/articles.json` 的 `articles` 数组首位添加元数据
2. 在 `src/articles/` 创建 `0000xx.html`，写入正文 HTML 片段
3. 在 `js/comcode/com_artmenu.js` 的 `artmenu` 数组首位添加对应条目
4. 运行 `node scripts/build.js` 重新生成

### 文章元数据字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `number` | 文章编号 | `32` |
| `class` | 分类代码 | `"code"` |
| `links` | 链接路径 | `"../articles/000032.html"` |
| `time` | 发布日期 | `"2026-5-30"` |
| `author` | 作者 | `"ArbeiterKlassen"` |
| `name` | 文章标题 | `"我的文章"` |
| `headpic` | 封面图 URL | `"https://img.soyorin.work/..."` |
| `detail` | 简介 | `"一句话描述"` |
| `hasToc` | 是否显示目录 | `true` / `false` |

## Markdown 支持的语法

| 语法 | 效果 |
|------|------|
| `# ## ### ####` | 一至四级标题 |
| `**文本**` | 粗体 |
| `` `代码` `` | 行内代码 |
| ` ``` ` 代码块 ` ``` ` | 代码块（自动行号 + 悬浮延时变蓝） |
| `- 条目` | 无序列表 |
| `---` | 分隔线 |
| `[文本](URL)` | 链接 |

## 文章目录 (TOC)

- 给文章设置 `"hasToc": true` 即可启用
- 目录自动扫描文章中的 h1-h3 标题生成
- 桌面端：悬浮在文章右侧，滚动时自动吸顶（导航栏下方）
- 移动端：自动隐藏
- 代码块自动显示行号（CSS counter 实现）

## 主题切换

- CSS 变量定义在 `css/variables.css`，分 `:root`（浅色）和 `[data-theme="dark"]`（深色）两套
- 主题存储在 `localStorage.soyorin-mode`
- 右下角按钮切换 🌙/☀️
- 首次访问跟随系统 `prefers-color-scheme`

## 页面列表

| 页面 | 模板 | 说明 |
|------|------|------|
| 首页 | `index.ejs` | 文章概览、分类卡片、分页浏览 |
| 文章分类 | `category.ejs` | 按分类筛选，侧栏+文章列表 |
| 归档 | `archive.ejs` | 搜索、论文、资料下载 |
| 关于 | `about.ejs` | 个人介绍、开发历史、日历（含农历） |
| 友情链接 | `link.ejs` | 鸣谢、贡献者、学术链接 |
| 公告 | `web.sign.ejs` | 网站更新记录 |
| 清单 | `manifest.ejs` | 游戏、歌单 |
| 讨论 | `issue.ejs` | 评论区 |

## License

CC BY-NC-SA 4.0
