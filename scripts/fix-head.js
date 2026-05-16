import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

const commonHead = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="HandheldFriendly" content="true">
<meta name="description" content="Soyorin.Work - AKlassen's Blogs">
<meta name="keywords" content="Soyorin.Work, Blog">
<link rel="shortcut icon" href="../headpage/icon.png">
<link rel="stylesheet" href="../css/variables.css">
<link rel="stylesheet" href="../css/global.css">
<link rel="stylesheet" href="../css/pace-theme-flash.css">
<link rel="stylesheet" href="../css/d-audio.css">
<link rel="stylesheet" href="../css/myPagination.css">
<link rel="stylesheet" href="../css/sign.css">
<link rel="stylesheet" href="../css/index.css">
<link rel="stylesheet" href="../css/archive.css">
<link rel="stylesheet" href="../css/link.css">
<link rel="stylesheet" href="../css/about.css">
<link rel="stylesheet" href="../css/font.css">
<link rel="stylesheet" href="../css/loader.css">
<link rel="stylesheet" href="../css/manifest.css">`;

function fixDir(dir, headContent) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) continue;
    if (!f.endsWith('.html')) continue;
    
    let html = readFileSync(p, 'utf-8');
    if (html.includes('variables.css')) continue; // already fixed
    
    html = html.replace(/<\/head>/i, headContent + '\n</head>');
    writeFileSync(p, html);
    console.log(`Fixed head: ${p.replace(root + '\\', '').replace(root + '/', '')}`);
  }
}

fixDir(join(root, 'templates'), commonHead);

const innerHead = commonHead.replace(/\.\.\//g, '../');
fixDir(join(root, 'inner'), innerHead);

console.log('Done.');
