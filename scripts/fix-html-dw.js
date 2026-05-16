import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

function fixDir(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      if (f !== 'node_modules') fixDir(p);
      continue;
    }
    if (!f.endsWith('.html')) continue;
    
    let html = readFileSync(p, 'utf-8');
    const original = html;
    
    // Match document.write inside script tags, multiline
    html = html.replace(/(<script[^>]*>)([\s\S]*?)document\.write\(([\s\S]*?)\)([\s\S]*?)(<\/script>)/g, (match, p1, p2, p3, p4, p5) => {
      return `${p1}${p2}document.currentScript.insertAdjacentHTML('beforebegin', ${p3})${p4}${p5}`;
    });
    
    if (html !== original) {
      writeFileSync(p, html);
      console.log(`Fixed DW: ${p.replace(root + '\\', '').replace(root + '/', '')}`);
    }
  }
}

fixDir(join(root, 'templates'));
fixDir(join(root, 'inner'));
fixDir(join(root, 'articles'));

console.log('HTML document.write fix done.');
