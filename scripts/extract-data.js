import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// 1. 从 com_artmenu.js 提取文章元数据
const artmenuPath = 'js/comcode/com_artmenu.js';
const artmenuContent = readFileSync(artmenuPath, 'utf-8');

// 提取 artmenu 数组
const artmenuMatch = artmenuContent.match(/var artmenu = (\[[\s\S]*?\]);/);
const specialMatch = artmenuContent.match(/var specialartmenu = (\[[\s\S]*?\]);/);

// 用 Function 构造器安全地解析数组字面量
function parseArrayLiteral(str) {
  // 修复缺失的引号、转义等问题
  str = str
    .replace(/,\s*\]/g, ']') // 去除尾随逗号
    .replace(/'/g, '"')      // 单引号转双引号
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ');
  
  // 处理未闭合的字符串（有些 title 里的引号可能混乱）
  // 使用 eval 在受控环境下解析
  try {
    return (new Function('return ' + str))();
  } catch (e) {
    console.error('解析失败:', e.message);
    return [];
  }
}

const artmenu = artmenuMatch ? parseArrayLiteral(artmenuMatch[1]) : [];
const specialartmenu = specialMatch ? parseArrayLiteral(specialMatch[1]) : [];

// 过滤掉 type: "arc" 的归档项，只保留文章
const articlesMeta = artmenu.filter(item => item.type === 'art' || item.links?.includes('articles/'));

console.log(`提取到 ${articlesMeta.length} 篇文章元数据`);

// 2. 解析每篇文章的 HTML，提取正文
function extractArticleBody(filePath) {
  const html = readFileSync(filePath, 'utf-8');
  
  // 提取 title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  // 提取 writer
  const writerMatch = html.match(/id="writer"[^>]*>(.*?)</i);
  const writer = writerMatch ? writerMatch[1].trim() : '';
  
  // 提取 write-time
  const timeMatch = html.match(/id="write-time"[^>]*>(.*?)</i);
  const writeTime = timeMatch ? timeMatch[1].trim() : '';
  
  // 提取 article_id
  const idMatch = html.match(/id="article_id"[^>]*value="(\d+)"/i);
  const articleId = idMatch ? idMatch[1] : '';
  
  // 提取正文：找到 <section class="main"> 开始到 </section> 结束
  // 或者 <div class="article-content"> 的内容
  let bodyHtml = '';
  let hasToc = html.includes('<div class="toc">') || html.includes('<div class="toc"');
  
  const mainMatch = html.match(/<section class="main"[^>]*>([\s\S]*)<\/section>/i);
  if (mainMatch) {
    bodyHtml = mainMatch[1].trim();
  } else {
    // 有些文章可能没有 section.main，尝试直接找 article-content
    const contentMatch = html.match(/<div class="article-content[^"]*"[^>]*>([\s\S]*)<\/div>\s*<\/div>\s*<!--/);
    if (contentMatch) {
      bodyHtml = contentMatch[1].trim();
    }
  }
  
  // 清理 bodyHtml 中的 footer 引用
  bodyHtml = bodyHtml.replace(/<script[^>]*src="\.\.\/js\/comcode\/article-footer\.js"[^>]*><\/script>/gi, '');
  bodyHtml = bodyHtml.replace(/<script[^>]*src="\.\.\/js\/comcode\/footer\.js"[^>]*><\/script>/gi, '');
  
  return { title, writer, writeTime, articleId, hasToc, bodyHtml };
}

const articlesDir = 'articles';
const articleFiles = readdirSync(articlesDir).filter(f => f.endsWith('.html') && /^\d+\.html$/.test(f));

const extractedArticles = [];

for (const file of articleFiles.sort()) {
  const num = parseInt(file.replace('.html', ''), 10);
  const meta = articlesMeta.find(a => a.number === num);
  const body = extractArticleBody(join(articlesDir, file));
  
  extractedArticles.push({
    number: num,
    filename: file,
    ...body,
    meta: meta || null
  });
}

// 写入数据文件
writeFileSync('src/data/articles.json', JSON.stringify({
  articles: extractedArticles,
  meta: articlesMeta,
  special: specialartmenu
}, null, 2));

console.log(`成功提取 ${extractedArticles.length} 篇文章正文到 src/data/articles.json`);

// 同时把正文提取到 src/articles/ 目录，方便模板引用
for (const art of extractedArticles) {
  if (art.bodyHtml) {
    writeFileSync(`src/articles/${art.filename}`, art.bodyHtml);
  }
}
console.log('正文已提取到 src/articles/');
