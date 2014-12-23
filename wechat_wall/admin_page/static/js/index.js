function pageSuit(){
    var windowHeight = $(window).height();//浏览器高度
    a = $('#qrScroll');
    b = $('#qrImg');
    topimg=0.5*a.height()-0.5*b.height();
    b.css("margin-top",topimg);
}
window.onload=pageSuit;

setInterval(show, 5000);
var infoNumber = 0;
function show(){
    a = $('#wordList').children();
    $(a[infoNumber]).fadeOut(1000);
    infoNumber = (infoNumber + 1) % 3;
    $(a[infoNumber]).fadeIn(1000);
}