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
for (const art of data.articles) {
  const num = art.number;
  const filename = num.toString().padStart(6, '0') + '.html';
  const bodyPath = join(root, 'src/articles', filename);
  
  let content = '';
  if (existsSync(bodyPath)) {
    content = readFileSync(bodyPath, 'utf-8');
  }
  
  const bodyHtml = ejs.render(articleTpl, {
    hasToc: art.hasToc,
    content
  });
  
  const html = ejs.render(baseTpl, {
    title: art.name || art.title || 'Soyorin.Work',
    description: art.detail || 'Soyorin.Work - AKlassen\'s Blogs',
    keywords: 'Soyorin.Work, Blog',
    theme: 'light',
    basePath: '../',
    cssFiles: ['article-detail.css', 'code.css', 'github-markdown.css', 'vditor.css', 'loader.css'],
    hasToc: true,
    isArticle: true,
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

// 4. 处理 templates/ 下的页面（简化处理：保留主体，替换公共部分）
const templatePages = ['index.html', 'archive.html', 'category.html', 'categories.html', 'about.html', 'link.html', 'manifest.html', 'issue.html', 'web.sign.html'];

for (const page of templatePages) {
  const p = join(root, 'templates', page);
  if (!existsSync(p)) continue;
  
  let html = readFileSync(p, 'utf-8');
  
  // 移除过时代码
  html = html
    .replace(/<!--\[if lt IE 9\]>.*?<!\[endif\]-->/gs, '')
    .replace(/<meta http-equiv="X-UA-Compatible"[^>]*>/gi, '');
  
  // 替换 unescape
  html = html.replace(/unescape\(/g, 'decodeURIComponent(');
  
  // 替换 document.write 的 com_head / com_arthead 为静态 link
  // 这是一个简化：删除这些 script 标签，因为 CSS 已经合并并由 base 模板管理
  // 但由于 templates 页面没有使用 base.ejs，我们暂时保留原有结构，只做安全替换
  
  writeFileSync(p, html);
  console.log(`  -> templates/${page}`);
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

window.addEventListener('load', function() {
  const cover = document.getElementById("loader-cover");
  if (cover) {
    cover.style.opacity = 0;
    cover.style.transition = 'opacity 0.5s';
    setTimeout(function() { cover.style.zIndex = -9999; }, 1500);
  }
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
});

document.body.oncopy = function() {
  if (typeof layer !== 'undefined') {
    layer.msg("复制成功,若要转载请务必保留原文链接<br>并遵循 (CC)-BY-NC-SA 协议");
  }
};
`;
writeFileSync(join(root, 'js/main.js'), mainJs);

console.log('Build complete!');