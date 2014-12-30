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
                    showError("昵称被抢注啦~~(>_<)~~");
                    break;
            }
        },
        error: function(data) {
            console.info(data);
        }
    });
}

//function handleChange() {
//    cleanError();
//    if ($('#name-input').val() == "") {
//        //disableButton();
//    }
//}

function showError(text) {
    //disableButton();
    $('#name-error').text(text);
    $('.row-error').slideDown("fast");
}

function cleanError() {
    $('.row-error').slideUp("fast");
    $('#name-error').text("");
    //enableButton();
}

function enableButton() {
    var button = $('#submit-button');
    button.unbind("click", submitButton);
    button.bind("click", submitButton);
    button.removeClass("disable-button");
}

//function disableButton() {
//    var button = $('#submit-button');
//    button.addClass("disable-button");
//    button.unbind("click", submitButton);
//}

function enableInput() {
    $('#name-input').removeAttr('readonly');
    $('#photo-file').removeAttr('readonly');
}

function disableInput() {
    $('#name-input').attr('readonly', 'readonly');
    $('#photo-file').attr('readonly', 'readonly');
}

function submitButton() {
    disableInput();
    //disableButton();

    var name = $('#name-input').val();
    if (name == "") {
        return;
    }

    $.ajax({
        url: $('#login-form').attr('action'),
        type: "POST",
        data: {
            openid: $('#openid-input').val(),
            name: $('#name-input').val(),
            photo: $('#photo-base64').val()
        },
        success: function(data) {
            switch (data) {
                case "InvalidName":
                    showError("昵称被抢注啦~~(>_<)~~");
                    break;

                case "Error":
                    showError("出现了奇怪的错误o(╯□╰)o");
                    break;

                default:
                    window.location.href = data;
            }
        },
        error: function(data) {
            console.info(data);
        }
    });

    enableInput();
    //enableButton();
}

$(document).ready(function() {
    $('#photo-show').click(function() {
        $('#photo-file').click();
    });

    enableButton();

//    if ($('#name-input').val() == "") {
//        disableButton();
//    } else {
//        enableButton();
//    }

    var width_px = $('#photo-input').css("width");
    var width_num = parseInt(width_px.substring(0, width_px.length - 2));
    compressImg('photo-file', 'photo-show', width_num, function(src) {
        //此处为回调函数，当图片压缩完成并成功显示后执行
        //可得到图片数据值src
        //console.log(src);
        $('#photo-base64').val(src);
    });
});