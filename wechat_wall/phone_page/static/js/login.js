/**
 * Created by limeng on 2014/12/25.
 */
$(document).ready(function() {
    var choose_clicked = false;
    $('#choose').click(function () {
        if (!choose_clicked) {
            $('body').addClass('exposed');
            choose_clicked = true;
        }
        else {
            $('body').removeClass('exposed');
            choose_clicked = false;
        }
    });
});