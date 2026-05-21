
function insertHtml(html) {
  const currentScript = document.currentScript;
  if (currentScript) {
    currentScript.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}

function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
};
var mode = 1;
if(localStorage.getItem("soyorin-mode") != null){mode = parseInt(localStorage.getItem("soyorin-mode"))};

function pagereload(colormode){
    localStorage.setItem('soyorin-mode',colormode);
    window.location.reload();
}
function hasadmission(){
    if(localStorage.getItem('soyorin-admission') == null){
        return false;
    }else{
        return true;
    }
}

insertHtml('<!-- 悬挂的喵 -->')
insertHtml('<script type="text/javascript" src="../js/hangingcat/hangingcat.js" defer=""></script>')
insertHtml('<link rel="stylesheet" type="text/css" href="../css/hangingcat/hangingcat.css">')
insertHtml('<div class="back-to-top cd-top faa-float animated cd-is-visible" style="top: -300px;z-index: 999;"></div>')

if(mode==1){
    insertHtml('<!--PC导航栏-->')
    insertHtml('<nav class="nav-bar-holder">')
    insertHtml('    <!--<img src="https://i.postimg.cc/RFyJLX7P/headimg.jpg" alt="Head Image" style="text-align: left;width:auto">-->')
    insertHtml('    <div class="nav-bar" id="nav-bar">')
    insertHtml('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/index.html">首页</a></div>')
    insertHtml('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/about.html">关于</a></div>')
    insertHtml('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/web.sign.html">公告</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/category.html">文章分类</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/archive.html">归档</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/manifest.html">清单</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/issue.html">讨论</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/link.html">友情链接</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../index.html">导航页</a></div>')
    insertHtml('    </div><br>')
    insertHtml('</nav>')
    insertHtml('<!--mobile导航栏-->')
    insertHtml('<nav class="mobile-nav">')
    insertHtml('    <a id="mobile_cate" alt="null" href="javascript:void(0);"><div style="padding:1px 1px 1px 1px;background-color:white;border-radius:25px"><img style="width:35px" alt="moblie-nav" src="../img/cate.svg" color:white></div></a>')
    insertHtml('</nav>')
    insertHtml('<ul id="nav-m-list">')
    insertHtml('    <li id="cancel-li"><a class="fr" id="cancel" href="javascript:void(0);"></a></li>')
    insertHtml('    <li id="m-img-li">')
    insertHtml('        <img id="m-img" alt="雄关漫道真如铁，而今迈步从头越" src="../img/user.jpeg">')
    insertHtml('    </li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/index.html">首页</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/about.html">关于</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/web.sign.html">公告板</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/category.html">文章分类</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/archive.html">归档</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/manifest.html">清单</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/issue.html">讨论</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/link.html">友情链接</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../index.html">导航页</a></li>')
    insertHtml('</ul>')
}
if(mode==2){
    insertHtml('<nav class="nav-bar-holder">')
    insertHtml('    <!--<img src="https://i.postimg.cc/RFyJLX7P/headimg.jpg" alt="Head Image" style="text-align: left;width:auto">-->')
    insertHtml('    <div class="nav-bar" id="nav-bar">')
    insertHtml('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/index.html">首页</a></div>')
    insertHtml('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/about.html">关于</a></div>')
    insertHtml('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/web.sign.html">公告</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/category.html">文章分类</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/archive.html">归档</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/manifest.html">清单</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/issue.html">讨论</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/link.html">友情链接</a></div>')
    insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../index.html">导航页</a></div>')
    insertHtml('    </div><br>')
    insertHtml('</nav>')
    insertHtml('<!--mobile导航栏-->')
    insertHtml('<nav class="mobile-nav">')
    insertHtml('    <a id="mobile_cate" alt="null" href="javascript:void(0);"><div style="padding:1px 1px 1px 1px;background-color:white;border-radius:25px"><img style="width:35px" alt="moblie-nav" src="../img/cate.svg" color:white></div></a>')
    insertHtml('</nav>')
    insertHtml('<ul id="nav-m-list">')
    insertHtml('    <li id="cancel-li"><a class="fr" id="cancel" href="javascript:void(0);"></a></li>')
    insertHtml('    <li id="m-img-li">')
    insertHtml('        <img id="m-img" alt="雄关漫道真如铁，而今迈步从头越" src="../img/user.jpeg">')
    insertHtml('    </li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/index.html">首页</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/about.html">关于</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/web.sign.html">公告板</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/category.html">文章分类</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/archive.html">归档</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/manifest.html">清单</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/issue.html">讨论</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../templates/link.html">友情链接</a></li>')
    insertHtml('    <li><a class="w-h-100 fl" href="../index.html">导航页</a></li>')
    insertHtml('</ul>')
}
