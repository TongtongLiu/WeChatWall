/**
 * Created by liutongtong on 12/30/14.
 */

$(document).ready(function() {
    var foot_height = $('.footer-position').css('height');
    foot_height = parseInt(foot_height.substring(0, foot_height.length));
    var body_height = (document.body.clientHeight - foot_height) + 'px';
    $('.content-wrap').css('height', body_height);
});