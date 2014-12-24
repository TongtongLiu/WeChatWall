/**
 * Created by Epsirom on 14-4-1.
 */

function initial_counter() {

}

var counter = 0;

function apply_counter() {
    $('#counter').animate({fontSize: "125px"}, "fast", function() {
        $(this).text(counter.toString(16).toUpperCase()).animate({fontSize: "100px"}, "fast");
    });
}

function update_counter(nc) {
    if (typeof nc == 'number') {
        counter = parseInt(nc);
        apply_counter();
    }
}

function count() {
    ++counter;
    apply_counter();
}