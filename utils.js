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
