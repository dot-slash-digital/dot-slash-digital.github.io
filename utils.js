const wait = async (seconds) =>
  new Promise((_) => setTimeout(_, seconds * 1000));

const isOutsideBounds = (value, [min, max]) => {
  return value < min || value > max;
};

const isOutsideElementBounds = (elementBoundsRect, { x, y }) => {
  const isTooFarLeft = x < elementBoundsRect.left;
  const isTooFarRight = x > elementBoundsRect.right;
  const isTooFarTop = y < elementBoundsRect.top;
  const isTooFarBottom = y > elementBoundsRect.bottom;

  return isTooFarLeft || isTooFarRight || isTooFarTop || isTooFarBottom;
};

const getBoundedValue = (value, [min, max]) => {
  return Math.max(min, Math.min(value, max));
};

const setStyles = (element, stylesObj) => {
  return Object.assign(element.style, stylesObj);
};

const setCssVars = (element, varToValueMap) => {
  Object.entries(varToValueMap).forEach(([varName, value]) => {
    element.style.setProperty(varName, value);
  });
};

const getCssVar = (element, varName) => {
  return getComputedStyle(element).getPropertyValue(varName);
};

const sum = (values) => {
  return values.reduce((total, currentValue) => total + currentValue, 0);
};

const range = (end, start = 0) =>
  [...Array(end).keys()].filter((num) => num >= start);

// e.g. secondsStr = "0.2s"
const convertSecondsToMilliseconds = (secondsStr) => {
  const seconds = parseFloat(secondsStr);
  return seconds * 1000;
};

const roundToDecimalPlace = (value, numPlaces) => {
  return (
    Math.round((value + Number.EPSILON) * Math.pow(10, numPlaces)) /
    Math.pow(10, numPlaces)
  );
};

const getPercentageInRangeFromValue = (value, [start, end]) => {
  return (value - start) / (end - start);
};
