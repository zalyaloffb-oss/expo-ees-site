(() => {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (slug !== "eksklyuzivnyye_vystavochnyye_stendy") return;

  const init = () => {
    if (document.querySelector(".ees-ex-slider")) return;

    const main = document.querySelector("main");
    if (!main) return;

    const selectors = [
      'main [class*="gallery"] img',
      'main [class*="project"] img',
      'main [class*="stand"] img',
      "main article img",
      "main img"
    ];
    const excluded = /logo|icon|client|partner|map|avatar/i;
    const seen = new Set();
    const images = [...document.querySelectorAll(selectors.join(","))]
      .map((image) => ({
        src: image.currentSrc || image.src || image.dataset.src,
        alt: image.alt || "Эксклюзивный выставочный стенд"
      }))
      .filter((image) => {
        if (!image.src || excluded.test(image.src) || image.src.startsWith("data:")) return false;
        if (seen.has(image.src)) return false;
        seen.add(image.src);
        return true;
      });

    if (images.length < 2) return;

    const root = document.createElement("section");
    root.className = "ees-ex-slider";
    root.setAttribute("aria-label", "Галерея эксклюзивных выставочных стендов");

    const viewport = document.createElement("div");
    viewport.className = "ees-ex-slider__viewport";
    const track = document.createElement("div");
    track.className = "ees-ex-slider__track";
    viewport.append(track);

    const pages = [];
    for (let index = 0; index < images.length; index += 2) {
      const page = document.createElement("div");
      page.className = "ees-ex-slider__slide";
      [images[index], images[index + 1] || images[0]].forEach((item) => {
        const image = document.createElement("img");
        image.className = "ees-ex-slider__image";
        image.src = item.src;
        image.alt = item.alt;
        image.loading = index === 0 ? "eager" : "lazy";
        page.append(image);
      });
      pages.push(page);
      track.append(page);
    }

    const makeArrow = (direction, label, symbol) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ees-ex-slider__arrow ees-ex-slider__arrow--${direction}`;
      button.setAttribute("aria-label", label);
      button.textContent = symbol;
      return button;
    };
    const previous = makeArrow("prev", "Предыдущий слайд", "‹");
    const next = makeArrow("next", "Следующий слайд", "›");

    const dots = document.createElement("div");
    dots.className = "ees-ex-slider__dots";
    const dotButtons = pages.map((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ees-ex-slider__dot";
      button.setAttribute("aria-label", `Слайд ${index + 1}`);
      dots.append(button);
      return button;
    });

    root.append(viewport, previous, next, dots);
    main.prepend(root);

    let active = 0;
    let timer;
    const show = (index) => {
      active = (index + pages.length) % pages.length;
      track.style.transform = `translateX(-${active * 100}%)`;
      dotButtons.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    };
    const stop = () => window.clearInterval(timer);
    const play = () => {
      stop();
      timer = window.setInterval(() => show(active + 1), 5500);
    };

    previous.addEventListener("click", () => {
      show(active - 1);
      play();
    });
    next.addEventListener("click", () => {
      show(active + 1);
      play();
    });
    dotButtons.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        show(index);
        play();
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(active - 1);
      if (event.key === "ArrowRight") show(active + 1);
    });

    show(0);
    play();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
