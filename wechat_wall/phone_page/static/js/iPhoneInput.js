/**
 * Created by limeng on 2014/12/29.
 */

//处理iPhone下fixed属性问题
var sendBtn = $('.iPhone-send');

//监听输入框
//监听输入框
sendBtn.attr("disabled","disabled");
sendBtn.css("color","rgba(235, 244, 235,0.5)");
function iPhoneHandleInputChange() {
    iPhoneEnableInput();
    if ($('#iPhone-div-content').html() == "") {
        iPhoneDisableInput();
    }
}
function iPhoneDisableInput() {
    sendBtn.attr("disabled","disabled");
    sendBtn.css("color","rgba(235, 244, 235,0.5)");
}
function iPhoneEnableInput() {
    sendBtn.removeAttr("disabled");
    sendBtn.css("color","rgba(235, 244, 235,1)");
}

//绑定回车
$('#iPhone-div-content').keydown(function(event) {
    var code = event.keyCode || event.which || event.charCode;
    if (code == 13) {
        if($('#iPhone-div-content').html() != ""){
            sendBtn.click();
        }
    }
});


//发送按钮点击事件
sendBtn.click(function() {
    var content = $('#iPhone-div-content').text();
    sendBtn.attr("disabled","disabled");
    sendBtn.css("color","rgba(235, 244, 235,0.5)");
    $('#iPhone-div-content').html("");
    $('.wrap').css("display","block");
    $('.iPhone-input').css("display","none");
    var height = $(document).height() - $('.footer').height();
    $(window).scrollTop(height);
    createDialog("prompt", "已发送");

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