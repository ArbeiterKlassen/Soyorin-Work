import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = 'src/articles';

for (const f of readdirSync(dir)) {
  if (!f.endsWith('.html')) continue;
  const p = join(dir, f);
  let html = readFileSync(p, 'utf-8');
  
  // 移除日夜切换的 document.write 代码块
  html = html.replace(/\s*if\(mode==1\)document\.write\('<div[^>]*>.*?<\/div>'\)\s*/g, '');
  html = html.replace(/\s*if\(mode==2\)document\.write\('<div[^>]*>.*?<\/div>'\)\s*/g, '');
  
  writeFileSync(p, html);
  console.log(`Cleaned src: ${f}`);
}

console.log('Done.');
