var date = [
    {active:true,name:0,month:1,day:15,title:"今天是：测试代码2023-1-15的生日！（"},
    {active:true,name:1,month:5,day:29,title:"今天是@Soyorin.Work - AKlassen's Blogs的建站日！"},
    // {active:false,name:2,month:5,day:29,title:""},
    // {active:false,name:3,month:5,day:29,title:""},
    // {active:true,name:4,month:8,day:30,title:"今天是@呼和浩特马克思主义学社的生日！"},
    // {active:true,name:5,month:1,day:9,title:"今天是@北桥马克思主义联合社的生日！"},
    // {active:true,name:6,month:5,day:1,title:"今天是@海拉尔第二中学马列社-为公社的生日！"},
    // {active:true,name:7,month:5,day:29,title:""},
]
var myDate = new Date();
var nowyear = myDate.getFullYear();
var nowmonth = myDate.getMonth()+1;
var nowdate = myDate.getDate();
for(var i = 0;i<date.length;i++){
    if(nowmonth == date[i].month && nowdate == date[i].day){
        document.getElementById('celebrates-container').innerHTML += '<div class="article-box">'+'<div class="ab-content">'+'<a href="../templates/about.html?name="'+date[i].name+' class="article-img-box">'+'<img class="lazy-image article-img" data-src="../essays_img/leninism1.jpeg" alt="" src="../essays_img/leninism1.jpeg">'+'</a>'+'<div class="article-title">'+'<a href="../templates/about.html"'+date[i].name+'>'+date[i].title+'</a>'+'</div>'+'<div class="article-detail-box c-666">そうれわ、やばいですね！</div>'+'<span class="article-tail-box"><span class="article-date c-999">'+nowyear+"-"+nowmonth+"-"+nowdate+'</span>'+'<span class="article-author one-line-overflow c-999">望关Bot</span>'+'</span>'+'</div>'+'</div>'
    }
}