/**
 * Created by limeng on 2014/12/29.
 */

//处理iPhone下fixed属性问题
$(document).ready(function() {
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
            var footer = $(".footer");
            var docHeight = $(document).height() - $('.refresh').height();
            var scrollTop = $(window).scrollTop();
            var footerHeight = $(footer).height();
            var startScrollY = $(window).scrollTop();
            setTimeout(function () {
                var interval = $(footer).offset().top - scrollTop;
                var inputTopPos = $(footer).offset().top + footerHeight;
                var inputPos = (inputTopPos + interval > docHeight) ? (docHeight - inputTopPos) : (docHeight - inputTopPos - interval);
                $(footer).removeClass("footer-position");
                $(footer).css({'position': 'absolute', 'bottom': inputPos});

                //滚动事件
                $(window).bind('scroll.iPhone', function () {
                    var offset = $(window).scrollTop() - startScrollY;
                    var afterScrollPos = inputPos - offset;

                    footer.css({'position': 'absolute', 'bottom': afterScrollPos});
                });
            }, 100);
        }).blur(function(){
            $(".footer").addClass("footer-position");
            $(".footer").css({'position':'fixed', 'bottom': 0});
            $(window).unbind('scroll.iPhone');
        });
    }
});