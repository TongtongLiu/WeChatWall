var messageNumber;
var reviewingMsgMap = {
    'name': 'userName',
    'content': 'displayContent'
}

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

//导航栏公告切换
var topInfo = setInterval(infoShow, 5000);
var infoNumber = 0;
function infoShow(){
    info = $('#wordList').children();
    $(info[infoNumber]).fadeOut(1000);
    infoNumber = (infoNumber + 1) % 3;
    $(info[infoNumber]).fadeIn(1000);
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

//字符串字节数
function getByteLen(str){
    var l = str.length;
    var n = l;
    for(var i = 0; i < l; i++){
        if(str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255){
            n++;
        }
    }
    return n;
}  

function setFont(message){
    var msg = message['content'];
    var object;
    if(getByteLen(msg) <= 24){
    }
    else if(msg.length <= 36){
        object = $('#'+message['id']).find('.displayContent');
        object.css('font-size',34);
        object.css('line-height','44px');
    }
    else if(getByteLen(msg) <= 92){
        object = $('#'+message['id']).find('.displayContent');
        object.css('font-size',25);
        object.css('line-height','40px');
    }
    else if(getByteLen(msg) <= 154){
        object = $('#'+message['id']).find('.displayContent');
        object.css('font-size',20);
        object.css('line-height','30px');
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
        if (key == 'content') {
            setFont(message);
        }
    }
    $($('.userList')[0]).slideDown(600);
}

function refresh(message){
    deleteElementFromBottom();
    addElementToHead(message);
    messageNumber++;
    $('#msgNum').html(messageNumber);
}

function initial(){
    pageSuit();
    messageNumber = $('.userList').length;
    $('#msgNum').html(messageNumber)
}
window.onload=initial;

function getLastMessage () {
    var lis = $('.userList');
    if (lis.length == 0)
        return ''
    else
        return $(lis[0]).attr('id');
}

function getMsg_success(data) {
    if (data['result'] == 'success') {
        refresh(data['message']);
    } else {
        console.log(data);
    }
}

function postToGetMessage() {
    var lastMessageId = getLastMessage();
    if (lastMessageId == '')
        postData = {}
    else
        postData = {
            message_id: lastMessageId
        }
    $.ajax({
        url: getNewMessageUrl,
        type: "POST",
        data: postData,
        success: getMsg_success,
        error: function (data){
                console.info(data);
            }
    });
}

var timer;
function run() {
    timer = setInterval(postToGetMessage, 3000);
}

function stop() {
    clearInterval(timer);
}

//run()

