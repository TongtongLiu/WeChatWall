/**
 * Created by Epsirom on 14-3-31.
 */

var notice = {
    shown: false,
    msg: null,
    expire: new Date(0),
    clock: null,
    update: false,
    updating: false
};

function initial_notice() {

}

function adjust_notice(w, h) {
    if (notice.updating) {
        return;
    }
    $('#notice').outerHeight(h * 0.2).outerWidth(w - 265);
    $('#notice-msg').outerHeight(h * 0.2 - (h * 0.2 - 103)).outerWidth(w - 265 - (h * 0.2 - 103)).css('padding', (h * 0.2 - 103) / 2);
    if (notice.shown) {
        $('#img-welcome').css('height', 40).css('right', (w - 265 - 286) / 2).css('top', h * 0.2 + 10);
    } else {
        $('#img-welcome').css('height', 98).css('right', (w - 265 - 700) / 2).css('top', (h * 0.2 + 65 - 98) / 2);
    }
}

function new_notice(msg, expire) {
    notice.msg = msg.toString();
    notice.expire = new Date(expire);
    notice.update = true;
    update_notice();
}

function update_notice() {
    if (!notice.update || notice.updating) {
        return;
    }
    notice.updating = true;
    notice.update = false;
    var msg = notice.msg, expire = notice.expire;
    if (expire.getTime() <= new Date().getTime()) {
        hide_notice(finish_update_notice);
    } else {
        if (notice.lock !== null) {
            clearTimeout(notice.clock);
            notice.clock = null;
        }
        notice.clock = setTimeout(function() {
            notice.update = true;
            update_notice();
        }, expire - new Date());
        if (notice.shown) {
            refresh_notice(msg, finish_update_notice);
        } else {
            set_notice(msg);
            show_notice(finish_update_notice);
        }
    }
}

function hide_notice(callback) {
    var h = sc.h, w = sc.w;
    $('#notice-msg').fadeOut('normal', function() {
        $('#img-welcome').animate({height: 98, right: (w - 265 - 700) / 2, top: (h * 0.2 + 65 - 98) / 2}, 'normal');
        $('#bg-glass').slideUp('normal', function() {
            notice.shown = false;
            adjust_notice(sc.w, sc.h);
            callback();
        });
    });
}

function show_notice(callback) {
    var h = sc.h, w = sc.w;
    $('#img-welcome').animate({height: 40, right: (w - 265 - 286) / 2, top: h * 0.2 + 10}, 'normal');
    $('#bg-glass').slideDown('normal', function() {
        $('#notice-msg').fadeIn('normal', function() {
            notice.shown = true;
            adjust_notice(sc.w, sc.h);
            callback();
        });
    });
}

function set_notice(msg) {
    var h = $(window).height(), w = $(window).width();
    var dom = $('#notice-msg');
    if (measure_width(msg) > w - 265 - (h * 0.2 - 103)) {
        var marq = $('<marquee scrollamount="10"></marquee>');
        marq.text(msg);
        dom.html(marq);
    } else {
        var sp = $('<span></span>');
        sp.text(msg);
        dom.html(sp);
    }
}

function refresh_notice(msg, callback) {
    var dom = $('#notice-msg');
    dom.fadeOut('normal', function() {
        set_notice(msg);
        dom.fadeIn('normal', callback);
    });
}

function finish_update_notice() {
    notice.updating = false;
    update_notice();
}

socket.on('notice', function(data) {
    new_notice(data.msg, data.expire);
});

socket.on('stat', function(data) {
    new_notice(data.notice.msg, data.notice.expire);
    update_counter(data.count.posted);
});
