const wait = async (seconds) =>
  new Promise((_) => setTimeout(_, seconds * 1000));

const isOutsideBounds = (value, bounds) => {
  const [min, max] = bounds;
  return value < min || value > max;
};

const getBoundedValue = (value, bounds) => {
  const [min, max] = bounds;
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
  return element.style.getPropertyValue(varName);
};

const sum = (values) => {
  return values.reduce((total, currentValue) => total + currentValue, 0);
};

const range = (end, start = 0) =>
  [...Array(end).keys()].filter((num) => num >= start);
