
function insertHtml(html) {
  const currentScript = document.currentScript;
  if (currentScript) {
    currentScript.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}
insertHtml('<!--PC导航栏-->')
insertHtml('<nav class="nav-bar-holder">  style="background-color:#40485b">')
insertHtml('    <div class="nav-bar" id="nav-bar">')
// insertHtml('        <div class="logo-box">')
// insertHtml('            <a href="index.html" class="blog-title ta-c"><img style="vertical-align: top;" alt="logo"src="../img/user.jpeg" /></a>')
// insertHtml('        </div>')
insertHtml('        <div class="nb-a-holder" id="home"><a class="nb-a ta-c" href="../templates/inside.index.html">首页[Inside]</a></div>')
insertHtml('        <div class="nb-a-holder"><a class="nb-a ta-c" href="../templates/index.html">表站</a></div>')
insertHtml('    </div>')
insertHtml('</nav>')
insertHtml('<!--mobile导航栏-->')
insertHtml('<nav class="mobile-nav">')
insertHtml('    <img src="../img/inside.headimg.jpg" alt="Head Image" style="text-align: left;width:100%">')
insertHtml('    <div class="logo-box">')
insertHtml('        <a href="index.html" class="blog-title ta-c">')
insertHtml('            <img style="vertical-align: top;" alt="logo"')
insertHtml('                src="../img/user.jpeg" /></a>')
insertHtml('    </div>')
insertHtml('    <a id="mobile_cate"href="javascript:void(0);"><img style="width:35px" src="../img/cate.svg"></a>')
insertHtml('</nav>')
insertHtml('<ul id="nav-m-list">')
insertHtml('    <li id="cancel-li"><a class="fr" id="cancel" href="javascript:void(0);"></a></li>')
insertHtml('    <li id="m-img-li">')
insertHtml('        <img id="m-img" alt="苍茫误此生" src="../img/user.jpeg">')
insertHtml('    </li>')
insertHtml('    <li><a class="w-h-100 fl" href="../templates/inside.index.html">首页[Inside]</a></li>')
insertHtml('    <li><a class="w-h-100 fl" href="../templates/index.html">表站[Outside]</a></li>')
insertHtml('</ul>')