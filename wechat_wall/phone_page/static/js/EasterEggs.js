/**
 * Created by limeng on 2014/12/27.
 */

$(document).ready(function(){
    var snowIntervalFlag = null;
    $.fn.snow = function(options, addTop){
        var documentHeight = $(document).height(),
            documentWidth = $(document).width();
        //雪花
        var flake = $('<div id="flake"/>').css({'position': 'absolute', 'top': '-30px'}).html('&#10052;');
        var defaults = {
                minSize : 10,
                maxSize : 18,
                interval : 800,
                color : "#ffffff"
            },
            options = $.extend({},defaults,options);

        snowIntervalFlag = setInterval(function(){
            var flakeSize = options.minSize + Math.random()*(options.maxSize-options.minSize),
                startTop = addTop,
                startHorizontal = Math.random()*documentWidth-50,
                endBottom = documentHeight - 40,
                endHorizontal = Math.random()*100-50+startHorizontal,
                startOpacity = Math.random() + 0.5,
                duration = (documentHeight-startTop)*10 + 5000;

            flake
                .clone()
                .appendTo($('body'))
                .css({"top":startTop,"left":startHorizontal,"opacity":startOpacity,"font-size":flakeSize,"color":options.color})
                .animate({top:endBottom, left:endHorizontal}, duration, "linear", function(){$(this.remove())});
        }, options.interval);
    };
    $.fn.snowStop = function() {
        clearInterval(snowIntervalFlag);
    };
});

//关键字彩蛋
function keywordRain(rainContent, options, addTop) {
    var documentHeight = $(document).height(),
        documentWidth = $(document).width();
    var rain = $('<div id="rain"/>').css({'position': 'absolute', 'top': '-30px'}).html(rainContent),
        defaults = {
        minSize : 10,
        maxSize : 18,
        interval : 50,
        color : "#ffffff",
        number : 10
    },
    options = $.extend({},defaults,options);
    for(var i=0; i < options.number; i++) {
        setTimeout(function () {
            var rainSize = options.minSize + Math.random() * (options.maxSize - options.minSize),
                startTop = addTop,
                startHorizontal = documentWidth/2 + 50 - Math.random() * 100,
                endBottom = documentHeight - 40,
                endHorizontal = Math.random() * 100 - 50 + startHorizontal,
                startOpacity = Math.random() + 0.5,
                duration = Math.random() * (documentHeight - startTop) * 5 + 5000;

            rain
                .clone()
                .appendTo($('body'))
                .css({"top": startTop, "left": startHorizontal, "opacity": startOpacity, "font-size": rainSize, "color": options.color})
                .animate({top: endBottom, left: endHorizontal}, duration, "linear", function () {
                    $(this.remove())
                });
        }, options.interval);
    }
}

//关键字过滤刘表
var keywords = new Array("新年","么么哒","生日","赞");
var keywordContent = new Array(3);
keywordContent[0] = "<i class='fa fa-angellist' style='color:#666'></i>";
keywordContent[1] = "<p style='color:#E93535'>❤</p>";
keywordContent[2] = "<i class='fa fa-birthday-cake' style='color:#333'></i>";
keywordContent[3] = "<i class='fa fa-thumbs-o-up'style='color:#333'></i>";

//输入文本检测关键字触发彩蛋
function keywordDetect(content) {
    for (var i in keywords) {
        if (content.match(keywords[i]) != null) {
            var addTop = $(window).scrollTop();
            keywordRain(keywordContent[i],{},addTop);
        }
    }
}

