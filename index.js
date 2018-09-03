/*

document.ready -- runs when the DOM is ready, e.g. all elements are there to be found/used, but not necessarily all content
window.onload -- when images and such are loaded

*/

window.onload = function() {
    fullSizeHome();
    hideMobileMenu();
}

$(window).resize(function() {
    fullSizeHome();
    hideMobileMenu();
});

// Set home section of home page to the full height of the window
function fullSizeHome() {
    $("#home-section").height($(window).height());
}

// Hide the mobile menu when the screen width is larger than 699px
function hideMobileMenu() {
    if ($(window).width() > 699) {
        $("#mobile-menu").css("display", "none");
        $("body").css("overflow", "auto");
    }
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


// Button to open mobile menu
$("#menu-mobile-button i").click(function() {
    $("#mobile-menu").css("display", "block");
    $("body").css("overflow", "hidden");
});

// Button to close mobile menu
$("#mobile-menu-close").click(function() {
    $("#mobile-menu").css("display", "none");
    $("body").css("overflow", "auto");
});