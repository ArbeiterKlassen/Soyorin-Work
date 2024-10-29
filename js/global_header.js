
//https://i.328888.xyz/2023/04/16/iE7pEF
function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
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

document.write('<!-- 悬挂的喵 -->')
document.write('<script type="text/javascript" src="../js/hangingcat/hangingcat.js" defer=""></script>')
document.write('<link rel="stylesheet" type="text/css" href="../css/hangingcat/hangingcat.css">')
document.write('<div class="back-to-top cd-top faa-float animated cd-is-visible" style="top: -300px;z-index: 999;"></div>')

if(mode==1){
    document.write('<!--PC导航栏-->')
    document.write('<nav class="nav-bar-holder" style="background-color:#63636320">')
    document.write('    <!--<img src="https://i.postimg.cc/RFyJLX7P/headimg.jpg" alt="Head Image" style="text-align: left;width:auto">-->')
    document.write('    <div class="nav-bar" id="nav-bar">')
    document.write('        <div class="logo-box">')
    document.write('            <a href="index.html" class="blog-title ta-c"><img style="vertical-align: top;height:32px" alt="logo"src="https://img.soyorin.work/user.jpeg" /></a>')
    document.write('        </div>')
    document.write('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/index.html">首页</a></div>')
    document.write('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/about.html">关于</a></div>')
    document.write('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/web.sign.html">公告</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/category.html">文章分类</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/archive.html">文件归档</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/issue.html">讨论</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../index.html">导航页</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/link.html">友情链接</a></div>')
    document.write('    </div><br>')
    document.write('</nav>')
    document.write('<!--mobile导航栏-->')
    document.write('<nav class="mobile-nav">')
    document.write('    <div class="logo-box">')
    document.write('        <a href="index.html" class="blog-title ta-c">')
    document.write('        </a>')
    document.write('    </div>')
    document.write('    <a id="mobile_cate" alt="null" href="javascript:void(0);"><div style="padding:1px 1px 1px 1px;background-color:white;border-radius:25px"><img style="width:35px" alt="moblie-nav" src="../img/cate.svg" color:white></div></a>')
    document.write('</nav>')
    document.write('<ul id="nav-m-list">')
    document.write('    <li id="cancel-li"><a class="fr" id="cancel" href="javascript:void(0);"></a></li>')
    document.write('    <li id="m-img-li">')
    document.write('        <img id="m-img" alt="雄关漫道真如铁，而今迈步从头越" src="../img/user.jpeg">')
    document.write('    </li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/index.html">首页</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/about.html">关于</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/web.sign.html.html">公告板</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/category.html">文章分类</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/archive.html">文件归档</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/issue.html">讨论</a></div>')
    document.write('    <li><a class="w-h-100 fl" href="../index.html">导航页</a></div>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/link.html">友情链接</a></li>')
    document.write('</ul>')
    document.write('<div class="loader" style="width: 100vw;height:100vh;position: absolute;z-index: 10000;position:fixed" id="loader-cover">')
    document.write('<div class="wrapper">')
    document.write('    <div class="catContainer">')
    document.write('        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 733 673" class="catbody">')
    document.write('            <path fill="#ffffff" d="M111.002 139.5C270.502 -24.5001 471.503 2.4997 621.002 139.5C770.501 276.5 768.504 627.5 621.002 649.5C473.5 671.5 246 687.5 111.002 649.5C-23.9964 611.5 -48.4982 303.5 111.002 139.5Z"></path>')
    document.write('            <path fill="#ffffff" d="M184 9L270.603 159H97.3975L184 9Z"></path>')
    document.write('            <path fill="#ffffff" d="M541 0L627.603 150H454.397L541 0Z"></path>')
    document.write('        </svg>')
    document.write('        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 158 564" class="tail">')
    document.write('            <path fill="#d7d7d7" d="M5.97602 76.066C-11.1099 41.6747 12.9018 0 51.3036 0V0C71.5336 0 89.8636 12.2558 97.2565 31.0866C173.697 225.792 180.478 345.852 97.0691 536.666C89.7636 553.378 73.0672 564 54.8273 564V564C16.9427 564 -5.4224 521.149 13.0712 488.085C90.2225 350.15 87.9612 241.089 5.97602 76.066Z"></path>')
    document.write('        </svg>')
    document.write('        <div class="text">')
    document.write('            <span class="bigzzz">Z</span>')
    document.write('            <span class="zzz">Z</span>')
    document.write('        </div>')
    document.write('    </div>')
    document.write('    <div class="wallContainer">')
    document.write('        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 126" class="wall">')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="3" x2="450" y1="3" x1="50"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="85" x2="400" y1="85" x1="100"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="122" x2="375" y1="122" x1="125"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="500" y1="43"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="1.99391" x2="115.5" y1="43.0061" x1="115.5"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.00002" x2="189" y1="43.0122" x1="189"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.00612" x2="262.5" y1="43.0183" x1="262.5"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.01222" x2="336" y1="43.0244" x1="336"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.01833" x2="409.5" y1="43.0305" x1="409.5"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="153" y1="84.0122" x1="153"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="228" y1="84.0122" x1="228"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="303" y1="84.0122" x1="303"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="378" y1="84.0122" x1="378"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="84" x2="192" y1="125.012" x1="192"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="84" x2="267" y1="125.012" x1="267"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="84" x2="342" y1="125.012" x1="342"></line>')
    document.write('        </svg>')
    document.write('    </div>')
    document.write('</div>')
    document.write('</div>')
}
if(mode==2){
    document.write('<nav class="nav-bar-holder" style="background-color:#63636320">')
    document.write('    <!--<img src="https://i.postimg.cc/RFyJLX7P/headimg.jpg" alt="Head Image" style="text-align: left;width:auto">-->')
    document.write('    <div class="nav-bar" id="nav-bar">')
    document.write('        <div class="logo-box">')
    document.write('            <a href="index.html" class="blog-title ta-c"><img style="vertical-align: top;height:32px" alt="logo"src="https://img.soyorin.work/user.jpeg" /></a>')
    document.write('        </div>')
    document.write('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/index.html">首页</a></div>')
    document.write('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/about.html">关于</a></div>')
    document.write('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/web.sign.html">公告</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/category.html">文章分类</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/archive.html">文件归档</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/issue.html">讨论</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../index.html">导航页</a></div>')
    document.write('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/link.html">友情链接</a></div>')
    document.write('    </div><br>')
    document.write('</nav>')
    document.write('<!--mobile导航栏-->')
    document.write('<nav class="mobile-nav">')
    document.write('    <div class="logo-box">')
    document.write('        <a href="index.html" class="blog-title ta-c">')
    document.write('        </a>')
    document.write('    </div>')
    document.write('    <a id="mobile_cate" alt="null" href="javascript:void(0);"><div style="padding:1px 1px 1px 1px;background-color:white;border-radius:25px"><img style="width:35px" alt="moblie-nav" src="../img/cate.svg" color:white></div></a>')
    document.write('</nav>')
    document.write('<ul id="nav-m-list">')
    document.write('    <li id="cancel-li"><a class="fr" id="cancel" href="javascript:void(0);"></a></li>')
    document.write('    <li id="m-img-li">')
    document.write('        <img id="m-img" alt="雄关漫道真如铁，而今迈步从头越" src="../img/user.jpeg">')
    document.write('    </li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/index.html">首页</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/about.html">关于</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/web.sign.html.html">公告板</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/category.html">文章分类</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/archive.html">文件归档</a></li>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/issue.html">讨论</a></div>')
    document.write('    <li><a class="w-h-100 fl" href="../index.html">导航页</a></div>')
    document.write('    <li><a class="w-h-100 fl" href="../templates/link.html">友情链接</a></li>')
    document.write('</ul>')
    document.write('<div class="loader" style="width: 100vw;height:100vh;position: absolute;z-index: 10000;position:fixed" id="loader-cover">')
    document.write('<div class="wrapper">')
    document.write('    <div class="catContainer">')
    document.write('        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 733 673" class="catbody">')
    document.write('            <path fill="#212121" d="M111.002 139.5C270.502 -24.5001 471.503 2.4997 621.002 139.5C770.501 276.5 768.504 627.5 621.002 649.5C473.5 671.5 246 687.5 111.002 649.5C-23.9964 611.5 -48.4982 303.5 111.002 139.5Z"></path>')
    document.write('            <path fill="#212121" d="M184 9L270.603 159H97.3975L184 9Z"></path>')
    document.write('            <path fill="#212121" d="M541 0L627.603 150H454.397L541 0Z"></path>')
    document.write('        </svg>')
    document.write('        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 158 564" class="tail">')
    document.write('            <path fill="#191919" d="M5.97602 76.066C-11.1099 41.6747 12.9018 0 51.3036 0V0C71.5336 0 89.8636 12.2558 97.2565 31.0866C173.697 225.792 180.478 345.852 97.0691 536.666C89.7636 553.378 73.0672 564 54.8273 564V564C16.9427 564 -5.4224 521.149 13.0712 488.085C90.2225 350.15 87.9612 241.089 5.97602 76.066Z"></path>')
    document.write('        </svg>')
    document.write('        <div class="text">')
    document.write('            <span class="bigzzz">Z</span>')
    document.write('            <span class="zzz">Z</span>')
    document.write('        </div>')
    document.write('    </div>')
    document.write('    <div class="wallContainer">')
    document.write('        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 126" class="wall">')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="3" x2="450" y1="3" x1="50"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="85" x2="400" y1="85" x1="100"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="122" x2="375" y1="122" x1="125"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="500" y1="43"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="1.99391" x2="115.5" y1="43.0061" x1="115.5"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.00002" x2="189" y1="43.0122" x1="189"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.00612" x2="262.5" y1="43.0183" x1="262.5"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.01222" x2="336" y1="43.0244" x1="336"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="2.01833" x2="409.5" y1="43.0305" x1="409.5"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="153" y1="84.0122" x1="153"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="228" y1="84.0122" x1="228"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="303" y1="84.0122" x1="303"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="43" x2="378" y1="84.0122" x1="378"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="84" x2="192" y1="125.012" x1="192"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="84" x2="267" y1="125.012" x1="267"></line>')
    document.write('            <line stroke-width="6" stroke="#7C7C7C" y2="84" x2="342" y1="125.012" x1="342"></line>')
    document.write('        </svg>')
    document.write('    </div>')
    document.write('</div>')
    document.write('</div>')
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
window.onload = function(){
    sleep(3000);
    document.getElementById("loader-cover").style.opacity = 0;
    sleep(2000).then(()=>{document.getElementById("loader-cover").style.zIndex = -9999;});
}