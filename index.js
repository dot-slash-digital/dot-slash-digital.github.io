/*

document.ready -- runs when the DOM is ready, e.g. all elements are there to be found/used, but not necessarily all content
window.onload -- when images and such are loaded

*/

window.onload = function() {
    fullSizeHome();
}

$(window).resize(function() {
    fullSizeHome();
});

function fullSizeHome() {
    $("#home-section").height($(window).height());
}