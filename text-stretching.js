const INIT_WIDTH_ATTRIBUTE = "data-init-width";
const MIN_FONT_WEIGHT = 100;
const MAX_FONT_WEIGHT = 900;
const DEFAULT_FONT_WEIGHT = 500;

const splitLetters = (element) => {
  const elementText = element.textContent || "";
  const letters = elementText.split("");

  element.innerHTML = "";

  letters.forEach((letter) => {
    const letterElement = document.createElement("span");
    letterElement.textContent = letter;
    element.appendChild(letterElement);
  });
};

const isWithinElement = (cursorX, cursorY, element) => {
  const elementBounds = element.getBoundingClientRect();
  return (
    cursorX >= elementBounds.left &&
    cursorX <= elementBounds.right &&
    cursorY >= elementBounds.top &&
    cursorY <= elementBounds.bottom
  );
};

const setFontWeight = (element, fontWeight) => {
  setStyles(element, {
    fontWeight: getBoundedValue(fontWeight ?? DEFAULT_FONT_WEIGHT, [
      MIN_FONT_WEIGHT,
      MAX_FONT_WEIGHT,
    ]),
  });
};

const getScaleValue = (
  element,
  cursorX,
  baseScale,
  percentageDistance,
  distanceScalar
) => {
  const { left, right } = element.getBoundingClientRect();

  // percentage that the cursor is within the element's x axis
  const xPercentage = (cursorX - left) / (right - left);
  // converts 0.0-1.0 to -1.0 - +1.0
  const percentageDistanceFromElementCenter =
    percentageDistance ?? xPercentage - 0.5;

  return {
    scale:
      baseScale +
      Math.abs(percentageDistanceFromElementCenter) * distanceScalar,
    percentageDistanceFromElementCenter,
  };
};

const onTextStretchingMouseMove = (event, element) => {
  const { clientX: cursorX, clientY: cursorY } = event;
  const letterElements = [...element.childNodes];

  // reset font weights if cursor is outside the element
  if (!isWithinElement(cursorX, cursorY, element)) {
    letterElements.forEach((letterElement) => {
      setFontWeight(letterElement, DEFAULT_FONT_WEIGHT);
    });
    return;
  }

  const hoveredLetterIndex = letterElements.findIndex((letterElement) =>
    isWithinElement(cursorX, cursorY, letterElement)
  );
  const hoveredLetterElement = letterElements[hoveredLetterIndex];

  const fontWeights = range(letterElements.length).map((_) => undefined);

  // add scaling to hovered letter and surrounding letters
  if (hoveredLetterElement) {
    fontWeights[hoveredLetterIndex] = MAX_FONT_WEIGHT;

    const leftLetters = [];
    const rightLetters = [];
    letterElements.forEach((letterElement, index) => {
      // insert left letters in reverse
      if (index < hoveredLetterIndex) {
        leftLetters.unshift({ element: letterElement, index });
      } else if (index > hoveredLetterIndex) {
        rightLetters.push({ element: letterElement, index });
      }
    });

    // add scaling to letters left of hovered
    leftLetters.forEach(({ index: letterIndex }, listIndex) => {
      const fontWeight =
        MAX_FONT_WEIGHT -
        Math.round(
          ((listIndex + 1) / (letterElements.length / 2)) *
            (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT)
        );

      fontWeights[letterIndex] = fontWeight;
    });

    // add scaling to letters right of hovered
    rightLetters.forEach(({ index: letterIndex }, listIndex) => {
      const fontWeight =
        MAX_FONT_WEIGHT -
        Math.round(
          ((listIndex + 1) / (letterElements.length / 2)) *
            (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT)
        );

      fontWeights[letterIndex] = fontWeight;
    });
  }

  // apply font weight transformations for each letter
  fontWeights.forEach((fontWeight, index) => {
    setFontWeight(letterElements[index], fontWeight);
  });
};

const textStretchingInit = () => {
  const element = document.getElementById("email");
  splitLetters(element);

  window.addEventListener("mousemove", (e) =>
    onTextStretchingMouseMove(e, element)
  );
};

// wait until fonts are all loaded
document.fonts.ready.then(() => textStretchingInit());
