import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const templatesDir = join(root, 'templates');
const pages = ['index.html', 'archive.html', 'category.html', 'categories.html', 'about.html', 'link.html', 'manifest.html', 'issue.html', 'web.sign.html'];

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

const commonNav = `<!-- 悬挂的喵 -->
<script type="text/javascript" src="../js/hangingcat/hangingcat.js" defer></script>
<link rel="stylesheet" type="text/css" href="../css/hangingcat/hangingcat.css">
<div class="back-to-top cd-top faa-float animated cd-is-visible" style="top: -300px; z-index: 999;"></div>
<nav class="nav-bar-holder">
  <div class="nav-bar" id="nav-bar">
    <div class="logo-box"><a href="index.html" class="blog-title ta-c"><img style="vertical-align: top; height:32px" alt="logo" src="https://img.soyorin.work/user.jpeg" /></a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/index.html">首页</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/about.html">关于</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/web.sign.html">公告</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/category.html">文章分类</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/archive.html">归档</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/manifest.html">清单</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/issue.html">讨论</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/link.html">友情链接</a></div>
    <div class="nb-a-holder"><a class="nb-a ta-c" href="../index.html">导航页</a></div>
  </div>
</nav>
<nav class="mobile-nav">
  <div class="logo-box"><a href="index.html" class="blog-title ta-c"></a></div>
  <a id="mobile_cate" href="javascript:void(0);"><div style="padding:1px; background-color:white; border-radius:25px"><img style="width:35px" alt="mobile-nav" src="../img/cate.svg"></div></a>
</nav>
<ul id="nav-m-list">
  <li id="cancel-li"><a class="fr" id="cancel" href="javascript:void(0);"></a></li>
  <li id="m-img-li"><img id="m-img" alt="头像" src="../img/user.jpeg"></li>
  <li><a class="w-h-100 fl" href="../templates/index.html">首页</a></li>
  <li><a class="w-h-100 fl" href="../templates/about.html">关于</a></li>
  <li><a class="w-h-100 fl" href="../templates/web.sign.html">公告</a></li>
  <li><a class="w-h-100 fl" href="../templates/category.html">文章分类</a></li>
  <li><a class="w-h-100 fl" href="../templates/archive.html">归档</a></li>
  <li><a class="w-h-100 fl" href="../templates/manifest.html">清单</a></li>
  <li><a class="w-h-100 fl" href="../templates/issue.html">讨论</a></li>
  <li><a class="w-h-100 fl" href="../templates/link.html">友情链接</a></li>
  <li><a class="w-h-100 fl" href="../index.html">导航页</a></li>
</ul>
<div class="loader" style="width: 100vw; height:100vh; position: fixed; z-index: 10000;" id="loader-cover">
  <div class="wrapper">
    <div class="catContainer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 733 673" class="catbody">
        <path class="loader-cat-fill" d="M111.002 139.5C270.502 -24.5001 471.503 2.4997 621.002 139.5C770.501 276.5 768.504 627.5 621.002 649.5C473.5 671.5 246 687.5 111.002 649.5C-23.9964 611.5 -48.4982 303.5 111.002 139.5Z"></path>
        <path class="loader-cat-fill" d="M184 9L270.603 159H97.3975L184 9Z"></path>
        <path class="loader-cat-fill" d="M541 0L627.603 150H454.397L541 0Z"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 158 564" class="tail">
        <path class="loader-tail-fill" d="M5.97602 76.066C-11.1099 41.6747 12.9018 0 51.3036 0V0C71.5336 0 89.8636 12.2558 97.2565 31.0866C173.697 225.792 180.478 345.852 97.0691 536.666C89.7636 553.378 73.0672 564 54.8273 564V564C16.9427 564 -5.4224 521.149 13.0712 488.085C90.2225 350.15 87.9612 241.089 5.97602 76.066Z"></path>
      </svg>
      <div class="text"><span class="bigzzz">Z</span><span class="zzz">Z</span></div>
    </div>
    <div class="wallContainer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 126" class="wall">
        <line stroke-width="6" stroke="#7C7C7C" y2="3" x2="450" y1="3" x1="50"></line>
        <line stroke-width="6" stroke="#7C7C7C" y2="85" x2="400" y1="85" x1="100"></line>
        <line stroke-width="6" stroke="#7C7C7C" y2="122" x2="375" y1="122" x1="125"></line>
        <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="500" y1="43"></line>
      </svg>
    </div>
  </div>
</div>
<div id="d-audio" class="d-audio" style="width: 150px; z-index: 99; position: fixed; bottom: 5px; left: 5px;"></div>`;

const commonFooter = `<footer class="footer">
  <div class="footer-line">Powered By <a href="https://github.com/arbeiterklassen/Soyorin-Work" target="_blank">Soyorin.Work - AKlassen's Blogs</a> © 2021 - <span class="year"></span></div>
</footer>
<script src="../js/jquery-3.4.1.min.js"></script>
<script src="../js/sweetalert.min.js"></script>
<script src="../js/pace.min.js"></script>
<script src="../js/base.js"></script>
<script src="../js/d-audio.js"></script>
<script src="../js/myPagination.js"></script>
<script src="https://cdn.staticfile.org/layer/3.1.1/layer.js"></script>
<script src="../js/main.js"></script>`;

for (const page of pages) {
  const p = join(templatesDir, page);
  if (!existsSync(p)) continue;
  
  let html = readFileSync(p, 'utf-8');
  
  // 替换 com_head.js / com_arthead.js 为静态 head
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/com_head\.js"[^>]*><\/script>/gi, commonHead);
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/com_arthead\.js"[^>]*><\/script>/gi, commonHead);
  
  // 替换 global_header.js 为静态 nav
  html = html.replace(/<script[^>]*src="\.\.\/js\/global_header\.js"[^>]*><\/script>/gi, commonNav);
  
  // 替换 inside.global_header.js（如果存在）
  html = html.replace(/<script[^>]*src="\.\.\/js\/inside\.global_header\.js"[^>]*><\/script>/gi, commonNav);
  
  // 替换 footer.js / article-footer.js 为静态 footer
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/footer\.js"[^>]*><\/script>/gi, commonFooter);
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/article-footer\.js"[^>]*><\/script>/gi, commonFooter);
  
  // 清理 IE 条件注释
  html = html.replace(/<!--\[if lt IE 9\]>.*?<!\[endif\]-->/gs, '');
  html = html.replace(/<meta http-equiv="X-UA-Compatible"[^>]*>/gi, '');
  
  // 替换 unescape
  html = html.replace(/unescape\(/g, 'decodeURIComponent(');
  
  writeFileSync(p, html);
  console.log(`Refactored: templates/${page}`);
}

// 同样处理 inner/ 目录
const innerPages = ['index.html', 'admission.html', 'back.html'];
for (const page of innerPages) {
  const p = join(root, 'inner', page);
  if (!existsSync(p)) continue;
  
  let html = readFileSync(p, 'utf-8');
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/com_head\.js"[^>]*><\/script>/gi, '');
  html = html.replace(/<script[^>]*src="\.\.\/js\/global_header\.js"[^>]*><\/script>/gi, commonNav.replace(/\.\.\//g, '../'));
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/footer\.js"[^>]*><\/script>/gi, commonFooter.replace(/\.\.\//g, '../'));
  html = html.replace(/<script[^>]*src="\.\.\/js\/comcode\/article-footer\.js"[^>]*><\/script>/gi, commonFooter.replace(/\.\.\//g, '../'));
  html = html.replace(/<!--\[if lt IE 9\]>.*?<!\[endif\]-->/gs, '');
  html = html.replace(/<meta http-equiv="X-UA-Compatible"[^>]*>/gi, '');
  html = html.replace(/unescape\(/g, 'decodeURIComponent(');
  writeFileSync(p, html);
  console.log(`Refactored: inner/${page}`);
}

console.log('Template refactoring complete.');
