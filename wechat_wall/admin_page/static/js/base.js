/**
 * Created by Epsirom on 14-4-1.
 */


function measure_width(msg) {
    var dom = $('#test-zone');
    var result = dom.text(msg).outerWidth();
    dom.text('');
    return result;
}

function measure_msg_width(msg) {
    var dom = $('#test-msg-zone');
    var result = dom.text(msg).outerWidth();
    dom.text('');
    return result;
}

function measure_name_height(msg) {
    var dom = $('#test-name-zone');
    var result = dom.text(msg).outerHeight();
    dom.text('');
    return result;
}

function measure_msg_height(msg) {
    var dom = $('#test-msg-zone');
    var result = dom.text(msg).outerHeight();
    dom.text('');
    return result;
}

var sc = {
    w: $(window).width(),
    h: $(window).height()
};


var socket = io.connect(conf.SOCKET_IO);