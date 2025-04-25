const main = document.getElementById("main");

// percentage of the cursor's position relative to the bounds of main
const mainCursorPos = { x: 0, y: 0 };

// TODO: add group for mobile breakpoint
const getGroups = () => {
  const desktopBreakpoint = [
    /* DOTSLASH */
    [0, 1, 2, 3, 4, 5, 6, 7],
    /* DIGITAL */
    [8, 9, 10, 11, 12, 13, 14],
  ];

  return desktopBreakpoint;
};

const getInitMeasurements = () => {
  return [...document.querySelectorAll("#letter-measurement span")].map(
    (letter) => {
      const { height, width } = letter.getBoundingClientRect();
      return { height, width };
    }
  );
};

const getDefaultSizes = (initMeasurements) => {
  const mainSize = main.getBoundingClientRect();
  const groups = getGroups().map((group) =>
    group.map((index) => initMeasurements[index])
  );

  return groups
    .map((group) => {
      const groupWidth = group.reduce(
        (total, current) => total + current.width,
        0
      );

      return group.map((initSize) => {
        const heightPercentage = 1 / groups.length;
        const widthPercentage = initSize.width / groupWidth;
        return {
          // percentage for the block to fill in main section
          heightPercentage,
          widthPercentage,
          // scale needed for the letter to fill the block
          heightScale: (mainSize.height * heightPercentage) / initSize.height,
          widthScale: (mainSize.width * widthPercentage) / initSize.width,
        };
      });
    })
    .flat();
};

const setLetterSizes = (sizes) => {
  const blocks = document.querySelectorAll("#main .block");
  blocks.forEach((block, index) => {
    const letterSize = sizes[index];
    setStyles(block, {
      height: `${letterSize.heightPercentage * 100}%`,
      width: `${letterSize.widthPercentage * 100}%`,
    });
  });
};

const onMouseMove = (event, defaultSizes) => {
  // get cursor pos within main

  const mainRect = main.getBoundingClientRect();
  const x = (event.clientX - mainRect.left) / mainRect.width;
  const y = (event.clientY - mainRect.top) / mainRect.height;

  mainCursorPos.x = Math.max(0, Math.min(1, x));
  mainCursorPos.y = Math.max(0, Math.min(1, y));

  // set block sizes

  const groups = getGroups();
  const blocks = [...main.querySelectorAll(".block")];

  // setting heights
  groups.forEach((group, groupIndex) => {
    const isTopRow = groupIndex === 0;
    group.forEach((index) => {
      const block = blocks[index];
      setStyles(block, {
        height: `${(isTopRow ? mainCursorPos.y : 1 - mainCursorPos.y) * 100}%`,
      });
    });
  });

  // setting widths
  /* my rough attempt at how to make this work

  groups.forEach((group, gi) => {
    const groupWidths = group.map(
      (index) => defaultSizes[index].widthPercentage
    );
    if (gi === 0) {
      console.log("group widths", groupWidths);
    }
    const cumulativeTotals = [];
    groupWidths.forEach((width, index) => {
      const totalSoFar = groupWidths
        .slice(0, index)
        .reduce((total, current) => total + current, 0);
      cumulativeTotals.push(totalSoFar + width);
    });

    const currentGroupIndexPos = cumulativeTotals.findIndex(
      (cumulativeTotal) => cumulativeTotal >= mainCursorPos.x
    );
    const currentIndex = group[currentGroupIndexPos];

    if (currentIndex === undefined) {
      return;
    }

    const indexesLeftOfCurrent = group.slice(0, currentGroupIndexPos);
    const indexesRightOfCurrent = group.slice(currentGroupIndexPos + 1);

    const updatedWidths = [...groupWidths];
    let remainingWidth = 1;
    const usedIndexes = [];
    updatedWidths[currentGroupIndexPos] = groupWidths[currentGroupIndexPos] * 2;
    remainingWidth -= groupWidths[currentGroupIndexPos] * 2;
    usedIndexes.push(currentGroupIndexPos);
    if (indexesLeftOfCurrent.length > 0) {
      updatedWidths[currentGroupIndexPos - 1] =
        groupWidths[currentGroupIndexPos - 1] * 1.5;
      remainingWidth -= groupWidths[currentGroupIndexPos - 1] * 1.5;
      usedIndexes.push(currentGroupIndexPos - 1);
    }
    if (indexesRightOfCurrent.length > 0) {
      updatedWidths[currentGroupIndexPos + 1] =
        groupWidths[currentGroupIndexPos + 1] * 1.5;
      remainingWidth -= groupWidths[currentGroupIndexPos + 1] * 1.5;
      usedIndexes.push(currentGroupIndexPos + 1);
    }

    const unusedIndexesCount = updatedWidths.length - usedIndexes.length;
    updatedWidths.forEach((_, index) => {
      if (usedIndexes.includes(index)) {
        return;
      }

      updatedWidths[index] = remainingWidth / unusedIndexesCount;
    });

    group.forEach((index, groupIndex) => {
      const block = blocks[index];
      setStyles(block, {
        width: `${updatedWidths[groupIndex] * 100}%`,
      });
    });

    if (gi !== 0) {
      console.log("currentIndex", currentIndex);
      console.log("left", indexesLeftOfCurrent);
      console.log("right", indexesRightOfCurrent);
      console.log("updatedWidths", updatedWidths);
    }
  });
  */
};

const init = () => {
  const initMeasurements = getInitMeasurements();
  const sizes = getDefaultSizes(initMeasurements);
  setLetterSizes(sizes);
  document.addEventListener("mousemove", (e) => onMouseMove(e, sizes));
};
init();
