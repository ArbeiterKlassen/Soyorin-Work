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

    document.write('<link rel="stylesheet" href="../css/global.css">');
    document.write('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    document.write('<link rel="stylesheet" href="../css/d-audio.css">');
    document.write('<link rel="stylesheet" href="../css/article-detail.css">')
    document.write('<link rel="stylesheet" href="../css/code.css">');
    document.write('<link rel="stylesheet" href="../css/github-markdown.css">');
    document.write('<link rel="stylesheet" href="../css/vditor.css">')
    document.write('<link rel="stylesheet" href="../css/loader.css">')
    document.write('<link rel="shortcut icon" href="../img/user.jpeg">');
}
if(mode == 2){
    document.write('<link rel="stylesheet" href="../css/night.global.css">');
    document.write('<link rel="stylesheet" href="../css/pace-theme-flash.css">');
    document.write('<link rel="stylesheet" href="../css/d-audio.css">');
    document.write('<link rel="stylesheet" href="../css/night.article-detail.css">')
    document.write('<link rel="stylesheet" href="../css/code.css">');
    document.write('<link rel="stylesheet" href="../css/night.github-markdown.css">');
    document.write('<link rel="stylesheet" href="../css/vditor.css">')
    document.write('<link rel="stylesheet" href="../css/night.loader.css">')
    document.write('<link rel="shortcut icon" href="../img/user.jpeg">');
}            