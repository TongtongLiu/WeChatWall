/**
 * Created by limeng on 2014/12/24.
 */
$(document).ready(function() {
    var menu_clicked = false;

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
                console.info(data);
                var messages = data.messages;
                var i;
                for (i in messages) {
                    var message = createsMessages(messages[i]);
                    message.prependTo($(".content"));
                }
            },
            error: function (data){
                console.info(data);
            }
        });

        refresh.removeClass('fa-spin');
    });

    //获取历史消息按钮
    $('#get_old').click(function () {
        var message_id;
        if ($('#content-container .message_id').length == 0)
            message_id = 0;
        else
            var len = $('#content-container .message_id').length;
            message_id = parseInt($('#content-container .message_id')[len - 1].innerHTML);

        $.ajax({
            url: get_old_messages,
            type: "POST",
            data: {
                message_id: message_id
            },
            success: function (data){
                console.info(data);
                var messages = data.messages;
                var i;
                for(i in messages) {
                    var message = createsMessages(messages[i]);
                    $(".get_old").before(message);
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
                text:"this is a div",
                "class":"message"
            });
            var divMContent = $('<div />',{
                text:message.content,
                "class":"message_content"
            });
            var divMHeader = $('<div />',{
                "class":"message_header"
            });
            var divMHeaderRight = $('<div />',{
                "class":"message_header_right"
            });
            var divName = $('<div />',{
                text:message.user_name,
                "class":"name"
            });
            var divTime = $('<div />',{
                text:message.time,
                "class":"time"
            });
            var divPhoto = $('<div />',{
                src:message.user_photo,
                "class":"photo"
            });
            var divMessageId = $('<div />',{
                text:message.message_id,
                "class":"message_id"
            });
            divName.appendTo(divMHeaderRight);
            divTime.appendTo(divMHeaderRight);
            divPhoto.appendTo(divMHeader);
            divMHeaderRight.appendTo(divMHeader);
            divMHeader.appendTo(divMessage);
            divMContent.appendTo(divMessage);
            divMessageId.appendTo(divMessage);

            return divMessage;
    }

    $('#menu').click(function () {
        if (!menu_clicked) {
            $('body').addClass('exposed');
            menu_clicked = true;
        }
        else {
            $('body').removeClass('exposed');
            menu_clicked = false;
        }
    });
    //监听输入框
    var send = $('.send');
    send.attr("disabled","disabled");
    send.css("color","rgba(235, 244, 235,0.5)");
    $('#content').on('input',function(){
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
});