const footerScrollInit = () => {
  const main = document.getElementById("main");
  window.addEventListener("scroll", (event) => {
    setCssVars(main, { "--scroll-amount": `${window.scrollY}px` });
  });
};

footerScrollInit();
