/**
 * Created by limeng on 2014/12/29.
 */

//处理iPhone下fixed属性问题
$(document).ready(function() {
    var sendBtn = $('.iPhone-send');
    sendBtn.attr("disabled","disabled");
    sendBtn.css("color","rgba(235, 244, 235,0.5)");
    $('#iPhone-div-content').bind('input propertychange', function() {
        var input = $('#iPhone-div-content').html();
        if(input == "") {
            sendBtn.attr("disabled","disabled");
            sendBtn.css("color","rgba(235, 244, 235,0.5)");
        }
        else {
            sendBtn.removeAttr("disabled");
            sendBtn.css("color","rgba(235, 244, 235,1)");
        }
    });
    sendBtn.click(function() {
        var content = $('#iPhone-div-content').text(),
        message = {
            type: 'user_message',
            content: content,
            openid: openid
        };
        socket.send(message);

        $('.wrap').css("display","block");
        $('.iPhone-input').css("display","none");

        $('#iPhone-div-content').html("");
        sendBtn.attr("disabled","disabled");
        sendBtn.css("color","rgba(235, 244, 235,0.5)");
        //跳转到页面底部
        var height = $(document).height() - $('.footer').height();
        $(window).scrollTop(height);
        createDialog("prompt", "已发送");
    });
    var browser = {
            versions: function () {
            var u = navigator.userAgent;
            return {
                    android: u.indexOf('Android') > -1,//是否为android
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone
                    iPad: u.indexOf('iPad') > -1 //是否iPad
                    };
            }()
    };
    if (browser.versions.iPhone) {
        $("#div-content").focus(function(){
            $('.wrap').css("display","none");
            $('.iPhone-input').css("display","block");
            $('#iPhone-div-content').focus();
        });
        $('.iPhone-return').click(function() {
            $('.wrap').css("display","block");
            $('.iPhone-input').css("display","none");

            var height = $(document).height() - $('.footer').height();
            $(window).scrollTop(height);
        });
    }
});