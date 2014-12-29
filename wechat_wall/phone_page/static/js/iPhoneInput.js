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
            $('.refresh').css("display","none");
            $('.mask').css("display","none");
            $('.content-wrap').css("display","none");
        }).blur(function(){
            $('.refresh').css("display","block");
            $('.mask').css("display","block");
            $('.content-wrap').css("display","block");
            var height = $(document).height()-$(window).height();
            $('body').animate({scrollTop: height}, 1000);
        });
    }
});