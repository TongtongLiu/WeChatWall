function checkName(url) {
    var name = $('#name-input').val();
    if (name == "") {
        return;
    }
    $.ajax({
        url: url,
        type: "POST",
        data: {
            name: name
        },
        success: function(data) {
            switch (data) {
                case "Valid":
                    cleanError();
                    break;

                case "Invalid":
                    showError("昵称被抢注啦");
                    break;
            }
        },
        error: function(data) {
            console.info(data);
        }
    });
}

function handleChange() {
    cleanError();
    if ($('#name-input').val() == "") {
        disableButton();
    }
}

function showError(text) {
    disableButton();
    $('#name-error').text(text);
    $('.row-error').slideDown("fast");
}

function cleanError() {
    $('.row-error').slideUp("fast");
    $('#name-error').text("");
    enableButton();
}

function enableButton() {
    var button = $('#submit-button');
    button.bind("click", submitButton);
    button.removeClass("disable-button");
}

function disableButton() {
    var button = $('#submit-button');
    button.unbind("click", submitButton);
    button.addClass("disable-button");
}

function submitButton() {
    $.ajax({
        url: submitURL,
        type: "POST",
        data: {
            openid: openid,
            name: $('#name-input').val(),
            photo: $('#photo-input').val()
        },
        success: function(data) {
            switch (data) {
                case "ExistOpenid":
                    showError("您已经注册过啦");
                    break;

                case "InvalidName":
                    showError("昵称被抢注啦");
                    break;

                case "Error":
                    showError("出现了奇怪的错误T^T");
                    break;

                default:
                    window.location.href = data;
            }
        },
        error: function(data) {
            console.info(data);
        }
    });
}

$(document).ready(function() {
    $('#photo-input').click(function() {
        $('#photo-file').trigger('click');
    });

    compressImg('photo-file', 'photo-show', 80, function(src){
        //此处为回调函数，当图片压缩完成并成功显示后执行
        //可得到图片数据值src
        console.log(src);
    });
})