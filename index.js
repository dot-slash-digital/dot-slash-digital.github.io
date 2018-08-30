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

// use requestAnimationFrame for smoothness (shimmed with setTimeout fallback)
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback) {
              window.setTimeout(callback, 1000 / 60);
          };
})();

//initialize the clock in a self-invoking function
(function clock() {

    (function loop() {
        requestAnimFrame(loop);
        draw();
    })();

    function draw(){
        
        var now = moment().tz("America/Los_Angeles");
        var ms = (now.second() * 1000) + (now.minute() * 60000) + (now.hour() * 3600000);

        document.getElementById("sec").style.webkitTransform = "rotate(" + (ms * 0.006) + "deg)";
        document.getElementById("hour").style.webkitTransform = "rotate(" + ((ms / 120000) + (ms / 7200000)) + "deg)";
        document.getElementById("min").style.webkitTransform = "rotate(" + (ms / 10000) + "deg)";
    } 
})();