import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const articlesDir = 'articles';

for (const f of readdirSync(articlesDir)) {
  if (!f.endsWith('.html')) continue;
  const p = join(articlesDir, f);
  let html = readFileSync(p, 'utf-8');
  
  // 移除日夜切换的 document.write 代码块
  html = html.replace(/\s*if\(mode==1\)document\.write\('<div[^>]*>.*?<\/div>'\)\s*/g, '');
  html = html.replace(/\s*if\(mode==2\)document\.write\('<div[^>]*>.*?<\/div>'\)\s*/g, '');
  
  // 移除 getParams 和 mode 的重复定义（因为 base.ejs 已经提供了）
  html = html.replace(/<script>\s*function getParams\(key\)\s*\{[\s\S]*?\}\s*var mode = 1;[\s\S]*?<\/script>/g, '');
  
  writeFileSync(p, html);
  console.log(`Cleaned: ${f}`);
}

console.log('Article cleanup done.');
