
function insertHtml(html) {
  const currentScript = document.currentScript;
  if (currentScript) {
    currentScript.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}

var lastsignHtml = '<div class="sign-container">' +
    '<ul class="column_box" id="like-box">' +
        '<li class="column-title">' +
            '<span class="at-sort b-b-ece fl"><a class="at-sort-comment-a c-666 fl" style="font-size:x-large;font-family: Georgia, Times New Roman, Times, serif;">Lastest</a></span>' +
        '</li>' +
        '<li class="person-intro-detail gradient-text">' +
            '<h2>2024-10-28</h2>' +
        '</li>' +
        '<li class="person-intro-detail">' +
            '<h3>大更！<br></h3>' +
            '<h3>通知：本站当前域名为：https://soyorin.work!!!! 原域名已停用！<br></h3>' +
            '<h3>当前已经移除有关社团的全部内容<br></h3>' +
            '<h3>当前已经移除涉及我国敏感字眼的全部文章<br></h3>' +
            '<h3>开发进度：<br></h3>' +
            '<h3>1. 完全重新设计了新的网页逻辑和美工，添加了新的评论功能，主题颜色更换为蓝色/白色 <br></h3>' +
            "<h3>2. 本站已经更名为Soyorin.Work - AKlassen's Blogs<br></h3>" +
            '<h3>3. 替换了全部背景图片<br></h3>' +
            '<h3>4. 网站首页修改了10个分类板块，下设不同作者/题材的分类导航版<br></h3>' +
            '<h3>5. 修改了文章分类页的样式，改善了文创搜索系统<br></h3>' +
            '<h3>6. 添加复制提醒和应用新的著作权协议：(CC)-BY-NC-SA<br></h3>' +
            '<h3>7. 更新了关于，添加了一部分引用链接<br></h3>' +
            '<h3>8. 更新了Cloudflare图床和MongoDB作为图床和储存区，避免图片和评论崩掉了。<br></h3>' +
            '<h3>9. 未来本站内容将更加侧重于日常生活学习吐槽和分享读书的内容，不再涉及敏感话题，敬请理解。<br></h3>' +
            '<h3>10. 预备增添歌单和游戏两个子栏目，敬请期待！o(*￣▽￣*)ブ<br></h3>' +
        '</li>' +
    '</ul>' +
'</div>';

insertHtml(lastsignHtml);
