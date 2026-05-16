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
    
    // Pattern 1: if(mode==1)document.write('...')
    html = html.replace(/if\s*\(\s*mode\s*==\s*1\s*\)\s*document\.write\(('.*?')\)/g, "if(mode==1)document.currentScript.insertAdjacentHTML('beforebegin',$1)");
    // Pattern 2: if(mode==2)document.write('...')
    html = html.replace(/if\s*\(\s*mode\s*==\s*2\s*\)\s*document\.write\(('.*?')\)/g, "if(mode==2)document.currentScript.insertAdjacentHTML('beforebegin',$1)");
    // Pattern 3: for(...)document.write('...')
    html = html.replace(/for\s*\([^)]+\)\s*document\.write\(('.*?')\)/g, "document.currentScript.insertAdjacentHTML('beforebegin',$1)");
    // Pattern 4: standalone document.write('...') in one line
    html = html.replace(/^\s*document\.write\(('.*?')\)\s*$/gm, "document.currentScript.insertAdjacentHTML('beforebegin',$1)");
    
    if (html !== original) {
      writeFileSync(p, html);
      console.log(`Cleaned: ${p.replace(root + '\\', '').replace(root + '/', '')}`);
    }
  }
}

fixDir(join(root, 'templates'));
fixDir(join(root, 'inner'));
fixDir(join(root, 'articles'));

console.log('Final cleanup done.');
