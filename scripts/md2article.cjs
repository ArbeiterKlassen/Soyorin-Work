// Markdown to Article HTML Converter
// Usage: node scripts/md2article.cjs <input.md> <article_number>
// Example: node scripts/md2article.cjs temp-mds/myarticle.md 32

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node scripts/md2article.cjs <input.md> <article_number>');
    console.log('Example: node scripts/md2article.cjs temp-mds/myarticle.md 32');
    process.exit(1);
}

const [inputFile, artNum] = args;
const paddedNum = String(artNum).padStart(6, '0');

let md = fs.readFileSync(inputFile, 'utf-8');
md = md.replace(/\r\n/g, '\n');

// Fenced code blocks -> .code-holder with line numbers
md = md.replace(/```(\w*)\n([\s\S]*?)```/g, function(m, lang, code) {
    let escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let lines = escaped.split('\n').map(l => '<span class="code-line">' + (l || '&nbsp;') + '</span>');
    return '\n<div class="code-holder"><code>' + lines.join('\n') + '</code></div>\n';
});

// Inline code
md = md.replace(/`([^`]+)`/g, '<code>$1</code>');

// Headers
md = md.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>');
md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>');
md = md.replace(/^# (.+)$/gm, '<h1>$1</h1>');

// Bold
md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// Horizontal rules
md = md.replace(/^---$/gm, '<hr>');

// Bullet lists
md = md.replace(/^- (.+)$/gm, '<li>$1</li>');
md = md.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');

// Links
md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

// Paragraphs
md = md.replace(/\n\n/g, '</p>\n<p>');

// Wrap in font style for English articles
let html = '<div style="font-family:Times New Roman,Times,serif;">\n<p>' + md + '</p>\n</div>';

const outPath = 'src/articles/' + paddedNum + '.html';
fs.writeFileSync(outPath, html);

console.log('Created ' + outPath);
console.log('Headings:', (html.match(/<h[1-4]>/g) || []).length);
console.log('Code blocks:', (html.match(/code-holder/g) || []).length);
console.log('');
console.log('Next steps:');
console.log('1. Add entry to src/data/articles.json');
console.log('2. Add entry to js/comcode/com_artmenu.js');
console.log('3. Run: node scripts/build.js');
