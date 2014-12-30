/**
 * Created by limeng on 2014/12/29.
 */

//处理iPhone下fixed属性问题
$(document).ready(function() {
    var sendBtn = $('.iPhone-send');

    //监听输入框
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

    //发送按钮点击事件
    sendBtn.click(function() {
        var content = $('#iPhone-div-content').text();
        sendBtn.attr("disabled","disabled");
        sendBtn.css("color","rgba(235, 244, 235,0.5)");
        $('#iPhone-div-content').html("");
        sendBtn.attr("disabled","disabled");
        sendBtn.css("color","rgba(235, 244, 235,0.5)");
        $('.wrap').css("display","block");
        $('.iPhone-input').css("display","none");

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