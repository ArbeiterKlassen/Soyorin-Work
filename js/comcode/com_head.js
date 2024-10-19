function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};
var mode = 1;
if(localStorage.getItem("wgsoc-mode") != null){mode = parseInt(localStorage.getItem("wgsoc-mode"))};
if(mode == 1){
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">');
    document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
    document.write('<meta name="HandheldFriendly" content="true">');
    document.write('<meta charset="UTF-8">');
    document.write('<meta name="keywords" content="">');
    document.write('<meta name="description" content="">');
    document.write('<link rel="stylesheet" href="../css/global.css">');
    document.write('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    document.write('<link rel="stylesheet" href="../css/d-audio.css">');
    document.write('<link rel="stylesheet" href="../css/myPagination.css">');
    document.write('<link rel="stylesheet" href="../css/sign.css">');
    document.write('<link rel="stylesheet" href="../css/index.css">');
    document.write('<link rel="stylesheet" href="../css/archive.css">');
    document.write('<link rel="stylesheet" href="../css/link.css">');
    document.write('<link rel="stylesheet" href="../css/about.css">');
    document.write('<link rel="stylesheet" href="../css/font.css">');
    document.write('<link rel="shortcut icon" href="../headpage/icon.png">');
}
if(mode == 2){
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">');
    document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
    document.write('<meta name="HandheldFriendly" content="true">');
    document.write('<meta charset="UTF-8">');
    document.write('<meta name="keywords" content="">');
    document.write('<meta name="description" content="">');
    document.write('<meta name="author" content="">');
    document.write('<link rel="stylesheet" href="../css/night.global.css">');
    document.write('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    document.write('<link rel="stylesheet" href="../css/d-audio.css">');
    document.write('<link rel="stylesheet" href="../css/myPagination.css">');
    document.write('<link rel="stylesheet" href="../css/sign.css">');
    document.write('<link rel="stylesheet" href="../css/night.index.css">');
    document.write('<link rel="stylesheet" href="../css/night.archive.css">');
    document.write('<link rel="stylesheet" href="../css/night.link.css">');
    document.write('<link rel="stylesheet" href="../css/night.about.css">');
    document.write('<link rel="stylesheet" href="../css/font.css">');
    document.write('<link rel="shortcut icon" href="../headpage/icon.png">');
}
