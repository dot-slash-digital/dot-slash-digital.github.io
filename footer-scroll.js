const footerScrollInit = () => {
  const main = document.getElementById("main");
  window.addEventListener("scroll", () => {
    setCssVars(main, { "--scroll-amount": `${window.scrollY}px` });
  });
};

onClassAdded(document.body, "ready", () => {
  footerScrollInit();
});
