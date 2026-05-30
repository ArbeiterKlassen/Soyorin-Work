# Soyorin.Work - AKlassen's Blogs

> 基于 EJS 模板 + CSS 变量的静态博客系统，部署于 GitHub Pages

## 技术栈

- **模板引擎**: EJS — 静态生成所有页面
- **样式方案**: CSS 变量 (`variables.css`) — 统一浅色/深色主题切换
- **构建工具**: Node.js 脚本 (`scripts/build.js`)
- **托管**: GitHub Pages (`soyorin.work`)

## 项目结构

```
├── src/                     # 源文件（权威来源）
│   ├── templates/           # EJS 模板
│   │   ├── base.ejs         #   主布局（导航栏、头图、页脚）
│   │   ├── article.ejs      #   文章包裹模板
│   │   └── pages/           #   各页面内容模板 (9个)
│   ├── styles/              # CSS 源文件（19个）
│   ├── data/                # 文章元数据 (articles.json)
│   └── articles/            # 文章正文片段 (29篇)
├── scripts/
│   └── build.js             # 构建脚本
├── articles/                # 生成的文章页 (29篇)
├── templates/               # 生成的模板页 (9个)
├── css/                     # 运行时 CSS（构建时从 src/styles/ 复制）
├── js/                      # 运行时 JS
│   ├── base.js              #   公共逻辑（导航、主题）
│   ├── comcode/             #   数据驱动组件
│   └── lib/                 #   第三方库
├── headpage/                # 导航页（独立子系统）
├── inner/                   # 密码保护区域
├── img/                     # 图片资源
├── fonts/                   # 字体文件
├── index.html               # 根导航页
└── package.json             # npm 配置
```

## 本地开发

```bash
npm install                  # 安装依赖（仅需 ejs）
node scripts/build.js        # 生成所有页面
```

构建后直接用浏览器打开 `index.html` 或 `templates/index.html` 预览。

## 添加新文章

1. 在 `src/data/articles.json` 的 `articles` 数组中添加元数据
2. 在 `src/articles/` 创建对应的 `0000xx.html`，写入正文 HTML 片段
3. 运行 `node scripts/build.js` 重新生成

## 主题切换

浅色/深色模式通过 CSS 变量实现：
- `css/variables.css` 定义 `:root`（浅色）和 `[data-theme="dark"]`（深色）两套变量
- 主题状态存储在 `localStorage.soyorin-mode`
- 右下角 ✨ 按钮切换，首次访问跟随系统 `prefers-color-scheme`

## 页面列表

| 页面 | 模板 | 说明 |
|------|------|------|
| 首页 | `index.ejs` | 文章概览、分类卡片、分页浏览 |
| 文章分类 | `category.ejs` | 按分类筛选文章 |
| 归档 | `archive.ejs` | 搜索、论文、资料下载 |
| 关于 | `about.ejs` | 个人介绍、开发历史、日历 |
| 友情链接 | `link.ejs` | 鸣谢、贡献者、学术链接 |
| 公告 | `web.sign.ejs` | 网站更新记录 |
| 清单 | `manifest.ejs` | 游戏、歌单 |
| 讨论 | `issue.ejs` | 评论区 |

## License

CC BY-NC-SA 4.0
