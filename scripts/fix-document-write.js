import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

function fixFile(p) {
  let content = readFileSync(p, 'utf-8');
  const original = content;
  
  // 如果文件里有 document.write 但没有 safeWrite helper，先注入 helper
  if (content.includes('document.write') && !content.includes('function insertHtml')) {
    content = `
function insertHtml(html) {
  const currentScript = document.currentScript;
  if (currentScript) {
    currentScript.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}
` + content;
  }
  
  // 替换 document.write('...') 为 insertHtml('...')
  // 需要处理单引号和双引号包裹的参数
  content = content.replace(/document\.write\(/g, 'insertHtml(');
  
  if (content !== original) {
    writeFileSync(p, content);
    console.log(`Fixed: ${p.replace(root + '\\', '').replace(root + '/', '')}`);
  }
}

// 处理 js/comcode/ 下的文件
const comcodeDir = join(root, 'js/comcode');
for (const f of readdirSync(comcodeDir)) {
  const p = join(comcodeDir, f);
  if (statSync(p).isFile() && p.endsWith('.js')) {
    fixFile(p);
  }
}

// 处理 js/ 根目录下包含 document.write 的文件
const jsDir = join(root, 'js');
for (const f of readdirSync(jsDir)) {
  const p = join(jsDir, f);
  if (statSync(p).isFile() && p.endsWith('.js')) {
    fixFile(p);
  }
}

// 处理 articles/default.html
const defaultHtml = join(root, 'articles/default.html');
if (existsSync(defaultHtml)) {
  let html = readFileSync(defaultHtml, 'utf-8');
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/com_arthead\.js"[^>]*><\/script>/gi, '');
  html = html.replace(/<script[^>]*src="\.\.\/js\/global_header\.js"[^>]*><\/script>/gi, '');
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/article-footer\.js"[^>]*><\/script>/gi, '');
  html = html.replace(/unescape\(/g, 'decodeURIComponent(');
  writeFileSync(defaultHtml, html);
  console.log('Fixed: articles/default.html');
}

console.log('Document.write fix done.');
