import ejs from 'ejs';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// 读取模板
const baseTpl = readFileSync(join(root, 'src/templates/base.ejs'), 'utf-8');
const articleTpl = readFileSync(join(root, 'src/templates/article.ejs'), 'utf-8');
const data = JSON.parse(readFileSync(join(root, 'src/data/articles.json'), 'utf-8'));

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const item of readdirSync(src)) {
    const s = join(src, item);
    const d = join(dest, item);
    const stat = statSync(s);
    if (stat.isDirectory()) {
      copyDir(s, d);
    } else {
      copyFileSync(s, d);
    }
  }
}

// 1. 复制新 CSS 到 css/ 目录（保留子目录如 hangingcat）
console.log('Copying CSS...');
const cssSrc = join(root, 'src/styles');
const cssDest = join(root, 'css');
for (const f of readdirSync(cssSrc)) {
  const s = join(cssSrc, f);
  const d = join(cssDest, f);
  const stat = statSync(s);
  if (stat.isDirectory()) {
    copyDir(s, d);
  } else {
    copyFileSync(s, d);
  }
}

// 写入 variables.css
const vars = readFileSync(join(root, 'src/styles/variables.css'), 'utf-8');
writeFileSync(join(cssDest, 'variables.css'), vars);

// 2. 生成文章页
console.log('Generating articles...');
// Sort articles by number descending (newest first) for prev/next navigation
const sortedArticles = [...data.articles].sort((a, b) => b.number - a.number);
for (let idx = 0; idx < sortedArticles.length; idx++) {
  const art = sortedArticles[idx];
  const num = art.number;
  const filename = num.toString().padStart(6, '0') + '.html';
  const bodyPath = join(root, 'src/articles', filename);

  let content = '';
  if (existsSync(bodyPath)) {
    content = readFileSync(bodyPath, 'utf-8');
  }

  // Prev (older) = next in sorted array, Next (newer) = prev in sorted array
  const prevArticle = idx < sortedArticles.length - 1 ? sortedArticles[idx + 1] : null;
  const nextArticle = idx > 0 ? sortedArticles[idx - 1] : null;

  const bodyHtml = ejs.render(articleTpl, {
    hasToc: art.hasToc,
    content,
    prev: prevArticle,
    next: nextArticle
  });
  
  const html = ejs.render(baseTpl, {
    title: art.name || art.title || 'Soyorin.Work',
    description: art.detail || 'Soyorin.Work - AKlassen\'s Blogs',
    keywords: 'Soyorin.Work, Blog',
    theme: 'light',
    basePath: '../',
    cssFiles: ['article-detail.css', 'code.css', 'github-markdown.css', 'vditor.css'],
    hasToc: true,
    isArticle: true,
    hasHeadpic: false,
    headpicTitle: '',
    headpicSubtitle: '',
    body: bodyHtml
  });
  
  writeFileSync(join(root, 'articles', filename), html);
  console.log(`  -> articles/${filename}`);
}

// 3. 处理首页 index.html（根目录）
console.log('Processing index.html...');
const indexHtml = readFileSync(join(root, 'index.html'), 'utf-8');
// 保留现有 index.html，但做关键替换：
// - 删除 IE 条件注释
// - 删除 X-UA-Compatible
// - unescape -> decodeURIComponent
let newIndex = indexHtml
  .replace(/<!--\[if lt IE 9\]>.*?<!\[endif\]-->/gs, '')
  .replace(/<meta http-equiv="X-UA-Compatible"[^>]*>/gi, '')
  .replace(/unescape\(/g, 'decodeURIComponent(');
writeFileSync(join(root, 'index.html'), newIndex);

// 4. 从 EJS 生成 templates/ 下的页面
console.log('Generating template pages from EJS...');

const pageConfigs = [
  {
    file: 'index.html',
    ejs: 'index.ejs',
    title: 'Soyorin.Work - 首页',
    headpicTitle: '<div style="color:rgb(0, 102, 255);display: inline;">S</div>oyorin.Work',
    headpicSubtitle: '<div style="color:rgb(0, 102, 255);display: inline;">A</div> Web Designed for Various Thoughts & Records',
    cssFiles: ['index.css', 'sign.css', 'archive.css'],
    extraHead: ''
  },
  {
    file: 'about.html',
    ejs: 'about.ejs',
    title: 'SOYORIN__关于',
    headpicTitle: '<div style="color:rgb(0,102,255);display: inline;">关</div>于Soyorin.Work和我',
    headpicSubtitle: '<div style="color:rgb(0,102,255);display: inline;">&Uuml;</div>ber diese Website und mir',
    cssFiles: ['about.css', 'calendar.css', 'link.css', 'index.css', 'sign.css'],
    extraHead: '<style>@import url("../css/calendar.css");</style>'
  },
  {
    file: 'category.html',
    ejs: 'category.ejs',
    title: 'SOYORIN__分类',
    headpicTitle: '<div style="color:rgb(0,102,255);display: inline;">文</div>章分类',
    headpicSubtitle: '<div style="color:rgb(0,102,255);display: inline;">A</div>rtikel-Kategorien',
    cssFiles: ['index.css', 'sign.css', 'archive.css'],
    extraHead: '<link rel="stylesheet" href="https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css"><style>.search {width: 100%;position: relative;display: flex;}.searchTerm {width: 100%;border: 1px solid var(--border-light);border-right: none;padding: 8px 12px;height: 36px;border-radius: 5px 0 0 5px;outline: none;color: var(--text-primary);background: var(--bg-secondary);}.searchTerm:focus{color: var(--text-primary);border-color: var(--text-link);}.searchButton {width: 40px;height: 36px;border: 1px solid var(--text-link);background: var(--text-link);text-align: center;color: #fff;border-radius: 0 5px 5px 0;cursor: pointer;font-size: 20px;}details {transition: height 0.5s ease;overflow: hidden;}summary {cursor: pointer;color: var(--text-primary);}details:not([open]) > div {height: 0;}</style>'
  },
  {
    file: 'categories.html',
    ejs: 'categories.ejs',
    title: 'Soyorin.Work - AKlassen\'s Blogs',
    headpicTitle: '<div style="color:red;display: inline;">分</div>类于"<script>document.write(translate[cate-1])</script>"的文章',
    headpicSubtitle: '<div style="color:red;display: inline;">A</div>rtikel-Kategorien',
    cssFiles: ['index.css', 'sign.css', 'archive.css'],
    extraHead: '<script type="text/javascript" src="../js/comcode/com_artmenu.js"></script>'
  },
  {
    file: 'link.html',
    ejs: 'link.ejs',
    title: 'SOYORIN__友情链接',
    headpicTitle: '<div style="color:rgb(0,102,255);display: inline;">友</div>情链接',
    headpicSubtitle: '<div style="color:rgb(0,102,255);display: inline;">L</div>inks',
    cssFiles: ['link.css', 'about.css', 'index.css', 'sign.css'],
    extraHead: ''
  },
  {
    file: 'manifest.html',
    ejs: 'manifest.ejs',
    title: 'SOYORIN__清单',
    headpicTitle: '<div id="manifest-title"><div style="color:rgb(0,102,255);display: inline;">清</div>单</div>',
    headpicSubtitle: '<div style="color:rgb(0,102,255);display: inline;">L</div>iste',
    cssFiles: ['manifest.css', 'index.css', 'sign.css'],
    extraHead: ''
  },
  {
    file: 'issue.html',
    ejs: 'issue.ejs',
    title: 'SOYORIN__评论',
    headpicTitle: '<div style="color:rgb(0,102,255);display: inline;">讨</div>论|提案|建议|开发',
    headpicSubtitle: '<div style="color:rgb(0,102,255);display: inline;">D</div>iskussion|Vorlage|Vorschlag|Entwicklung',
    cssFiles: ['index.css', 'github-markdown.css'],
    extraHead: '<link rel="shortcut icon" href="../img/builder.jpeg">'
  },
  {
    file: 'web.sign.html',
    ejs: 'web.sign.ejs',
    title: 'SOYORIN__公告',
    headpicTitle: '<div style="color:rgb(0,102,255);display: inline;">公</div>告',
    headpicSubtitle: '<div style="color:rgb(0,102,255);display: inline;">A</div>nk&uuml;ndigung',
    cssFiles: ['sign.css', 'index.css', 'archive.css'],
    extraHead: ''
  }
];

for (const cfg of pageConfigs) {
  const pageTplPath = join(root, 'src/templates/pages', cfg.ejs);
  if (!existsSync(pageTplPath)) {
    console.log(`  SKIP templates/${cfg.file} (no EJS source)`);
    continue;
  }
  const pageTpl = readFileSync(pageTplPath, 'utf-8');
  const bodyHtml = ejs.render(pageTpl, {});
  
  const html = ejs.render(baseTpl, {
    title: cfg.title,
    description: 'Soyorin.Work - AKlassen\'s Blogs',
    keywords: 'Soyorin.Work, Blog',
    theme: 'light',
    basePath: '../',
    cssFiles: cfg.cssFiles,
    hasToc: false,
    isArticle: false,
    hasHeadpic: true,
    headpicTitle: cfg.headpicTitle,
    headpicSubtitle: cfg.headpicSubtitle,
    extraHead: cfg.extraHead || '',
    body: bodyHtml
  });
  
  const outPath = join(root, 'templates', cfg.file);
  writeFileSync(outPath, html);
  console.log(`  -> templates/${cfg.file}`);
}

// 5. 创建新的 main.js 替换 global_header.js 和 footer.js 的动态加载
// 5. 创建新的 main.js 替换全局逻辑
console.log('Creating new main.js...');
const mainJs = `
// Soyorin.Work - Refactored Main JS
(function() {
  const saved = localStorage.getItem('soyorin-mode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === '2' : prefersDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
})();

function pagereload(colormode) {
  localStorage.setItem('soyorin-mode', colormode);
  document.documentElement.setAttribute('data-theme', colormode === 2 ? 'dark' : 'light');
}

function getParams(key) {
  const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

function hasadmission() {
  return localStorage.getItem('soyorin-admission') !== null;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

document.body.oncopy = function() {
  if (typeof layer !== 'undefined') {
    layer.msg("复制成功,若要转载请务必保留原文链接<br>并遵循 (CC)-BY-NC-SA 协议");
  }
};
`;
writeFileSync(join(root, 'js/main.js'), mainJs);

console.log('Build complete!');