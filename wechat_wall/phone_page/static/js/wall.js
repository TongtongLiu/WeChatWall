/**
 * Created by limeng on 2014/12/24.
 */

var sendBtn = $('.send');

//发送消息
$('.send').click(function() {
    var content = $('#div-content').text();
    sendBtn.attr("disabled","disabled");
    sendBtn.css("color","rgba(235, 244, 235,0.5)");
    $('#div-content').html("");

    $.ajax({
        url: $('#message_form').attr('action'),
        type: "POST",
        data: {
            openid: openid,
            content: content
        },
        success: function(data) {
            switch (data) {
                case "BannedContent":
                    createDialog("prompt", "小主不要乱说话喔o(╯□╰)o");
                    break;

                case "Error":
                    createDialog("warning", "出现了奇怪的错误~~(>_<)~~");
                    break;

                case "Success":
                    //滚动到页面底部
                    $('body').animate({scrollTop: $(document).height()}, 1000);
                    refreshImmediately();
                    break;

                default:
                    break;
            }
        },
        error: function(data) {
            console.info(data);
        }
    });
});

//创建一条信息
function createsMessages(message) {
    var divMessage = $('<div class="message"></div>');
    var divMessageLeft = $('<div class="message-left"></div>');
    var divPhoto = $('<div class="message-photo"><img src="'+message.user_photo+'"/></div>');
    var divMessageRight = $('<div class="message-right"></div>');
    var divMessageName = $('<div class="message-name">'+message.user_name+'</div>');
    var divDialog = $('<div class="dialog"></div>');
    var divTriangle = $('<span class="triangle"></span>');
    var divContent = $('<div class="message-content">'+message.content +'</div>');
    var divId = $('<div class="message-id">'+message.message_id+'</div>');
    var divClear = $('<div style="clear: both"></div>');

    divMessageLeft.append(divPhoto);
    divMessageRight.append(divMessageName);
    divDialog.append(divTriangle);
    divDialog.append(divContent);
    divMessageRight.append(divDialog);
    divMessage.append(divMessageLeft);
    divMessage.append(divMessageRight);
    divMessage.append(divId);
    divMessage.append(divClear);

    return divMessage;
}

//创建一条自身发送的信息
function createsSelfMessages(message) {
    var divMessage = $('<div class="self-message"></div>');
    var divMessageRight = $('<div class="self-message-right"></div>');
    var divPhoto = $('<div class="self-message-photo"><img src="'+message.user_photo+'"/></div>');
    var divMessageLeft = $('<div class="self-message-left"></div>');
    var divMessageName = $('<div class="self-message-name">'+message.user_name+'</div>');
    var divDialog = $('<div class="self-dialog"></div>');
    var divTriangle = $('<span class="self-triangle"></span>');
    var divContent = $('<div class="self-message-content">'+message.content +'</div>');
    var divId = $('<div class="message-id">'+message.message_id+'</div>');
    var divClear = $('<div style="clear: both"></div>');

    divMessageRight.append(divPhoto);
    divMessageLeft.append(divMessageName);
    divDialog.append(divTriangle);
    divDialog.append(divContent);
    divMessageLeft.append(divDialog);
    divMessage.append(divMessageRight);
    divMessage.append(divMessageLeft);
    divMessage.append(divId);
    divMessage.append(divClear);

    return divMessage;
}

//页面遮罩处理
$('.mask, .footer-mask').click(function () {
    $('#menu').click();
});
//打开菜单(加号)按钮处理
$('#menu').click(function () {
    $('body').toggleClass('exposed');
    if (!$('html').hasClass('clickedMenu')) {
        $('html').addClass('clickedMenu');
    }
    var docHeight = $(document).height()-$('.refresh').height();
    var docWidth = $(document).width();
    $('.mask').css({"height":docHeight, "width":docWidth});
});

//菜单项按钮处理
$('.snow').click(function(){
    if($('.snow').hasClass("start")) {
        $('.snow').removeClass("start");
        $.fn.snowStop();
    }
    else {
        $('.snow').addClass("start");
        var addTop = $(window).scrollTop();
        $.fn.snow({minSize: 10, maxSize: 26, interval: 500, color: "#ffffff"},addTop);
    }
    $('#menu').click();
});
$('.bug').click(function(){
    var addTop = $(window).scrollTop();
    keywordRain("<i class='fa fa-bug' style='color:#333'></i>",{},addTop);
    $('#menu').click();
    setTimeout(function(){createDialog("warning","好多BUG Σ( ° △ °|||)︴");},3000);
});

//监听输入框
sendBtn.attr("disabled","disabled");
sendBtn.css("color","rgba(235, 244, 235,0.5)");
$('#div-content').bind('input propertychange', function() {
    var input = $('#div-content').html();
    if(input == "") {
        sendBtn.attr("disabled","disabled");
        sendBtn.css("color","rgba(235, 244, 235,0.5)");
    }
    else {
        sendBtn.removeAttr("disabled");
        sendBtn.css("color","rgba(235, 244, 235,1)");
    }
});

//创建通知框
function createNoticeBar(content){
    var notice = $('<div class="notice"><div class="notice-wrap"><p class="notice-content">'+content+'</p></div><span class="delete">×</span></div>');
    $('.content-wrap').before(notice);
    $('.content-wrap').css("padding-top", "2em");
    $('.notice span.delete').click(function(){
        $('.content-wrap').css("padding-top", "0");
        $('.notice').remove();
    });
    //通知栏滚动
    setTimeout(function(){
        var div = $('.notice-wrap');
        var p = $('.notice-content');
        var width = p.width();
        var dWidth = div.width();
        var speed = 3000;//越大越慢
        var time = width/100*speed;
        function move(t) {
            p.animate({ left: -width }, time, "linear", function () {
                p.css("left", dWidth);
                t=((width+dWidth)/100)*speed;
                move(t);
            });
        }
        move(time);
    }, 3000);
}

//创建提示框
// type:提示框(prompt)、警告框(warning)、消息框(alert)
function createDialog(type, content) {
    var dialog = $('<div />').addClass("info-dialog").html(content);
    dialog.addClass(type);
    $('.wrap').append(dialog);
    dialog.css("margin-left", -(dialog.width())/2);
    dialog.animate({ opacity: 0 }, 3000, "linear", function () {
        dialog.remove();
    });
}

//上拉刷新
//window.loadheight = $('#refresh').height();
//window.hidden = $("#refresh").animate("marginTop", "-" + loadheight + "px");
//window.visible = $("#refresh").animate("marginTop", "0px");
//$("#refresh").css("marginTop", "-" + loadheight + "px");
//$(window).scroll(function () {
//    var st = $(window).scrollTop();
//    if (st < 0) {
//        $("#refresh").animate({
//            "marginTop": "0px"
//        }, 500);
//        $("#refresh").delay(500).animate({
//            "marginTop": "-" + loadheight + "px"
//        }, 500);
//        //刷新响应处理函数
//        getOldMessages();
//    }
//});

// 获取历史消息函数
//function getOldMessages() {
//    var message_id;
//    if ($('#content-container .message-id').length == 0)
//        message_id = 0;
//    else {
//        message_id = parseInt($('#content-container .message-id')[0].innerHTML);
//    }
//
//    $.ajax({
//        url: get_old_messages,
//        type: "GET",
//        data: {
//            message_id: message_id
//        },
//        success: function(data) {
//            var messages = data.messages;
//            for (var i = 0; i < messages.length; i++) {
//                 if (messages[i].user_name == name)
//                    var message = createsSelfMessages(messages[i]);
//                else
//                    var message = createsMessages(messages[i]);
//                message.prependTo('#content-container');
//            }
//        },
//        error: function (data){
//            console.info(data);
//        }
//    });
//}

// 获取最新消息函数
function getNewMessages() {
    var message_id;
    if ($('#content-container .message-id').length == 0)
        message_id = 0;
    else {
        var len = $('#content-container .message-id').length;
        message_id = parseInt($('#content-container .message-id')[len - 1].innerHTML);
    }

    $.ajax({
        url: get_new_messages,
        type: "GET",
        data: {
            message_id: message_id
        },
        success: function(data) {
            var messages = data.messages;
            var docHeight = $(document).height();
            var scrollTop = $('body').scrollTop();
            var winHeight = $(window).height();
            for (var i = messages.length - 1; i >= 0; i--) {
                 if (messages[i].user_name == name) {
                     var message = createsSelfMessages(messages[i]);
                     keywordDetect(messages[i].content);
                 } else
                     var message = createsMessages(messages[i]);
                 message.appendTo('#content-container');
            }
            if (scrollTop >= docHeight - winHeight - 50)
                 $('body').animate({scrollTop: $(document).height()}, 800);
        },
        error: function (data){
            console.info(data);
        }
    });

    refresh();
}

var timeOut;

// 轮询
function refresh() {
    timeOut = setTimeout(getNewMessages, 2000 + Math.random() * 2000);
}

// 立即刷新
function refreshImmediately() {
    clearTimeout(timeOut);
    getNewMessages();
}

// 初始化页面
function initMessage() {
    getNewMessages();
}
initMessage();

//function initMessage() {
//    for (var i = originalMessages.length - 1; i >= 0; i--) {
//         if (originalMessages[i].user_name == name) {
//             var message = createsSelfMessages(originalMessages[i]);
//         } else
//             var message = createsMessages(originalMessages[i]);
//         message.appendTo('#content-container');
//    }
//    $('body').animate({scrollTop: $(document).height()}, 800);
//    refresh();
//}

//initMessage();
