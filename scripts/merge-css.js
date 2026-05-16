import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const cssDir = 'css';
const outDir = 'src/styles';

const colorMap = {
  '#fff': 'bg-primary',
  '#ffffff': 'bg-primary',
  '#000': 'text-primary',
  '#000000': 'text-primary',
  '#21252b': 'bg-body',
  '#2b2b2cf4': 'bg-primary',
  '#161728': 'bg-secondary',
  '#161728a0': 'bg-card',
  '#ffffffb6': 'text-on-dark',
  '#ededed': 'text-secondary',
  '#cbcbcb': 'text-secondary',
  '#d8d8d8': 'text-secondary',
  '#666666': 'text-muted',
  '#666': 'text-muted',
  '#292929': 'text-secondary',
  '#4e4e4e': 'text-tertiary',
  '#999999': 'text-light',
  '#999': 'text-light',
  '#fafafa': 'bg-secondary',
  '#f2f2f2': 'bg-secondary',
  '#f8f8f8': 'bg-code',
  '#007aff': 'text-link',
  '#3aa4ff': 'text-link-hover',
  '#ff1f30': 'text-danger',
  '#767676': 'text-muted',
  '#ececec': 'border-light',
  '#eceff2': 'border-light',
  '#ebebeb': 'border-light',
  '#303643': 'nav-bg',
  '#fdfefe': 'bg-primary',
  '#f0f1f2': 'border-light',
  '#696868': 'text-muted',
  '#bcbcbc': 'text-muted',
  '#4949498c': 'border-color',
};

function normalizeColor(c) {
  c = c.trim().toLowerCase();
  if (c.length === 4 && c[0] === '#') {
    return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
  }
  return c;
}

function replaceColors(css) {
  let result = css;
  const entries = Object.entries(colorMap).sort((a, b) => b[0].length - a[0].length);
  
  for (const [color, varName] of entries) {
    const forms = new Set([color, normalizeColor(color)]);
    for (const form of forms) {
      const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`([: ,])(${escaped})([;!}\\s)"'])`, 'gi');
      result = result.replace(regex, (match, p1, p2, p3) => `${p1}var(--${varName})${p3}`);
    }
  }
  
  return result;
}

function extractRules(css) {
  const rules = [];
  const regex = /([^{]+)\{([^}]+)\}/g;
  let m;
  while ((m = regex.exec(css)) !== null) {
    const selector = m[1].trim();
    const body = m[2].trim();
    rules.push({ selector, body });
  }
  return rules;
}

function mergePair(dayPath, nightPath, outName) {
  const dayCss = readFileSync(dayPath, 'utf-8');
  const nightCss = readFileSync(nightPath, 'utf-8');
  
  const dayRules = extractRules(dayCss);
  const nightRules = extractRules(nightCss);
  
  const dayMap = new Map(dayRules.map(r => [r.selector, r.body]));
  const nightMap = new Map(nightRules.map(r => [r.selector, r.body]));
  
  const allSelectors = new Set([...dayMap.keys(), ...nightMap.keys()]);
  const commonCss = [];
  const darkOverrides = [];
  
  for (const sel of allSelectors) {
    const d = dayMap.get(sel);
    const n = nightMap.get(sel);
    
    if (d && n && d !== n) {
      // 两者都有但不同：尝试变量化 day 版本，如果不同则添加 dark 覆盖
      const dVar = replaceColors(d);
      const nVar = replaceColors(n);
      if (dVar === nVar) {
        commonCss.push(`${sel} {\n${dVar}\n}`);
      } else {
        commonCss.push(`${sel} {\n${dVar}\n}`);
        darkOverrides.push(`${sel} {\n${nVar}\n}`);
      }
    } else if (d) {
      commonCss.push(`${sel} {\n${replaceColors(d)}\n}`);
    } else if (n) {
      // night 独有
      darkOverrides.push(`${sel} {\n${replaceColors(n)}\n}`);
    }
  }
  
  let output = commonCss.join('\n\n');
  if (darkOverrides.length > 0) {
    output += '\n\n/* Dark Mode Overrides */\n';
    for (const rule of darkOverrides) {
      output += `[data-theme="dark"] ${rule}\n\n`;
    }
  }
  
  writeFileSync(join(outDir, outName), output);
  console.log(`Merged: ${outName} (${dayRules.length} day + ${nightRules.length} night rules)`);
}

const files = readdirSync(cssDir);
const nightFiles = files.filter(f => f.startsWith('night.') && f.endsWith('.css'));
const processed = new Set();

for (const nf of nightFiles) {
  const baseName = nf.replace('night.', '');
  const dayPath = join(cssDir, baseName);
  const nightPath = join(cssDir, nf);
  if (files.includes(baseName)) {
    mergePair(dayPath, nightPath, baseName);
    processed.add(baseName);
  }
}

for (const f of files) {
  if (f.endsWith('.css') && !f.startsWith('night.') && !processed.has(f)) {
    const css = readFileSync(join(cssDir, f), 'utf-8');
    writeFileSync(join(outDir, f), replaceColors(css));
    console.log(`Copied: ${f}`);
  }
}

console.log('CSS merge done.');
