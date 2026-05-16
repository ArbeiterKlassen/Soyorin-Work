
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
        return unescape(r[2]);
    }
    return null;
};
var mode = 1;
if(localStorage.getItem("soyorin-mode") != null){mode = parseInt(localStorage.getItem("soyorin-mode"))};
if(mode == 1){

    insertHtml('<link rel="stylesheet" href="../css/global.css">');
    insertHtml('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    insertHtml('<link rel="stylesheet" href="../css/d-audio.css">');
    insertHtml('<link rel="stylesheet" href="../css/article-detail.css">')
    insertHtml('<link rel="stylesheet" href="../css/code.css">');
    insertHtml('<link rel="stylesheet" href="../css/github-markdown.css">');
    insertHtml('<link rel="stylesheet" href="../css/vditor.css">')
    insertHtml('<link rel="stylesheet" href="../css/loader.css">')
    insertHtml('<link rel="shortcut icon" href="../img/user.jpeg">');
}
if(mode == 2){
    insertHtml('<link rel="stylesheet" href="../css/night.global.css">');
    insertHtml('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    insertHtml('<link rel="stylesheet" href="../css/d-audio.css">');
    insertHtml('<link rel="stylesheet" href="../css/night.article-detail.css">')
    insertHtml('<link rel="stylesheet" href="../css/code.css">');
    insertHtml('<link rel="stylesheet" href="../css/night.github-markdown.css">');
    insertHtml('<link rel="stylesheet" href="../css/vditor.css">')
    insertHtml('<link rel="stylesheet" href="../css/night.loader.css">')
    insertHtml('<link rel="shortcut icon" href="../img/user.jpeg">');
}            