/**
 * Created by Epsirom on 14-3-31.
 */

var bufq = [];

var wall_updating = false,
    big_screen_switch = false;

function initial_wallmsg() {

}

function adjust_wallmsg(w, h) {
    $('#wallmsgs').outerHeight(h).outerWidth(w);
    var msgh = (h * 0.8 - 135) / 3;
    $('.msg').outerHeight(msgh).outerWidth(w - 280);
    for (var i = 1; i <= 3; ++i) {
        $('[msg-place=' + i + ']').css('top', 90 + h * 0.2 + (15 + msgh) * (i - 1)).css('left', i * 90);
    }
    $('.msg-avatar>img').css('padding', (msgh - 132) / 2);
    var mcdom = $('.msg-content'), msdom = $('.msg-sender'), tp = (msgh - measure_msg_height('好') - measure_name_height('好')) / 3;
    msdom.css('left', msgh).css('top', tp);
    mcdom.outerHeight(measure_msg_height('好')).outerWidth(w - 280 - msgh - (msgh - 132) / 2).css('left', msgh).css('top', msgh - measure_msg_height('好') - tp * 2);
}

socket.on('wall', function(data) {
    for (var i = 0, len = data.length; i < len; ++i) {
        set_wallmsg($('.msg[msg-place=' + (i + 1) + ']'), data[i]);
    }
});

socket.on('post', function(data) {
    bufq.push(data);
    update_wall();
});

socket.on('big_screen', function(data) {
    if (data.switch) {
        show_big_screen(function(){});
    } else {
        hide_big_screen(function(){});
    }
});

socket.on('update_user', function(data) {
    update_user(data.openid, data.nickname, data.avatar);
});

function update_user(openid, nickname, avatar) {
    var dom = $('.msg[openid=' + openid + ']');
    dom.children('.msg-sender').text(nickname);
    dom.children('.msg-avatar').children('img').attr('src', avatar);
    $('.bs-sender[openid=' + openid + ']').text(nickname);
    $('.bs-avatar[openid=' + openid + ']').children('img').attr('src', avatar);
}

function update_wall() {
    if (wall_updating || bufq.length == 0) {
        return;
    }
    wall_updating = true;
    var data = bufq.shift();
    if (data.np) {
        function msganimate() {
            remove_3(function() {
                move_1_to_2(function() {});
                move_2_to_3(function() {
                    count();
                    insert_1(data, function() {
                        adjust_wallmsg(sc.w, sc.h);
                        finish_update_wall();
                    });
                });
            });
        }
        if (big_screen_switch) {
            hide_big_screen(msganimate);
        } else {
            msganimate();
        }
    } else {
        if (big_screen_switch) {
            update_big_screen(data, finish_update_wall);
        } else {
            set_big_screen(data);
            show_big_screen(finish_update_wall);
        }
    }
}

function finish_update_wall() {
    wall_updating = false;
    update_wall();
}

function show_big_screen(callback) {
    $('#big-screen').fadeIn(1000, function() {
        big_screen_switch = true;
        callback();
    });
}

function hide_big_screen(callback) {
    $('#big-screen').fadeOut(1000, function() {
        big_screen_switch = false;
        callback();
    });
}

function set_big_screen(data) {
    var dom = $('#big-screen>span');
    dom.text(data.msg);
    var adom = $('<div class="bs-avatar bs-info"><img src="img/user.gif"></div>'), sdom = $('<div class="bs-sender bs-info"></div>');
    adom.attr('openid', data.user.openid).children('img').attr('src', data.user.avatar);
    sdom.attr('openid', data.user.openid).text(data.user.nickname);
    dom.prepend(sdom).prepend(adom);
}

function update_big_screen(data, callback) {
    $('#big-screen>span').fadeOut('normal', function() {
        set_big_screen(data);
        $(this).fadeIn('normal', callback);
    });
}

function remove_3(callback) {
    var dom = $('.msg[msg-place=3]');
    dom.children('.msg-sender').fadeOut('normal');
    dom.children('.msg-avatar').fadeOut('normal');
    dom.children('.msg-content').fadeOut('normal', function() {
        dom.animate({left: sc.w, top: sc.h}, 'normal', function() {
            $(this).remove();
        });
        callback();
    });
}

function move_2_to_3(callback) {
    var dom = $('.msg[msg-place=2]');
    var w = sc.w, h = sc.h;
    var msgh = (h * 0.8 - 135) / 3;
    dom.animate({top: 90 + h * 0.2 + (15 + msgh) * 2, left: 270}, 'normal', function() {
        dom.attr('msg-place', 3);
        callback();
    });
}

function move_1_to_2(callback) {
    var dom = $('.msg[msg-place=1]');
    var w = sc.w, h = sc.h;
    var msgh = (h * 0.8 - 135) / 3;
    dom.animate({top: 90 + h * 0.2 + (15 + msgh), left: 180}, 'normal', function() {
        dom.attr('msg-place', 2);
        callback();
    });
}

function insert_1(data, callback) {
    var dom = $('<div class="msg" msgid="1" msg-place="1">' +
        '<div class="msg-glass"></div>' +
        '<div class="msg-sender">逗比</div>' +
        '<div class="msg-avatar"><img src="img/user.gif"></div>' +
        '<div class="msg-content">哈哈哈</div>' +
        '</div>');
    set_wallmsg(dom, data);
    var w = sc.w, h = sc.h;
    var msgh = (h * 0.8 - 135) / 3;
    dom.outerHeight(msgh).outerWidth(w - 280).css('top', 90 + h * 0.2).css('left', 280 - w);

    dom.children('.msg-avatar').children('img').css('padding', (msgh - 132) / 2);
    var mcdom = dom.children('.msg-content'), msdom = dom.children('.msg-sender'), tp = (msgh - measure_msg_height('好') - measure_name_height('好')) / 3;
    msdom.css('left', msgh).css('top', tp);
    mcdom.outerHeight(measure_msg_height('好')).outerWidth(w - 280 - msgh - (msgh - 132) / 2).css('left', msgh).css('top', msgh - measure_msg_height('好') - tp * 2);

    dom.appendTo('#wallmsgs');
    dom.animate({left: 90}, 'normal', callback);
}

function set_wallmsg(dom, data) {
    dom.attr('msgid', data.docid).attr('openid', data.user.openid);
    dom.children('.msg-sender').text(data.user.nickname);
    dom.children('.msg-avatar').children('img').attr('src', data.user.avatar);
    var w = sc.w, h = sc.h;
    var msgh = (h * 0.8 - 135) / 3;
    if (measure_msg_width(data.msg) > sc.w - 280 - msgh - (msgh - 132) / 2) {
        var marq = $('<marquee scrollamount="20"></marquee>');
        marq.text(data.msg);
        dom.children('.msg-content').html(marq);
    } else {
        var sp = $('<span></span>');
        sp.text(data.msg);
        dom.children('.msg-content').html(sp);
    }
}