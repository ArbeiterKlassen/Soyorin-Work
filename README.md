# Soyorin.Work - AKlassen's Blogs

> 重构后的静态博客系统，基于 EJS 模板 + CSS 变量 + Node.js 构建脚本。

## 项目结构

```
├── src/                    # 源码目录
│   ├── templates/          # EJS 模板
│   ├── styles/             # 合并后的 CSS（使用 CSS 变量）
│   ├── data/               # 文章元数据 JSON
│   └── articles/           # 文章正文提取
├── scripts/                # 构建和重构脚本
│   ├── build.js            # 主构建脚本
│   └── merge-css.js        # CSS 合并脚本
├── articles/               # 生成的文章页（28篇）
├── templates/              # 生成的模板页
├── css/                    # 运行时 CSS（含 variables.css）
├── js/                     # 运行时 JS
│   └── main.js             # 重构后的公共逻辑
├── package.json            # npm 配置
└── index.html              # 导航页
```

## 高优先级重构完成清单

### ✅ 1. 彻底消灭 document.write（874处 → 0处）
- 文章页（28篇）改用 EJS 模板静态生成
- 模板页（index/archive/category 等）内联静态 HTML 替换动态 document.write
- JS 公共文件（global_header.js, comcode/*）全部改为 `insertAdjacentHTML`

### ✅ 2. 日夜模式 CSS 合并为 CSS 变量
- 删除所有 `night.*.css` 文件（约 15 个）
- 新建 `css/variables.css`，通过 `data-theme="dark"` 切换
- 支持系统级 `prefers-color-scheme: dark` 自动适配

### ✅ 3. 文章模板化 + 数据 JSON 化
- 文章元数据从 `com_artmenu.js` 提取到 `src/data/articles.json`
- 文章正文从原 HTML 提取，用统一模板重新生成
- 新增文章只需更新 JSON + 添加正文到 `src/articles/`

### ✅ 4. 替换废弃 API / 清理过时代码
- `unescape()` → `decodeURIComponent()`（全局替换）
- 删除所有 `<!--[if lt IE 9]>` 条件注释和 `html5shiv`
- 删除 `X-UA-Compatible` 等过时 meta
- 新建 `js/main.js` 整合公共逻辑（主题切换、参数解析、loader 动画）
- 版权年份改为自动更新 `new Date().getFullYear()`

### ✅ 5. 安全与性能优化
- 为 CDN 资源添加 `integrity` 占位符（需替换为真实 SRI hash）
- Google Analytics UA 标签标记为 GA4 迁移提示
- 模板中移除 `document.write` 导致的渲染阻塞

## 本地开发

```bash
# 安装依赖
npm install

# 生成文章页和复制资源
node scripts/build.js

# 启动开发服务器（如需）
npm run dev
```

## 添加新文章

1. 在 `src/data/articles.json` 的 `articles` 数组中添加元数据
2. 在 `src/articles/` 目录下新建 `0000xx.html`，写入文章正文（只保留 `<section class="main">` 内部的内容）
3. 运行 `node scripts/build.js` 重新生成

## 后续可继续优化（中低优先级）

- [ ] 引入 Vite 进行 CSS/JS 压缩和构建
- [ ] jQuery 3.4.1 升级或迁移到原生 JS
- [ ] MathJax 2.7.5 升级到 3.x 或 KaTeX
- [ ] 文章正文改为 Markdown 源文件
- [ ] 添加 PWA 支持（manifest + Service Worker）
- [ ] 图片懒加载完善 + 响应式图片 srcset
- [ ] 添加 sitemap.xml 和 robots.txt
