const avatars = [...document.querySelectorAll("#footer .avatar")];
const textLeft = document.querySelector("#footer .right-col .text-left");
const textRight = document.querySelector("#footer .right-col .text-right");

const getAvatar = (avatarIndex) => {
  const avatar = avatars[avatarIndex];
  const isLeft = avatarIndex === 0;

  return {
    avatar: avatar.querySelector("img"),
    isLeft,
    otherAvatar: avatars[isLeft ? 1 : 0].querySelector("img"),
    tooltip: avatar.querySelector(".tooltip"),
  };
};

const onMouseOverAvatar = (avatarIndex) => {
  const { avatar, isLeft, otherAvatar, tooltip } = getAvatar(avatarIndex);

  // enlarge hovered avatar and shift surrounding elements
  setStyles(avatar, { transform: "scale(var(--hover-scale))" });
  setStyles(otherAvatar, {
    transform: `translateX(calc(var(--hover-translate) * ${isLeft ? 1 : -1}))`,
  });
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

const onMouseOutAvatar = (avatarIndex) => {
  const { avatar, otherAvatar, tooltip } = getAvatar(avatarIndex);

  // reset elements
  setStyles(avatar, { transform: "translateX(0px) scale(1)" });
  setStyles(otherAvatar, { transform: "translateX(0px) scale(1)" });
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
  }, 200);
};

const avatarInteractivityInit = () => {
  avatars.forEach((avatar, index) => {
    avatar.addEventListener("mouseover", () => onMouseOverAvatar(index));
    avatar.addEventListener("mouseout", () => onMouseOutAvatar(index));
  });
};
avatarInteractivityInit();
