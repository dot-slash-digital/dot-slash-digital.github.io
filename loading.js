class ResourceLoader {
  constructor() {
    this.totalResources = 0;
    this.loadedResources = 0;
    this.loadingOverlay = document.getElementById("loading-overlay");
    this.loadingBackground = document.getElementById("loading-background");
  }

  onComplete() {
    setCssVars(this.loadingOverlay, { "--loading-percentage": 1 });

    const deviceType = window.matchMedia("(any-pointer: fine)").matches
      ? "desktop"
      : "mobile";
    document.body.setAttribute("data-device-type", deviceType);

    setTimeout(() => {
      document.body.classList.add("ready");
      window.scrollTo(0, 0);
      this.loadingBackground.classList.add("fade-out");
      setTimeout(() => {
        this.loadingOverlay.style.display = "none";
        this.loadingBackground.style.display = "none";
      }, 1000);
    }, 2000);
  }

  init() {
    this.countResources();
    this.trackResourceLoading();

    // hide loading screen when complete
    window.addEventListener("load", () => {
      this.onComplete();
    });
  }

  countResources() {
    const images = document.getElementsByTagName("img");
    this.totalResources += images.length;

    const stylesheets = document.getElementsByTagName("link");
    this.totalResources += stylesheets.length;

    const scripts = document.getElementsByTagName("script");
    // excludes the current script
    this.totalResources += scripts.length - 1;

    // can't currently detect the number of fonts, so adding it manually
    this.totalResources += 2;
  }

  trackLoading(items, isLoaded) {
    Array.from(items).forEach((item) => {
      if (isLoaded(item)) {
        this.incrementLoaded();
      } else {
        item.addEventListener("load", () => this.incrementLoaded());
        item.addEventListener("error", () => this.incrementLoaded());
      }
    });
  }

  async trackResourceLoading() {
    const fontFaces = Array.from(document.fonts);
    for (const fontFace of fontFaces) {
      try {
        await fontFace.load();
        this.incrementLoaded();
      } catch (error) {
        this.incrementLoaded();
      }
    }

    const images = document.getElementsByTagName("img");
    this.trackLoading(images, (img) => img.complete);

    const stylesheets = document.getElementsByTagName("link");
    this.trackLoading(stylesheets, (link) => link.sheet);

    const scripts = document.getElementsByTagName("script");
    this.trackLoading(
      scripts,
      (script) => script.complete || script.readyState === "complete"
    );
  }

  incrementLoaded() {
    this.loadedResources += 1;
    const percentage = this.loadedResources / this.totalResources;
    setCssVars(this.loadingOverlay, { "--loading-percentage": percentage });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loader = new ResourceLoader();
  loader.init();
});
