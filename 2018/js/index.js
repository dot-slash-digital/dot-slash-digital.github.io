const all_team_members = [
  "matt",
  "connor",
  "nick",
  "ivy",
  "sam",
  "yohan",
  "sahana",
  "crysta",
  "christina",
  "jino",
  "jazmin",
  "drew",
  "joseph",
];

/*

document.ready -- runs when the DOM is ready, e.g. all elements are there to be found/used, but not necessarily all content
window.onload -- when images and such are loaded

*/

$(document).ready(function () {
  $(".tip").tipr({
    speed: 300,
    mode: "above",
    marginAbove: -45,
    space: 70,
  });
});

// tipr
(function ($) {
  $.fn.tipr = function (options) {
    var set = $.extend(
      {
        speed: 300,
        mode: "below",
        marginAbove: -65,
        marginBelow: 7,
        space: 70,
      },
      options
    );
    return this.each(function () {
      var mouseY = -1;
      $(document).on("mousemove", function (event) {
        mouseY = event.clientY;
      });
      var viewY = $(window).height();
      $(this).hover(
        function () {
          var m = set.mode;
          var m_a = set.marginAbove;
          var m_b = set.marginBelow;
          $(window).on("resize", function () {
            viewY = $(window).height();
          });
          if (viewY - mouseY < set.space) {
            m = "above";
          } else {
            m = set.mode;
            if ($(this).attr("data-mode")) {
              m = $(this).attr("data-mode");
            }
          }
          if ($(this).attr("data-marginAbove")) {
            m_a = $(this).attr("data-marginAbove");
          }
          if ($(this).attr("data-marginBelow")) {
            m_b = $(this).attr("data-marginBelow");
          }
          tipr_cont = ".tipr_container_" + m;
          if (m == "above") {
            var out =
              '<div class="tipr_container_' +
              m +
              '" style="margin-top: ' +
              m_a +
              'px;">';
          } else {
            var out =
              '<div class="tipr_container_' +
              m +
              '" style="margin-top: ' +
              m_b +
              'px;">';
          }
          out +=
            '<div class="tipr_point_' +
            m +
            '"><div class="tipr_content">' +
            $(this).attr("data-tip") +
            "</div></div></div>";
          $(this).after(out);
          var w_t = $(tipr_cont).outerWidth();
          var w_e = $(this).width();
          var m_l = w_e / 2 - w_t / 2;
          $(tipr_cont).css("margin-left", m_l + "px");
          $(this).removeAttr("title alt");
          $(tipr_cont).fadeIn(set.speed);
        },
        function () {
          $(tipr_cont).remove();
        }
      );
    });
  };
})(jQuery);

var projects = [
  [
    // Personal Eyes Opticians
    ["#projects-peo-1", "#projects-peo-2", "#projects-peo-3"],
    ["#projects-peo-1-link", "#projects-peo-2-link", "#projects-peo-3-link"],
  ],
  [
    // Timeless Massage
    ["#projects-tm-1", "#projects-tm-2", "#projects-tm-3"],
    ["#projects-tm-1-link", "#projects-tm-2-link", "#projects-tm-3-link"],
  ],
  [
    // Feel the Breeze
    ["#projects-ftb-1", "#projects-ftb-2", "#projects-ftb-3"],
    ["#projects-ftb-1-link", "#projects-ftb-2-link", "#projects-ftb-3-link"],
  ],
  [
    // Dr. William G. Pappas, DDS
    ["#projects-dwp-1", "#projects-dwp-2", "#projects-dwp-3"],
    ["#projects-dwp-1-link", "#projects-dwp-2-link", "#projects-dwp-3-link"],
  ],
];

window.onload = function () {
  fullSizeHome();
  hideMobileMenu();
  setProjectsImg();
  setServicesHeight();
};

$(window).resize(function () {
  fullSizeHome();
  hideMobileMenu();
  setProjectsImg();
  setServicesHeight();
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
  } else if (project == "dwp") {
    img = ".projects-dwp img";
    projectIndex = 3;
  }

  $(img).each(function () {
    for (var i = 0; i < projects[projectIndex][0].length; i++) {
      if (
        $(this).is($(projects[projectIndex][0][i])) == true &&
        index != i + 1
      ) {
        $(projects[projectIndex][0][i]).removeClass("projects-active");
        $(projects[projectIndex][1][i]).removeClass("projects-number-active");

        break;
      }
    }
  });
}

function getProjectIndex(t) {
  if (t.is(".projects-peo") == true) return 0;
  else if (t.is(".projects-tm") == true) return 1;
  else if (t.is(".projects-ftb") == true) return 2;
  else if (t.is(".projects-dwp") == true) return 3;
  else return -1;
}

function getProjectName(t) {
  if (t.is(".projects-peo") == true) return "peo";
  else if (t.is(".projects-tm") == true) return "tm";
  else if (t.is(".projects-ftb") == true) return "ftb";
  else if (t.is(".projects-dwp") == true) return "dwp";
  else return "";
}

function aboutPhotoHover(t, hover) {
  let team_member = "";
  for (name of all_team_members) {
    if (
      t.is($("#about-" + name + " > .team-member-selector")) ||
      t.is($("#about-" + name + " > .about-bio > .about-bio-social")) == true
    ) {
      team_member = name;
      break;
    }
  }

  if (hover == "on") {
    $("#about-" + team_member + " .about-bio").css(
      "background-color",
      "rgba(255, 0, 0, 0.8)"
    );

    $("#about-" + team_member + " .about-bio-name").css(
      "margin-bottom",
      "30px"
    );
    $("#about-" + team_member + " .about-bio-title").css("opacity", "1");
    $("#about-" + team_member + " .about-bio-social").css("opacity", "1");
    $("#about-" + team_member + " .about-bio-social a").css(
      "cursor",
      "pointer"
    );
  } else if (hover == "off") {
    $("#about-" + team_member + " .about-bio").css(
      "background-color",
      "transparent"
    );

    $("#about-" + team_member + " .about-bio-name").css("margin-bottom", "0");
    $("#about-" + team_member + " .about-bio-title").css("opacity", "0");
    $("#about-" + team_member + " .about-bio-social").css("opacity", "0");
    $("#about-" + team_member + " .about-bio-social a").css("cursor", "none");
  }
}

function setServicesHeight() {
  if ($(window).width() > 750 && $(window).width() < 1001) {
    var maxHeight = 0;
    $(".services-group").each(function () {
      if ($(this).height() > maxHeight) maxHeight = $(this).height();
    });

    $(".services-group").each(function () {
      $(this).height(maxHeight);
    });
  } else $(".services-group").css("height", "auto");
}

// use requestAnimationFrame for smoothness (shimmed with setTimeout fallback)
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

//initialize the clock in a self-invoking function
(function clock() {
  (function loop() {
    requestAnimFrame(loop);
    draw();
  })();

  function draw() {
    var now = moment().tz("America/Los_Angeles");
    var ms = now.second() * 1000 + now.minute() * 60000 + now.hour() * 3600000;

    $("#sec").css("-webkit-transform", "rotate(" + ms * 0.006 + "deg)");
    $("#hour").css(
      "-webkit-transform",
      "rotate(" + (ms / 120000 + ms / 7200000) + "deg)"
    );
    $("#min").css("-webkit-transform", "rotate(" + ms / 10000 + "deg)");
  }
})();

// Button to open mobile menu
$("#menu-mobile-button i").click(function () {
  $("#mobile-menu").css("display", "block");
  $("#mobile-menu").css("overflow", "hidden");
  $("body").css("overflow", "hidden");
});

// Button to close mobile menu
$("#mobile-menu-close").click(function () {
  $("#mobile-menu").css("display", "none");
  $("#mobile-menu").css("overflow", "auto");
  $("body").css("overflow", "auto");
});

// Transitions work page background between solid color and project image when hovering over project title
$(".work-project-title").hover(
  function () {
    $(".work-project-title").css("transition", "0.5s all");

    if ($(this).is("#project-peo") == true)
      $("#work-projects-list-background").css(
        "background-image",
        "url('images/work/PEO/peo_phone.jpg')"
      );
    else if ($(this).is("#project-tm") == true)
      $("#work-projects-list-background").css(
        "background-image",
        "url('images/work/TM/tm_phone.jpg')"
      );
    else if ($(this).is("#project-ftb") == true)
      $("#work-projects-list-background").css(
        "background-image",
        "url('images/work/FTB/ftb_phone.jpg')"
      );
    else if ($(this).is("#project-dwp") == true)
      $("#work-projects-list-background").css(
        "background-image",
        "url('images/work/DWP/dwp_desktop.jpg')"
      );
    else if ($(this).is("#project-bmb") == true)
      $("#work-projects-list-background").css(
        "background-image",
        "url('images/work/bmb.jpg')"
      );
    else if ($(this).is("#project-hib") == true)
      $("#work-projects-list-background").css(
        "background-image",
        "url('images/work/hib.jpg')"
      );
    else {
      $("#work-projects-list-background").css("background-image", "none");
      $("#work-projects-list-background").css("background-color", "red");
    }

    $(".work-project-title").css("color", "rgba(241, 241, 241, 0.25)"); // rgba(241, 241, 241, 0.25) = #f1f1f1 with opacity
    $(this).css("color", "#f1f1f1");
    $("#work-projects-list").css("background-color", "transparent");
  },
  function () {
    $(".work-project-title").css("color", "#212529");
    $("#work-projects-list").css("background-color", "#f1f1f1");
  }
);

// Change photo based on project image number
$(".projects-numbers-list ul li").click(function () {
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
$(".projects-left-arrow").click(function () {
  var projectIndex = getProjectIndex($(this));

  for (var i = 0; i < projects[projectIndex][0].length; i++) {
    if (
      $(projects[projectIndex][1][i]).is($(".projects-number-active")) == true
    ) {
      $(projects[projectIndex][0][i]).removeClass("projects-active");
      $(projects[projectIndex][1][i]).removeClass("projects-number-active");

      if (i == 0) {
        $(
          projects[projectIndex][0][projects[projectIndex][0].length - 1]
        ).addClass("projects-active");
        $(
          projects[projectIndex][1][projects[projectIndex][0].length - 1]
        ).addClass("projects-number-active");
      } else {
        $(projects[projectIndex][0][i - 1]).addClass("projects-active");
        $(projects[projectIndex][1][i - 1]).addClass("projects-number-active");
      }

      break;
    }
  }
});

// Change photo using right arrow
$(".projects-right-arrow").click(function () {
  var projectIndex = getProjectIndex($(this));

  for (var i = 0; i < projects[projectIndex][0].length; i++) {
    if (
      $(projects[projectIndex][1][i]).is($(".projects-number-active")) == true
    ) {
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

$(".team-member-selector").hover(
  function () {
    aboutPhotoHover($(this), "on");
  },
  function () {
    aboutPhotoHover($(this), "off");
  }
);

$(".about-bio-social").hover(
  function () {
    aboutPhotoHover($(this), "on");
  },
  function () {
    aboutPhotoHover($(this), "off");
  }
);

// Submit contact form and error checking
$("#contact-form").submit(function () {
  if ($("#contact-name-input").val() == "") {
    $("#contact-name-input").removeClass("form-valid");
    $("#contact-name-input").addClass("form-invalid");
  } else {
    $("#contact-name-input").removeClass("form-invalid");
    $("#contact-name-input").addClass("form-valid");
  }

  if ($("#contact-company-input").val() == "") {
    $("#contact-company-input").removeClass("form-valid");
    $("#contact-company-input").addClass("form-invalid");
  } else {
    $("#contact-company-input").removeClass("form-invalid");
    $("#contact-company-input").addClass("form-valid");
  }

  if ($("#contact-email-input").val() == "") {
    $("#contact-email-input").removeClass("form-valid");
    $("#contact-email-input").addClass("form-invalid");
  } else {
    $("#contact-email-input").removeClass("form-invalid");
    $("#contact-email-input").addClass("form-valid");
  }

  if ($("#contact-description-input").val() == "") {
    $("#contact-description-input").removeClass("form-valid");
    $("#contact-description-input").addClass("form-invalid");
  } else {
    $("#contact-description-input").removeClass("form-invalid");
    $("#contact-description-input").addClass("form-valid");
  }

  if (
    $("#contact-name-input").val() != "" &&
    $("#contact-company-input").val() != "" &&
    $("#contact-email-input").val() != "" &&
    $("#contact-description-input").val() != ""
  )
    return true;
  else return false;
});

// Remove form validity classes if a user edits the input
$("input").on("input", function () {
  $(this).removeClass("form-valid");
  $(this).removeClass("form-invalid");
});
$("textarea").on("input", function () {
  $(this).removeClass("form-valid");
  $(this).removeClass("form-invalid");
});
