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
            //无虚拟键盘时输入框到浏览器窗口顶端的距离
            var docHeight = $(document).height();
            var thisHeight = $(this).height();
            var noInputViewHeight = $(window).height() - thisHeight;
            var contentHeight = docHeight - thisHeight;
            contentHeight = contentHeight > noInputViewHeight ? contentHeight : noInputViewHeight;

            setTimeout(function(){
                var startScrollY = $(window).scrollTop();
                var inputTopHeight = $(this).offset().top - startScrollY;
                var inputTopPos = $(this).offset().top + inputTopHeight;
                inputTopPos = inputTopPos > contentHeight ? contentHeight : inputTopPos;

                $(this).removeClass("footer-position");
                $(this).css({'position':'absolute', 'bottom': docHeight - inputTopPos - thisHeight});


                //滚动事件
                $(window).bind('scroll.iPhone', function(){
                    //虚拟键盘弹出
                    if(inputTopHeight != noInputViewHeight) {
                        var offset = $(this).scrollTop() - startScrollY;
                        var afterScrollTopPos = inputTopPos + offset;

                        $(this).css({'position':'absolute', 'bottom': docHeight - afterScrollTopPos - thisHeight});
                    }
                });
            }, 100);
        }).blur(function(){
            $(this).addClass("footer-position");
            $(window).unbind('scroll.iPhone');
        });
    }
});