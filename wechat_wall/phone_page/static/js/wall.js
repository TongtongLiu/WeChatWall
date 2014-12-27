/**
 * Created by limeng on 2014/12/24.
 */

//function getTimeString(timestamp) {
//    var time = new Date(timestamp);
//    var now = new Date();
//    var hour, minute, time_str;
//    if (now - time >= 24 * 3600 * 1000)
//        time_str = time.getMonth() + "-" + time.getDate();
//    else if (now - time >= 60 * 1000) {
//        hour = '' + time.getHours();
//        if (hour.length < 2)
//            hour = '0' + hour;
//        minute = '' + time.getMinutes();
//        if (minute.length < 2)
//            minute = '0' + minute;
//        time_str = hour + ":" + minute;
//    } else {
//        time_str = Math.ceil((now - time) / 1000) + "秒前";
//    }
//    return time_str;
//}
//
//function updateMessagesTime() {
//    $("#content-container #timestamp").each(function() {
//        var timestamp = parseInt($(this).text());
//        $(this).parent(".message_header_right").find(".time").text(getTimeString(timestamp));
//    })
//}

$(document).ready(function() {
    var send = $('.send');
    //提交消息
    $('#message_form').submit(function (event) {
        event.preventDefault();
        var form = $('#message_form');
        var content = $('#div-content').html();
        $('#div-content').html("");
        send.attr("disabled","disabled");
        send.css("color","rgba(235, 244, 235,0.5)");

        $.ajax({
            url: form.attr('action'),
            type: "POST",
            data: {
                openid: openid,
                content: content
            },
            success: function (data){
                switch (data) {
                    case "Success":
                        alert("hah");
                        break;

                    case "NoUser":
                        break;

                    case "BannedContent":
                        break;

                    case "Error":
                        break;
                }
            },
            error: function (data){
                console.info(data);
            }
        });
    });
    //发送消息
//    $('.send').click(function() {
//        var content = $('#div-content').html();
//        $('#div-content').html("");
//        send.attr("disabled","disabled");
//        send.css("color","rgba(235, 244, 235,0.5)");
//        var message = createsSelfMessages(content);
//        message.appendTo($('#content-container'));
//        //滚动到页面底部
//        var height = $(document).height();
//        $('body').animate({scrollTop: height}, 800);
//    });
//    //刷新按钮
//    $('#refresh').click(function () {
//        var refresh = $('#refresh i');
//        refresh.addClass('fa-spin');
//        var message_id;
//        if ($('#content-container .message_id').length == 0)
//            message_id = 0;
//        else
//            message_id = parseInt($('#content-container .message_id')[0].innerHTML);
//
//        $.ajax({
//            url: get_new_messages,
//            type: "POST",
//            data: {
//                message_id: message_id
//            },
//            success: function (data) {
//                //console.info(data);
//                var messages = data.messages;
//                for (var i = messages.length - 1; i >= 0; i--) {
//                    var message = createsMessages(messages[i]);
//                    message.prependTo($("#content-container"));
//                }
//            },
//            error: function (data){
//                console.info(data);
//            }
//        });
//
//        updateMessagesTime();
//        refresh.removeClass('fa-spin');
//    });
//
//    $('#refresh').trigger("click");
//
//    //获取历史消息按钮
//    $('#get_old').click(function () {
//        var message_id;
//        if ($('#content-container .message_id').length == 0)
//            message_id = 0;
//        else {
//            var len = $('#content-container .message_id').length;
//            message_id = parseInt($('#content-container .message_id')[len - 1].innerHTML);
//        }
//
//        $.ajax({
//            url: get_old_messages,
//            type: "POST",
//            data: {
//                message_id: message_id
//            },
//            success: function (data){
//                //console.info(data);
//                var messages = data.messages;
//                for (var i = 0; i < messages.length; i++) {
//                    var message = createsMessages(messages[i]);
//                    $("#get_old").before(message);
//                }
//            },
//            error: function (data){
//                console.info(data);
//            }
//        });
//    });

    //创建一条信息
    function createsMessages(message) {
        var divMessage = $('<div class="message"></div>');
        var divMessageLeft = $('<div class="message-left"></div>');
        var divPhoto = $('<div class="message-photo"><img src='+message.avatar+'"/></div>');
        var divMessageRight = $('<div class="message-right"></div>');
        var divMessageName = $('<div class="message-name">'+message.name+'</div>');
        var divDialog = $('<div class="dialog"></div>');
        var divTriangle = $('<span class="triangle"></span>');
        var divContent = $('<div class="message-content">'+message.content +'</div>');
        var divId = $('<div class="message-id">'+message.id+'</div>');
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
    function createsSelfMessages(content) {
        var divMessage = $('<div class="self-message"></div>');
        var divMessageRight = $('<div class="self-message-right"></div>');
        var divPhoto = $('<div class="self-message-photo"><img src="#"/></div>');
        var divMessageLeft = $('<div class="self-message-left"></div>');
        var divMessageName = $('<div class="self-message-name"></div>');
        var divDialog = $('<div class="self-dialog"></div>');
        var divTriangle = $('<span class="self-triangle"></span>');
        var divContent = $('<div class="self-message-content">'+content +'</div>');
        var divId = $('<div class="message-id"></div>');
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
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        $('.mask').css({"height":docHeight, "width":docWidth});
//        (function ($) {
//            $.fn.snow = function (options) {
//                var $flake = $('<div id="flake" />').css({'position': 'absolute', 'top': '-50px'}).html('&#10052;'), documentHeight = $(document).height(), documentWidth = $(document).width(), defaults = {minSize: 10, maxSize: 20, newOn: 500, flakeColor: "#FFFFFF"}, options = $.extend({}, defaults, options);
//                var interval = setInterval(function () {
//                    var startPositionLeft = Math.random() * documentWidth - 100, startOpacity = 0.5 + Math.random(), sizeFlake = options.minSize + Math.random() * options.maxSize, endPositionTop = documentHeight - 40, endPositionLeft = startPositionLeft - 100 + Math.random() * 200, durationFall = documentHeight * 10 + Math.random() * 5000;
//                    $flake.clone().appendTo('body').css({left: startPositionLeft, opacity: startOpacity, 'font-size': sizeFlake, color: options.flakeColor}).animate({top: endPositionTop, left: endPositionLeft, opacity: 0.2}, durationFall, 'linear', function () {
//                        $(this).remove()
//                    });
//                }, options.newOn);
//            };
//        })(jQuery);
//        $.fn.snow({ minSize: 5, maxSize: 50, newOn: 1000, flakeColor: '#FFF' });
    });
    //菜单项按钮处理

    //监听输入框
    send.attr("disabled","disabled");
    send.css("color","rgba(235, 244, 235,0.5)");
    $('#div-content').bind('input propertychange', function() {
        var input = $('#div-content').html();
        if(input == "") {
            send.attr("disabled","disabled");
            send.css("color","rgba(235, 244, 235,0.5)");
        }
        else {
            send.removeAttr("disabled");
            send.css("color","rgba(235, 244, 235,1)");
        }
    });
//    $('#content').on('input',function(){
//        var input = $('#content').val();
//        if(input == "") {
//            send.attr("disabled","disabled");
//            send.css("color","rgba(235, 244, 235,0.5)");
//        }
//        else {
//            send.removeAttr("disabled");
//            send.css("color","rgba(235, 244, 235,1)");
//        }
//    });

    //创建通知框
    function createNoticeBar(content){
        var notice = $('<div class="notice"><div class="notice-wrap"><p class="notice-content">通知：'+content+'</p></div><span class="delete">×</span></div>');
        $('.wrap').prepend(notice);
        $('.content-wrap').css("padding-top", "2em");
        $('.notice span.delete').click(function(){
            $('.content-wrap').css("padding-top", "0");
            $('.notice').remove();
        });
    }
    createNoticeBar("hahaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassssssssssss");
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

    //创建提示框
    function createPrompt() {
        var prompt = $('<div class="prompt">已发送</div>');
        $('.wrap').append(prompt);
        prompt.animate({ opacity: 0 }, 3000, "linear", function () {
            prompt.remove();
        });
    }
    createPrompt();
});