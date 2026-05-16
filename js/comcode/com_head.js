
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
    insertHtml('<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">');
    insertHtml('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
    insertHtml('<meta name="HandheldFriendly" content="true">');
    insertHtml('<meta charset="UTF-8">');
    insertHtml('<meta name="keywords" content="">');
    insertHtml('<meta name="description" content="">');
    insertHtml('<link rel="stylesheet" href="../css/global.css">');
    insertHtml('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    insertHtml('<link rel="stylesheet" href="../css/d-audio.css">');
    insertHtml('<link rel="stylesheet" href="../css/myPagination.css">');
    insertHtml('<link rel="stylesheet" href="../css/sign.css">');
    insertHtml('<link rel="stylesheet" href="../css/index.css">');
    insertHtml('<link rel="stylesheet" href="../css/archive.css">');
    insertHtml('<link rel="stylesheet" href="../css/link.css">');
    insertHtml('<link rel="stylesheet" href="../css/about.css">');
    insertHtml('<link rel="stylesheet" href="../css/font.css">');
    insertHtml('<link rel="stylesheet" href="../css/loader.css">')
    insertHtml('<link rel="stylesheet" href="../css/manifest.css">')
    insertHtml('<link rel="shortcut icon" href="../headpage/icon.png">');
}
if(mode == 2){
    insertHtml('<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">');
    insertHtml('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
    insertHtml('<meta name="HandheldFriendly" content="true">');
    insertHtml('<meta charset="UTF-8">');
    insertHtml('<meta name="keywords" content="">');
    insertHtml('<meta name="description" content="">');
    insertHtml('<meta name="author" content="">');
    insertHtml('<link rel="stylesheet" href="../css/night.global.css">');
    insertHtml('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    insertHtml('<link rel="stylesheet" href="../css/d-audio.css">');
    insertHtml('<link rel="stylesheet" href="../css/myPagination.css">');
    insertHtml('<link rel="stylesheet" href="../css/sign.css">');
    insertHtml('<link rel="stylesheet" href="../css/night.index.css">');
    insertHtml('<link rel="stylesheet" href="../css/night.archive.css">');
    insertHtml('<link rel="stylesheet" href="../css/night.link.css">');
    insertHtml('<link rel="stylesheet" href="../css/night.about.css">');
    insertHtml('<link rel="stylesheet" href="../css/font.css">');
    insertHtml('<link rel="stylesheet" href="../css/night.loader.css">')
    insertHtml('<link rel="stylesheet" href="../css/night.manifest.css">')
    insertHtml('<link rel="shortcut icon" href="../headpage/icon.png">');
}
