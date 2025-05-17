const main = document.getElementById("main");

const footerScrollInit = () => {
  window.addEventListener("scroll", (event) => {
    setCssVars(main, { "--scroll-amount": `${window.scrollY}px` });
  });
};

footerScrollInit();
