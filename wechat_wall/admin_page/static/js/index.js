var messageNumber;

function pageSuit(){
    var windowHeight = $(window).height();//浏览器高度
    a = $('body');
    b = $('#wholePage');
    topDialog=0.5*a.height()-0.5*b.height();
    b.css("margin-top",topDialog);
    a = $('#qrScroll');
    b = $('#qrImg');
    topimg=0.5*a.height()-0.5*b.height();
    b.css("margin-top",topimg);
    a = $('#scrollBox');
    b = $('#wordList');
    topWord=0.5*a.height()-0.5*b.height();
    b.css("margin-top",topWord);
    a = $('#numberBox');
    b = $('#numberList');
    topNum=0.5*a.height()-0.5*b.height();
    b.css("margin-top",topNum);
}
function initial(){
    pageSuit();
    messageNumber = $('.userList').length;
    $('#msgNum').html(messageNumber)
}
window.onload=initial;

//导航栏公告切换
var topInfo = setInterval(infoShow, 5000);
var infoNumber = 0;
function infoShow(){
    a = $('#wordList').children();
    $(a[infoNumber]).fadeOut(1000);
    infoNumber = (infoNumber + 1) % 3;
    $(a[infoNumber]).fadeIn(1000);
}

var reviewingMsgMap = {
    'name': 'userName',
    'content': 'displayContent'
}

//用于寻找某个object下某个class的对象
function getElementByClass(object, className) {
    return $(object).find('.'+className);
}

//创建一个userList，返回它的jquery对象
function createElementTemplate(object){
    var template = "<li class='clearfix userList' style='display:none;'>\n<div class='userPhoto left'><img class='photo right'></div>\n<div class='contentBox left'>\n<p class='c-word'>\n<a class='userName'></a>\n<span class='displayContent'></span>\n</p>\n</div>\n</li>";
    $(object).prepend(template);
}

function deleteElementFromBottom(){
    var list = $('.userList');
    if(list.length == 3){
        object = list[2];
        $(object).slideUp(600);
        setTimeout(function(){
            $(object).remove();    
        }, 600);
    }
    
}

//用于添加某一个userList
function addElementToHead(message){
    var ul = $('#userBox');
    createElementTemplate(ul);
    var object = $('.userList')[0];
    var key;
    getElementByClass(object,'photo').attr('src',message['avatar']);
    $(object).attr('id',message['id']);
    for(key in reviewingMsgMap){
        getElementByClass(object,reviewingMsgMap[key]).html(message[key]);
    }
    $($('.userList')[0]).slideDown(600);
}

function refresh(message){
    deleteElementFromBottom();
    addElementToHead(message);
    messageNumber++;
    $('#msgNum').html(messageNumber);
}




