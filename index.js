/*

document.ready -- runs when the DOM is ready, e.g. all elements are there to be found/used, but not necessarily all content
window.onload -- when images and such are loaded

*/

var projects = [
                 [ // Personal Eyes Opticians
                   [ "#projects-peo-1", "#projects-peo-2", "#projects-peo-3", "#projects-peo-4" ],
                   [ "#projects-peo-1-link", "#projects-peo-2-link", "#projects-peo-3-link", "#projects-peo-4-link" ]
                 ], [ // Timeless Massage
                   [ "#projects-tm-1", "#projects-tm-2", "#projects-tm-3", "#projects-tm-4" ],
                   [ "#projects-tm-1-link", "#projects-tm-2-link", "#projects-tm-3-link", "#projects-tm-4-link" ]
                 ], [ // Feel the Breeze
                   [ "#projects-ftb-1", "#projects-ftb-2", "#projects-ftb-3", "#projects-ftb-4" ],
                   [ "#projects-ftb-1-link", "#projects-ftb-2-link", "#projects-ftb-3-link", "#projects-ftb-4-link" ]
                 ], [ // Offr
                   [ "#projects-offr-1", "#projects-offr-2", "#projects-offr-3", "#projects-offr-4" ],
                   [ "#projects-offr-1-link", "#projects-offr-2-link", "#projects-offr-3-link", "#projects-offr-4-link" ]
                 ]
               ];

window.onload = function() {
    fullSizeHome();
    hideMobileMenu();
    setProjectsImg();
}

$(window).resize(function() {
    fullSizeHome();
    hideMobileMenu();
    setProjectsImg();
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

// Set width and height of project images
function setProjectsImg() {
    // height = width * 0.6
    var imageWidth = $(".projects-gallery").width();
    var imageHeight = imageWidth * 0.6;
    
    $(".projects-gallery").height(imageHeight);
    $(".projects-gallery img").height(imageHeight);
    $(".projects-gallery img").width(imageWidth);
}

// Remove 'active' class from project image and image number
function removeActive(project, index) {
    var img = "";
    var projectIndex = -1;
    if (project == "peo") {
        img = ".projects-peo img";
        projectIndex = 0;
    } else if (project == "tm") {
        img = ".projects-tm img";
        projectIndex = 1;
    } else if (project == "ftb") {
        img = ".projects-ftb img";
        projectIndex = 2;
    } else if (project == "offr") {
        img = ".projects-offr img";
        projectIndex = 3;
    }
    
    $(img).each(function() {
        for (var i = 0; i < projects[projectIndex][0].length; i++) {
            if ($(this).is($(projects[projectIndex][0][i])) == true && index != i + 1) {
                $(projects[projectIndex][0][i]).removeClass("projects-active");
                $(projects[projectIndex][1][i]).removeClass("projects-number-active");

                break;
            }
        }
    });
}

function getProjectIndex(t) {
    if (t.is(".projects-peo") == true)
        return 0;
    else if (t.is(".projects-tm") == true)
        return 1;
    else if (t.is(".projects-ftb") == true)
        return 2;
    else if (t.is(".projects-offr") == true)
        return 3;
    else
        return -1;
}

function getProjectName(t) {
    if (t.is(".projects-peo") == true)
        return "peo";
    else if (t.is(".projects-tm") == true)
        return "tm";
    else if (t.is(".projects-ftb") == true)
        return "ftb";
    else if (t.is(".projects-offr") == true)
        return "offr";
    else
        return "";
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

        $("#sec").css("-webkit-transform", "rotate(" + (ms * 0.006) + "deg)");
        $("#hour").css("-webkit-transform", "rotate(" + ((ms / 120000) + (ms / 7200000)) + "deg)");
        $("#min").css("-webkit-transform", "rotate(" + (ms / 10000) + "deg)");
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

// Transitions work page background between solid color and project image when hovering over project title
$(".work-project-title").hover(function () {
    if ($(this).is("#project-peo") == true)
        $("#work-projects-list-background").css("background-image", "url('work1.png')");
    else if ($(this).is("#project-tm") == true)
        $("#work-projects-list-background").css("background-image", "url('work2.png')");
    else if ($(this).is("#project-ftb") == true)
        $("#work-projects-list-background").css("background-image", "url('work1.png')");
    else if ($(this).is("#project-offr") == true)
        $("#work-projects-list-background").css("background-image", "url('work2.png')");
    else {
        $("#work-projects-list-background").css("background-image", "none");
        $("#work-projects-list-background").css("background-color", "red");
    }
    
    $(".work-project-title").css("color", "rgba(241, 241, 241, 0.25)"); // rgba(241, 241, 241, 0.25) = #f1f1f1 with opacity
    $(this).css("color", "#f1f1f1");
    $("#work-projects-list").css("background-color", "transparent");
}, function () {
    $(".work-project-title").css("color", "#212529");
    $("#work-projects-list").css("background-color", "#f1f1f1");
});

// Change photo based on project image number
$(".projects-numbers-list ul li").click(function() {
    var projectName = getProjectName($(this));
    var projectIndex = getProjectIndex($(this));
    
    for (var i = 0; i < projects[projectIndex][0].length; i++) {
        if ($(this).is(projects[projectIndex][1][i]) == true) {
            $(projects[projectIndex][0][i]).addClass("projects-active");
            $(projects[projectIndex][1][i]).addClass("projects-number-active");
            removeActive(projectName, i + 1);
            break;
        }
    }
});

// Change photo using left arrow
$(".projects-left-arrow").click(function() {
    var projectIndex = getProjectIndex($(this));
    
    for (var i = 0; i < projects[projectIndex][0].length; i++) {
        if ($(projects[projectIndex][1][i]).is($(".projects-number-active")) == true) {
            $(projects[projectIndex][0][i]).removeClass("projects-active");
            $(projects[projectIndex][1][i]).removeClass("projects-number-active");
            
            if (i == 0) {
                $(projects[projectIndex][0][projects[projectIndex][0].length - 1]).addClass("projects-active");
                $(projects[projectIndex][1][projects[projectIndex][0].length - 1]).addClass("projects-number-active");
            } else {
                $(projects[projectIndex][0][i - 1]).addClass("projects-active");
                $(projects[projectIndex][1][i - 1]).addClass("projects-number-active");
            }
            
            break;
        }
    }
});

// Change photo using right arrow
$(".projects-right-arrow").click(function() {
    var projectIndex = getProjectIndex($(this));
    
    for (var i = 0; i < projects[projectIndex][0].length; i++) {
        if ($(projects[projectIndex][1][i]).is($(".projects-number-active")) == true) {
            $(projects[projectIndex][0][i]).removeClass("projects-active");
            $(projects[projectIndex][1][i]).removeClass("projects-number-active");
            
            if (i == projects[projectIndex][0].length - 1) {
                $(projects[projectIndex][0][0]).addClass("projects-active");
                $(projects[projectIndex][1][0]).addClass("projects-number-active");
            } else {
                $(projects[projectIndex][0][i + 1]).addClass("projects-active");
                $(projects[projectIndex][1][i + 1]).addClass("projects-number-active");
            }
            
            break;
        }
    }
});

/* $(function() {
    if ($(".projects-active").width > $(".projects-gallery"))
        alert();
})(); */