(() => {
  const slug = new URLSearchParams(location.search).get("slug");
  if (slug !== "eksklyuzivnyye_vystavochnyye_stendy") return;

  const init = () => {
    if (document.getElementById("exclusive-top-slider")) return true;

    const excluded = [
      "header",
      "footer",
      "nav",
      ".site-header",
      ".site-footer",
      ".catalog-sidebar",
      ".service-sidebar",
      ".service-menu",
      ".service-tabs",
      ".service-cards",
      ".services-grid",
      ".catalog-grid"
    ].join(",");

    const selectors = [
      ".exclusive-stand-gallery img",
      ".service-gallery img",
      ".gallery img",
      ".portfolio-grid img",
      ".article-gallery img",
      "main img"
    ].join(",");

    const sources = [];
    document.querySelectorAll(selectors).forEach((image) => {
      if (image.closest(excluded)) return;
      const src =
        image.currentSrc ||
        image.getAttribute("src") ||
        image.getAttribute("data-src");
      if (!src || /(?:logo|icon|svg|data:image)/i.test(src)) return;
      if (!sources.includes(src)) sources.push(src);
    });

    if (sources.length < 2) return false;

    const visibleSources = sources.slice(0, 16);
    if (visibleSources.length % 2) visibleSources.push(visibleSources[0]);

    const section = document.createElement("section");
    section.id = "exclusive-top-slider";
    section.className = "exclusive-top-slider";
    section.tabIndex = 0;
    section.setAttribute("aria-label", "Галерея эксклюзивных выставочных стендов");

    const viewport = document.createElement("div");
    viewport.className = "exclusive-top-slider__viewport";
    const track = document.createElement("div");
    track.className = "exclusive-top-slider__track";

    for (let index = 0; index < visibleSources.length; index += 2) {
      const slide = document.createElement("div");
      slide.className = "exclusive-top-slider__slide";

      visibleSources.slice(index, index + 2).forEach((src) => {
        const image = document.createElement("img");
        image.src = src;
        image.alt = "Эксклюзивный выставочный стенд";
        image.loading = index === 0 ? "eager" : "lazy";
        slide.append(image);
      });
      track.append(slide);
    }

    viewport.append(track);
    section.append(viewport);

    const makeArrow = (direction, label, text) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `exclusive-top-slider__arrow exclusive-top-slider__arrow--${direction}`;
      button.setAttribute("aria-label", label);
      button.textContent = text;
      return button;
    };

    const previous = makeArrow("prev", "Предыдущий слайд", "‹");
    const next = makeArrow("next", "Следующий слайд", "›");
    const dots = document.createElement("div");
    dots.className = "exclusive-top-slider__dots";

    const slides = [...track.children];
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "exclusive-top-slider__dot";
      dot.setAttribute("aria-label", `Слайд ${index + 1}`);
      dot.addEventListener("click", () => show(index));
      dots.append(dot);
    });

    section.append(previous, next, dots);

    const header = document.querySelector("header, .site-header, .top-header");
    const main = document.querySelector("main");
    if (header) header.insertAdjacentElement("afterend", section);
    else if (main) main.prepend(section);
    else document.body.prepend(section);

    let current = 0;
    let timer;

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      [...dots.children].forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    };

    const start = () => {
      clearInterval(timer);
      if (slides.length > 1) timer = setInterval(() => show(current + 1), 5000);
    };

    previous.addEventListener("click", () => {
      show(current - 1);
      start();
    });
    next.addEventListener("click", () => {
      show(current + 1);
      start();
    });
    section.addEventListener("mouseenter", () => clearInterval(timer));
    section.addEventListener("mouseleave", start);
    section.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") previous.click();
      if (event.key === "ArrowRight") next.click();
    });

    show(0);
    start();
    return true;
  };

  const boot = () => {
    if (init()) return;
    setTimeout(init, 450);
    setTimeout(init, 1200);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
