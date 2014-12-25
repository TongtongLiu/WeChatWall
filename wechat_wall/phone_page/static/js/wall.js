/**
 * Created by limeng on 2014/12/24.
 */

function getTimeString(timestamp) {
    var time = new Date(timestamp);
    var now = new Date();
    var hour, minute, time_str;
    if (now - time >= 24 * 3600 * 1000)
        time_str = time.getMonth() + "-" + time.getDate();
    else if (now - time >= 60 * 1000) {
        hour = '' + time.getHours();
        if (hour.length < 2)
            hour = '0' + hour;
        minute = '' + time.getMinutes();
        if (minute.length < 2)
            minute = '0' + minute;
        time_str = hour + ":" + minute;
    } else {
        time_str = Math.ceil((now - time) / 1000) + "秒前";
    }
    return time_str;
}

function updateMessagesTime() {
    $("#content-container #timestamp").each(function() {
        var timestamp = parseInt($(this).text());
        $(this).parent(".message_header_right").find(".time").text(getTimeString(timestamp));
    })
}

$(document).ready(function() {
    //提交消息
    $('#message_form').submit(function (event) {
        event.preventDefault();
        var form = $('#message_form');

        $.ajax({
            url: form.attr('action'),
            type: "POST",
            data: {
                openid: openid,
                content: $('#content').val()
            },
            success: function (data){
                switch (data) {
                    case "Success":
                        $('#content').val("");
                        $('#refresh').trigger("click");
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

    //刷新按钮
    $('#refresh').click(function () {
        var refresh = $('#refresh i');
        refresh.addClass('fa-spin');
        var message_id;
        if ($('#content-container .message_id').length == 0)
            message_id = 0;
        else
            message_id = parseInt($('#content-container .message_id')[0].innerHTML);

        $.ajax({
            url: get_new_messages,
            type: "POST",
            data: {
                message_id: message_id
            },
            success: function (data) {
                //console.info(data);
                var messages = data.messages;
                for (var i = messages.length - 1; i >= 0; i--) {
                    var message = createsMessages(messages[i]);
                    message.prependTo($("#content-container"));
                }
            },
            error: function (data){
                console.info(data);
            }
        });

        updateMessagesTime();
        refresh.removeClass('fa-spin');
    });

    $('#refresh').trigger("click");

    //获取历史消息按钮
    $('#get_old').click(function () {
        var message_id;
        if ($('#content-container .message_id').length == 0)
            message_id = 0;
        else {
            var len = $('#content-container .message_id').length;
            message_id = parseInt($('#content-container .message_id')[len - 1].innerHTML);
        }

        $.ajax({
            url: get_old_messages,
            type: "POST",
            data: {
                message_id: message_id
            },
            success: function (data){
                //console.info(data);
                var messages = data.messages;
                for (var i = 0; i < messages.length; i++) {
                    var message = createsMessages(messages[i]);
                    $("#get_old").before(message);
                }
            },
            error: function (data){
                console.info(data);
            }
        });
    });

    //创建一条信息
    function createsMessages(message) {
        var divMessage = $('<div />',{
            "class": "message"
        });
        var divMContent = $('<div />',{
            text: message.content,
            "class": "message_content"
        });
        var divMHeader = $('<div />',{
            "class": "message_header"
        });
        var divMHeaderRight = $('<div />',{
            "class": "message_header_right"
        });
        var divName = $('<div />',{
            text: message.user_name,
            "class": "name"
        });
        var time_str = getTimeString(message.time * 1000);
        var divTime = $('<div />',{
            text: message.time * 1000,
            "id": "timestamp",
            "style": "display: none"
        });
        var divTimeStr = $('<div />',{
            text: time_str,
            "class": "time"
        });
        var divPhoto = $('<img />',{
            src: message.user_photo,
            "class":"photo"
        });
        var divMessageId = $('<div />',{
            text: message.message_id,
            "class":"message_id"
        });
        divName.appendTo(divMHeaderRight);
        divTime.appendTo(divMHeaderRight);
        divTimeStr.appendTo(divMHeaderRight);
        divPhoto.appendTo(divMHeader);
        divMHeaderRight.appendTo(divMHeader);
        divMHeader.appendTo(divMessage);
        divMContent.appendTo(divMessage);
        divMessageId.appendTo(divMessage);

        return divMessage;
    }

    $('#menu').click(function () {
        $('body').toggleClass('exposed');
        (function($){$.fn.snow=function(options){var $flake=$('<div id="flake" />').css({'position':'absolute','top':'-50px'}).html('&#10052;'),documentHeight=$(document).height(),documentWidth=$(document).width(),defaults={minSize:10,maxSize:20,newOn:500,flakeColor:"#FFFFFF"},options=$.extend({},defaults,options);var interval=setInterval(function(){var startPositionLeft=Math.random()*documentWidth-100,startOpacity=0.5+Math.random(),sizeFlake=options.minSize+Math.random()*options.maxSize,endPositionTop=documentHeight-40,endPositionLeft=startPositionLeft-100+Math.random()*200,durationFall=documentHeight*10+Math.random()*5000;$flake.clone().appendTo('body').css({left:startPositionLeft,opacity:startOpacity,'font-size':sizeFlake,color:options.flakeColor}).animate({top:endPositionTop,left:endPositionLeft,opacity:0.2},durationFall,'linear',function(){$(this).remove()});},options.newOn);};})(jQuery);
        $.fn.snow({ minSize: 5, maxSize: 50, newOn: 1000, flakeColor: '#FFF' });
    });
    //监听输入框
    var send = $('.send');
    send.attr("disabled","disabled");
    send.css("color","rgba(235, 244, 235,0.5)");
    $('#content').bind('input propertychange', function() {
        var input = $('#content').val();
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
});