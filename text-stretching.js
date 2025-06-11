const INIT_WIDTH_ATTRIBUTE = "data-init-width";
const MIN_FONT_WEIGHT = 100;
const MAX_FONT_WEIGHT = 900;
const DEFAULT_FONT_WEIGHT = 500;
let isAnimating = false;

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

const resetFontWeights = (letterElements) => {
  letterElements.forEach((letterElement) => {
    setFontWeight(letterElement, DEFAULT_FONT_WEIGHT);
  });
};

const onTextStretchingMouseMove = (event, element, letterElements) => {
  const { clientX: cursorX, clientY: cursorY } = event;

  // reset font weights if cursor is outside the element
  if (!isWithinElement(cursorX, cursorY, element) || isAnimating) {
    resetFontWeights(letterElements);
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

const textStretchingInit = (element) => {
  splitLetters(element);
  const letterElements = [...element.childNodes];

  window.addEventListener("mousemove", (e) =>
    onTextStretchingMouseMove(e, element, letterElements)
  );
};

const alphabet = "abcdefghijklmnopqrstuvwxyz!@#$%&?";
const originalEmailText = "hi@dotslashdigital.com";
const linkCopiedText = "---  link copied!  ---";

const getRandomChar = () => {
  const index = Math.floor(Math.random() * alphabet.length);
  return alphabet[index];
};

const onEmailLinkClick = async (element) => {
  if (isAnimating) {
    return;
  }

  const letterElements = [...element.childNodes];
  isAnimating = true;

  resetFontWeights(letterElements);

  for (const i of range(6)) {
    letterElements.forEach((letterElement) => {
      letterElement.textContent = getRandomChar();
    });
    await wait(0.1);
  }

  letterElements.forEach((letterElement, index) => {
    letterElement.textContent = linkCopiedText[index];
  });

  // copy to clipboard, with fallback for localhost / old browsers
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(originalEmailText);
    } else {
      const input = document.createElement("input");
      input.style.opacity = "0";
      input.style.position = "fixed";
      input.value = originalEmailText;
      document.body.appendChild(input);

      input.focus();
      input.setSelectionRange(0, input.value.length);
      document.execCommand("copy");

      input.remove();
    }
  } catch (error) {
    console.error("Failed to copy text", error);
  }
  await wait(2);

  for (const i of range(3)) {
    letterElements.forEach((letterElement) => {
      letterElement.textContent = getRandomChar();
    });
    await wait(0.1);
  }

  letterElements.forEach((letterElement, index) => {
    letterElement.textContent = originalEmailText[index];
  });

  isAnimating = false;
};

onClassAdded(document.getElementById("main"), "ready", () => {
  const element = document.getElementById("email");
  textStretchingInit(element);
  element.addEventListener("click", () => onEmailLinkClick(element));
});
