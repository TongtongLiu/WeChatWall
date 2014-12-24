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

        $.ajax({
            url: get_new,
            type: "POST",
            data: {
                message_id: 1
            },
            success: function (data){
                console.info(data);
            },
            error: function (data){
                console.info(data);
            }
        });

        refresh.removeClass('fa-spin');
    });

    //获取历史消息按钮
    $('#get_old').click(function () {
        $.ajax({
            url: get_old,
            type: "POST",
            data: {
                message_id: 1
            },
            success: function (data){
                console.info(data);
            },
            error: function (data){
                console.info(data);
            }
        });
    });

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
    $('.text_content').on('input',function(){
        var input = $('.text_content').val();
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