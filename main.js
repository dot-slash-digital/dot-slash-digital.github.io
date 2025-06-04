const MIN_FONT_SIZE = 24;
const CURSOR_PRECISION = 5;
const startTime = Date.now();

const getElements = (type) => {
  const main = document.getElementById("main");

  const visualContainer = document.querySelector(
    `.text-pressure-title.${type}.visual`
  );
  const calcContainer = document.querySelector(
    `.text-pressure-title.${type}.calc`
  );
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
  return oldValue / newValue;
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
    x: sectionRect.x,
    y: sectionRect.y,
  };
  const cursor = {
    x: sectionRect.x,
    y: sectionRect.y,
    isOutside: true,
  };

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
    const timeDiff = Math.abs(startTime - Date.now());
    const gradual = timeDiff < 3000 ? (1 - timeDiff / 3000) * 5 * 15 : 15;

    mouse.x += roundToDecimalPlace(
      (cursor.x - mouse.x) / gradual,
      CURSOR_PRECISION
    );
    mouse.y += roundToDecimalPlace(
      (cursor.y - mouse.y) / gradual,
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

      const wdth = getWdthVariation(
        maxDist.x,
        cursor.isOutside ? maxDist.x : distX,
        25,
        150
      );
      setStyles(charSpan, { fontVariationSettings: `'wdth' ${wdth}` });
      setStyles(calcCharSpans[index], {
        fontVariationSettings: `'wdth' ${wdth}`,
      });
    });

    const wdthVariationTotal = sum(
      calcCharSpans.map((ccs) => ccs.getBoundingClientRect().width)
    );
    const scaleX = sectionRect.width / wdthVariationTotal;

    if (type === "top") {
      const yPos =
        getBoundedValue(mouse.y, [sectionRect.top, sectionRect.bottom]) -
        sectionRect.top;
      const yPosPerc = yPos / sectionRect.height;
      const abc = Math.sqrt(1 - yPosPerc) * 0.8 + 0.1;
      const yPercPx = abc * sectionRect.height;

      const scaleY = getScale(
        yPercPx,
        calcContainer.getBoundingClientRect().height
      );
      setStyles(visualContainer, {
        transform: `translate(0px, 0px) scale(${scaleX}, ${scaleY})`,
      });
    } else if (type === "bottom") {
      const topElement = document.querySelector(
        `.text-pressure-title.top.visual`
      );
      const topElementHeight = topElement.getBoundingClientRect().height;
      const calcContainerHeight = calcContainer.getBoundingClientRect().height;
      const scaleY = getScale(
        sectionRect.height - topElementHeight,
        calcContainerHeight
      );
      setStyles(visualContainer, {
        transform: `translate(0px, ${topElementHeight}px) scale(${scaleX}, ${scaleY})`,
      });
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", setSize);
  document.addEventListener("scroll", setSize);
  setSize();
  animate();
};

// wait until all fonts have been loaded
document.fonts.ready.then(() => {
  initTextPressure("top");
  initTextPressure("bottom");
});
