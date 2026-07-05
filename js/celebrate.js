var celebrateDate = [
    {active:true,month:1,day:15,title:"今天是：测试代码2023-1-15的生日！（"},
    {active:true,month:5,day:29,title:"今天是@Soyorin.Work - AKlassen's Blogs的建站日！"},
]
var now = new Date();
var nowyear = now.getFullYear();
var nowmonth = now.getMonth()+1;
var nowdate = now.getDate();
var container = document.getElementById('celebrates-container');
if (container) {
    for (var i = 0; i < celebrateDate.length; i++) {
        if (nowmonth == celebrateDate[i].month && nowdate == celebrateDate[i].day) {
            container.innerHTML += '<div class="article-box"><div class="ab-content">'
                + '<a href="../templates/about.html" class="article-img-box">'
                + '<img class="lazy-image article-img" data-src="../essays_img/leninism1.jpeg" alt="" src="../essays_img/leninism1.jpeg">'
                + '</a>'
                + '<div class="article-title"><a href="../templates/about.html">' + celebrateDate[i].title + '</a></div>'
                + '<div class="article-detail-box c-666">そうれわ、やばいですね！</div>'
                + '<span class="article-tail-box"><span class="article-date c-999">' + nowyear + "-" + nowmonth + "-" + nowdate + '</span>'
                + '<span class="article-author one-line-overflow c-999">Soyorin Bot</span></span>'
                + '</div></div>';
        }
    }
}