const INIT_WIDTH_ATTRIBUTE = "data-init-width";
const MIN_FONT_WEIGHT = 100;
const MAX_FONT_WEIGHT = 900;
const DEFAULT_FONT_WEIGHT = 600;

const splitLetters = (element) => {
  const { width } = element.getBoundingClientRect();
  const elementText = element.textContent || "";
  const letters = elementText.split("");

  element.innerHTML = "";

  letters.forEach((letter) => {
    const letterElement = document.createElement("span");
    letterElement.textContent = letter;
    element.appendChild(letterElement);
    letterElement.setAttribute(
      INIT_WIDTH_ATTRIBUTE,
      letterElement.getBoundingClientRect().width
    );
  });
  setStyles(element, { width: `${width}px` });
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

const setTransform = (
  element,
  { fontWeight, xPosition, yPosition, xScale, yScale } = {}
) => {
  setStyles(element, {
    fontWeight: getBoundedValue(fontWeight ?? DEFAULT_FONT_WEIGHT, [
      MIN_FONT_WEIGHT,
      MAX_FONT_WEIGHT,
    ]),
    transform: `translate3d(${xPosition ?? 0}px, ${
      yPosition ?? 0
    }px, 0px) scale(${xScale ?? 1}, ${yScale ?? 1})`,
  });
};

const setInitLetterPositions = (letterElements) => {
  const prevLetterElementWidths = [];
  letterElements.forEach((letterElement) => {
    const prevWidthsTotal = sum(prevLetterElementWidths);
    setTransform(letterElement, { xPosition: prevWidthsTotal });
    prevLetterElementWidths.push(letterElement.getBoundingClientRect().width);
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

const onMouseMoveEmailText = (event, element) => {
  const { clientX: cursorX, clientY: cursorY } = event;
  const letterElements = [...element.childNodes];

  if (!isWithinElement(cursorX, cursorY, element)) {
    setInitLetterPositions(letterElements);
    return;
  }

  const hoveredLetterIndex = letterElements.findIndex((letterElement) =>
    isWithinElement(cursorX, cursorY, letterElement)
  );
  const hoveredLetterElement = letterElements[hoveredLetterIndex];

  const transformations = range(letterElements.length).map((_) => ({}));

  // add scaling to hovered letter
  if (hoveredLetterElement) {
    const { scale: hoveredLetterXScale, percentageDistanceFromElementCenter } =
      getScaleValue(hoveredLetterElement, cursorX, 2, undefined, 0.3);
    transformations[hoveredLetterIndex].xScale = hoveredLetterXScale;
    transformations[hoveredLetterIndex].fontWeight = MAX_FONT_WEIGHT;

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

    // add scaling to letter left of hovered
    leftLetters.forEach(({ element, index: letterIndex }, listIndex) => {
      const fontWeight =
        MAX_FONT_WEIGHT -
        Math.round(
          ((listIndex + 1) / (letterElements.length / 2)) *
            (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT)
        );
      const { scale } = getScaleValue(
        element,
        cursorX,
        2 - (listIndex + 1) * 0.1,
        percentageDistanceFromElementCenter,
        percentageDistanceFromElementCenter < 0 ? 0.3 : 0
      );

      transformations[letterIndex].fontWeight = fontWeight;
      transformations[letterIndex].xScale = scale;
    });

    // add scaling to letter right of hovered
    rightLetters.forEach(({ element, index: letterIndex }, listIndex) => {
      const fontWeight =
        MAX_FONT_WEIGHT -
        Math.round(
          ((listIndex + 1) / (letterElements.length / 2)) *
            (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT)
        );
      const { scale } = getScaleValue(
        element,
        cursorX,
        2 - (listIndex + 1) * 0.1,
        percentageDistanceFromElementCenter,
        percentageDistanceFromElementCenter > 0 ? 0.3 : 0
      );

      transformations[letterIndex].fontWeight = fontWeight;
      transformations[letterIndex].xScale = scale;
    });
  }

  // calculate letter positions
  letterElements.forEach((letterElement, index) => {
    const prevLetterElementWidths = transformations.map(
      (transformation) => transformation.width ?? 0
    );

    transformations[index].width = letterElement.getBoundingClientRect().width;
    transformations[index].xPosition = sum(prevLetterElementWidths);
  });

  // apply transformations for each letter
  transformations.forEach((transformation, index) => {
    const letterElement = letterElements[index];

    setTransform(letterElement, {
      fontWeight: transformation.fontWeight,
      xPosition: transformation.xPosition,
      xScale: transformation.xScale,
    });
  });
};

const textStretchingInit = () => {
  const element = document.getElementById("email");
  splitLetters(element);
  setInitLetterPositions([...element.childNodes]);

  window.addEventListener("mousemove", (e) => onMouseMoveEmailText(e, element));
};

// wait until fonts are all loaded
document.fonts.ready.then(() => textStretchingInit());
