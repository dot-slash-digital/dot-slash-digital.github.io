const MIN_FONT_SIZE = 24;
const CURSOR_PRECISION = 5;
const GAP = 8;
const MIN_WDTH = 25;
const MAX_WDTH = 150;
const START_TIME = Date.now();
const GRADUAL_INTRO_SECONDS = 2.5;
const TEXT = {
  desktop: {
    top: "DOTSLASH",
    bottom: "DIGITAL",
  },
  mobile: {
    top: "DOT",
    bottom: "SLASH",
  },
};
const DEFAULT_WDTH = parseInt(
  getCssVar(document.getElementById("main"), "--default-wdth")
);

const initText = () => {
  const viewport = window.matchMedia("(any-pointer: fine)").matches
    ? "desktop"
    : "mobile";
  const main = document.getElementById("main");

  ["top", "bottom"].forEach((type) => {
    const visualContainer = main.querySelector(
      `.text-pressure-title.${type}.visual`
    );
    const calcContainer = main.querySelector(
      `.text-pressure-title.${type}.calc`
    );

    TEXT[viewport][type].split("").forEach((char) => {
      [visualContainer, calcContainer].forEach((container) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.setAttribute("data-char", char);
        container.appendChild(span);
      });
    });
  });
};

const getElements = (type) => {
  const main = document.getElementById("main");

  const visualContainer = main.querySelector(
    `.text-pressure-title.${type}.visual`
  );
  const calcContainer = main.querySelector(`.text-pressure-title.${type}.calc`);
  const charSpans = [...visualContainer.querySelectorAll("span")];
  const calcCharSpans = [...calcContainer.querySelectorAll("span")];
  const text = charSpans.map((cs) => cs.getAttribute("data-char")).join("");
  const chars = text.split("");

  return {
    main,
    visualContainer,
    calcContainer,
    charSpans,
    calcCharSpans,
    chars,
  };
};

const getWdthVariation = (maxDist, distance, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return getBoundedValue(val + minVal, [minVal, maxVal]);
};

const getScale = (oldValue, newValue) => {
  return newValue / oldValue;
};

const initTextPressure = (type) => {
  const {
    main,
    visualContainer,
    calcContainer,
    charSpans,
    calcCharSpans,
    chars,
  } = getElements(type);
  let sectionRect = main.getBoundingClientRect();

  const mouse = {
    x: sectionRect.width / 2,
    y: sectionRect.height / 2,
  };
  const cursor = {
    x: sectionRect.width / 2,
    y: sectionRect.height / 2,
    isOutside: false,
  };
  const charWdths = charSpans.map((_) => DEFAULT_WDTH);

  window.addEventListener("mousemove", (e) => {
    const isOutside = isOutsideElementBounds(sectionRect, {
      x: e.clientX,
      y: e.clientY,
    });

    cursor.x = e.clientX;
    cursor.y = e.clientY;
    cursor.isOutside = isOutside;
  });
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      cursor.x = t.clientX;
      cursor.y = t.clientY;
    },
    { passive: false }
  );

  // on viewport resize
  function setSize() {
    // recalculate bounds
    sectionRect = main.getBoundingClientRect();

    // set font size
    const fontSize = Math.max(
      sectionRect.width / (chars.length / 2),
      MIN_FONT_SIZE
    );
    setStyles(visualContainer, { fontSize: `${fontSize}px` });
    setStyles(calcContainer, { fontSize: `${fontSize}px` });
  }

  // animation loop
  function animate() {
    const timeDiff = Math.abs(START_TIME - Date.now());
    const timeRemaining = getBoundedValue(
      1 - timeDiff / (GRADUAL_INTRO_SECONDS * 1000),
      [0, 1]
    );
    const gradual = 15 + Math.pow(timeRemaining * 75, 2);

    mouse.x += roundToDecimalPlace(
      (cursor.x - mouse.x) / gradual,
      CURSOR_PRECISION
    );
    mouse.y += roundToDecimalPlace(
      (cursor.y - mouse.y) / (gradual * 0.5),
      CURSOR_PRECISION
    );

    const maxDist = {
      x: sectionRect.width / 2,
      y: sectionRect.height / 2,
    };

    charSpans.forEach((charSpan, index) => {
      const rect = charSpan.getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;
      const distX = centerX - mouse.x;

      const prevWdth = charWdths[index];
      const newWdth = cursor.isOutside
        ? DEFAULT_WDTH
        : getWdthVariation(maxDist.x, distX, MIN_WDTH, MAX_WDTH);
      // negative = getting smaller
      // positive = getting larger
      const gradualDiff = (newWdth - prevWdth) / gradual;
      const wdth = getBoundedValue(prevWdth + gradualDiff, [
        MIN_WDTH,
        MAX_WDTH,
      ]);

      charWdths[index] = wdth;
      setStyles(charSpan, { fontVariationSettings: `'wdth' ${wdth}` });
      setStyles(calcCharSpans[index], {
        fontVariationSettings: `'wdth' ${wdth}`,
      });
    });

    const wdthVariationTotal = sum(
      calcCharSpans.map((ccs) => ccs.getBoundingClientRect().width)
    );
    const scaleX = sectionRect.width / wdthVariationTotal;

    const topElement = document.querySelector(
      `.text-pressure-title.top.visual`
    );
    const prevTopHeight = topElement.getBoundingClientRect().height;

    if (cursor.isOutside) {
      const topTargetHeight = sectionRect.height * 0.5 - GAP;
      const topGradualDifference = (prevTopHeight - topTargetHeight) / gradual;
      const topNewHeight = prevTopHeight - topGradualDifference;
      const scaleY = getScale(
        calcContainer.getBoundingClientRect().height,
        type === "top" ? topNewHeight : sectionRect.height - topNewHeight - GAP
      );
      const translateY = type === "top" ? 0 : topNewHeight + GAP;
      setStyles(visualContainer, {
        transform: `translate(0px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
      });
    } else if (type === "top") {
      const yPos =
        getBoundedValue(mouse.y, [sectionRect.top, sectionRect.bottom]) -
        sectionRect.top;

      const yPosPercFromCenter =
        (yPos - sectionRect.height / 2) / (sectionRect.height / 2);
      const scaledYPosPx =
        sectionRect.height / 2 +
        yPosPercFromCenter * 0.8 * (sectionRect.height / 2);
      const newHeight = sectionRect.height - scaledYPosPx;

      const trueHeight = calcContainer.getBoundingClientRect().height;
      const defaultHeight = sectionRect.height * 0.5;
      const gradualDiffHeight = (newHeight - prevTopHeight) / gradual;

      const initScaleY = getScale(trueHeight, defaultHeight);
      const scaleY = getScale(
        defaultHeight,
        getBoundedValue(prevTopHeight + gradualDiffHeight, [
          sectionRect.height * 0.1,
          sectionRect.height * 0.9,
        ])
      );
      setStyles(visualContainer, {
        transform: `scale(1, ${initScaleY}) translate(0px, 0px) scale(${scaleX}, ${scaleY})`,
      });
    } else if (type === "bottom") {
      const scaleY = getScale(
        calcContainer.getBoundingClientRect().height,
        sectionRect.height - prevTopHeight - GAP
      );
      setStyles(visualContainer, {
        transform: `translate(0px, ${
          prevTopHeight + GAP
        }px) scale(${scaleX}, ${scaleY})`,
      });
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", setSize);
  window.addEventListener("scroll", setSize);
  setSize();

  // setting initial size of top and bottom
  const topElement = document.querySelector(`.text-pressure-title.top.calc`);
  const topHeight = topElement.getBoundingClientRect().height;
  setStyles(visualContainer, {
    transform: `scale(1, ${getScale(
      topHeight,
      sectionRect.height * 0.5 - GAP
    )}) translate(0px, 0px) scale(1, 1)`,
  });

  animate();
};

// wait until all fonts have been loaded
document.fonts.ready.then(() => {
  initText();
  initTextPressure("top");
  initTextPressure("bottom");
});
