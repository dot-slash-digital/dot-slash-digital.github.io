const avatarsContainer = document.querySelector("#footer .avatars");
let desktopAvatars = [
  ...document.querySelectorAll("#footer .avatars .avatar.desktop"),
];
let mobileAvatars = [
  ...document.querySelectorAll("#footer .avatars .avatar.mobile"),
];
const textLeft = document.querySelector("#footer .right-col .text-left");
const textRight = document.querySelector("#footer .right-col .text-right");

const transitionSpeed = convertSecondsToMilliseconds(
  getCssVar(document.body, "--transition-speed")
);

const getAvatar = (avatarIndex, isMobile) => {
  const avatars = isMobile ? mobileAvatars : desktopAvatars;
  const avatar = avatars[avatarIndex];
  const isLeft = avatarIndex === 0;

  return {
    avatar: avatar.querySelector("img"),
    isLeft,
    otherAvatar: avatars[isLeft ? 1 : 0].querySelector("img"),
    tooltip: avatar.querySelector(".tooltip"),
  };
};

const onMouseOverAvatar = (avatarIndex, isMobile) => {
  const { avatar, isLeft, otherAvatar, tooltip } = getAvatar(
    avatarIndex,
    isMobile
  );

  // enlarge hovered avatar and shift surrounding elements
  setStyles(avatar, { transform: "scale(var(--hover-scale))" });
  setStyles(otherAvatar, {
    transform: `translateX(calc(var(--hover-translate) * ${isLeft ? 1 : -1}))`,
  });
  if (window.innerWidth > 480) {
    setStyles(textLeft, {
      transform: `translateX(calc(calc(var(--hover-translate) * ${
        isLeft ? 0.5 : 1
      }) * -1))`,
    });
    setStyles(textRight, {
      transform: `translateX(calc(calc(var(--hover-translate) * ${
        isLeft ? 1 : 0.5
      }) * 1))`,
    });
  }

  // show tooltip with animation
  setStyles(tooltip, {
    visibility: "visible",
    opacity: "1",
  });
  setCssVars(tooltip, {
    "--tooltip-y-pos": "-8px",
    "--tooltip-scale": "1",
  });
};

const onMouseOutAvatar = (avatarIndex, isMobile, skipOtherAvatar) => {
  const { avatar, otherAvatar, tooltip } = getAvatar(avatarIndex, isMobile);

  // reset elements
  setStyles(avatar, { transform: "translateX(0px) scale(1)" });
  if (!skipOtherAvatar) {
    setStyles(otherAvatar, { transform: "translateX(0px) scale(1)" });
  }
  setStyles(textLeft, { transform: "translateX(0px)" });
  setStyles(textRight, { transform: "translateX(0px)" });

  // hide tooltip with animation
  setStyles(tooltip, { opacity: "0" });
  setCssVars(tooltip, {
    "--tooltip-y-pos": "0px",
    "--tooltip-scale": "0.5",
  });

  // wait until opacity animation ends
  setTimeout(() => {
    setStyles(tooltip, { visibility: "hidden" });
  }, transitionSpeed);
};

const onTouchStartAvatar = (avatarIndex) => {
  onMouseOverAvatar(avatarIndex, true);
  onMouseOutAvatar(avatarIndex === 0 ? 1 : 0, true, true);
};

const setRandomAvatarOrder = () => {
  const shouldSwapAvatars = Math.random() > 0.5;
  if (shouldSwapAvatars) {
    // swap elements
    const nextSiblingDesktop =
      desktopAvatars[0].nextSibling === desktopAvatars[1]
        ? desktopAvatars[0]
        : desktopAvatars[0].nextSibling;
    avatarsContainer.insertBefore(desktopAvatars[0], desktopAvatars[1]);
    avatarsContainer.insertBefore(desktopAvatars[1], nextSiblingDesktop);

    const nextSiblingMobile =
      mobileAvatars[0].nextSibling === mobileAvatars[1]
        ? mobileAvatars[0]
        : mobileAvatars[0].nextSibling;
    avatarsContainer.insertBefore(mobileAvatars[0], mobileAvatars[1]);
    avatarsContainer.insertBefore(mobileAvatars[1], nextSiblingMobile);

    // recalculate avatars list to use the new order
    desktopAvatars = [
      ...document.querySelectorAll("#footer .avatars .avatar.desktop"),
    ];
    mobileAvatars = [
      ...document.querySelectorAll("#footer .avatars .avatar.mobile"),
    ];
  }
};

const avatarInteractivityInit = () => {
  setRandomAvatarOrder();

  // close any open avatars when clicking outside on mobile
  window.addEventListener("touchstart", (e) => {
    if (!avatarsContainer.contains(e.touches[0].target)) {
      mobileAvatars.forEach((_, index) => onMouseOutAvatar(index, true));
    }
  });

  desktopAvatars.forEach((avatar, index) => {
    avatar.addEventListener("mouseover", () => onMouseOverAvatar(index));
    avatar.addEventListener("mouseout", () => onMouseOutAvatar(index, false));
  });

  mobileAvatars.forEach((avatar, index) => {
    avatar.addEventListener("touchstart", () => onTouchStartAvatar(index));

    const link = avatar.querySelector(".tooltip-link");
    link.addEventListener("click", () => onMouseOutAvatar(index, true));
  });
};

onClassAdded(document.body, "ready", () => {
  avatarInteractivityInit();
});
