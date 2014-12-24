/**
 * Created by limeng on 2014/12/24.
 */
$(document).ready(function(){
    var menu_clicked = false;
    $('.menu').click(function(){
        if(!menu_clicked) {
            $('body').addClass('exposed');
            menu_clicked = true;
        }
        else {
            $('body').removeClass('exposed');
            menu_clicked = false;
        }
    });

    $('.get_old').click(function () {
        $.post("",
        {
            command: "cancel",
            bind_id:"{{ bind.unique_id }}"
        },
        function(data, status){

        });
    });
});