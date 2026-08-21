(() => {
  const targetSlug = "eksklyuzivnyye_vystavochnyye_stendy";

  function currentSlug() {
    return new URLSearchParams(window.location.search).get("slug") || "";
  }

  function usableImages(root) {
    const seen = new Set();
    const blocked = [
      "header", "footer", "nav", ".site-header", ".site-footer",
      ".catalog-sidebar", ".service-tabs", ".services-strip",
      ".product-card", ".service-card", ".exclusive-stands-slider"
    ].join(",");

    return [...root.querySelectorAll("img")]
      .filter((image) => !image.closest(blocked))
      .map((image) => ({
        src: image.currentSrc || image.src || image.dataset.src || "",
        alt: image.alt || "Эксклюзивный выставочный стенд",
        width: image.naturalWidth || image.width || 0,
        height: image.naturalHeight || image.height || 0
      }))
      .filter((image) => {
        if (!image.src || seen.has(image.src)) return false;
        if (/logo|icon|avatar|marker|client/i.test(image.src)) return false;
        if (image.width && image.height && (image.width < 520 || image.height < 260)) return false;
        seen.add(image.src);
        return true;
      })
      .slice(0, 20);
  }

  function createSlider(images) {
    const section = document.createElement("section");
    section.className = "exclusive-stands-slider";
    section.setAttribute("aria-label", "Галерея эксклюзивных выставочных стендов");

    const viewport = document.createElement("div");
    viewport.className = "exclusive-stands-slider__viewport";

    const track = document.createElement("div");
    track.className = "exclusive-stands-slider__track";

    const pairs = [];
    for (let index = 0; index < images.length; index += 2) {
      pairs.push([images[index], images[index + 1] || images[0]]);
    }

    pairs.forEach((pair, slideIndex) => {
      const slide = document.createElement("div");
      slide.className = "exclusive-stands-slider__slide";
      slide.setAttribute("aria-hidden", slideIndex === 0 ? "false" : "true");

      pair.forEach((item) => {
        const image = document.createElement("img");
        image.className = "exclusive-stands-slider__image";
        image.src = item.src;
        image.alt = item.alt;
        image.loading = slideIndex === 0 ? "eager" : "lazy";
        image.decoding = "async";
        slide.append(image);
      });
      track.append(slide);
    });

    viewport.append(track);
    section.append(viewport);

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "exclusive-stands-slider__arrow exclusive-stands-slider__arrow--prev";
    prev.setAttribute("aria-label", "Предыдущий слайд");

    const next = document.createElement("button");
    next.type = "button";
    next.className = "exclusive-stands-slider__arrow exclusive-stands-slider__arrow--next";
    next.setAttribute("aria-label", "Следующий слайд");

    const dots = document.createElement("div");
    dots.className = "exclusive-stands-slider__dots";
    pairs.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `exclusive-stands-slider__dot${index === 0 ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Слайд ${index + 1}`);
      dots.append(dot);
    });

    section.append(prev, next, dots);

    let active = 0;
    let timer = 0;
    let pointerStart = null;
    const slides = [...track.children];
    const dotButtons = [...dots.children];

    function show(index) {
      active = (index + slides.length) % slides.length;
      track.style.transform = `translate3d(${-active * 100}%, 0, 0)`;
      slides.forEach((slide, slideIndex) => {
        slide.setAttribute("aria-hidden", slideIndex === active ? "false" : "true");
      });
      dotButtons.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function stop() {
      window.clearInterval(timer);
    }

    function play() {
      stop();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = window.setInterval(() => show(active + 1), 5200);
      }
    }

    prev.addEventListener("click", () => {
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

    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", play);
    section.addEventListener("pointerdown", (event) => {
      pointerStart = event.clientX;
    });
    section.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;
      const delta = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(delta) > 45) show(active + (delta < 0 ? 1 : -1));
      play();
    });

    play();
    return section;
  }

  function mount() {
    if (currentSlug() !== targetSlug) return;

    document.querySelectorAll(".exclusive-stands-slider").forEach((node) => node.remove());

    const main = document.querySelector("main") || document.querySelector(".service-main");
    if (!main) return;

    const images = usableImages(main);
    if (images.length < 2) return;

    main.prepend(createSlider(images));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.setTimeout(mount, 450));
  } else {
    window.setTimeout(mount, 450);
  }
  window.addEventListener("load", () => window.setTimeout(mount, 250), { once: true });
})();
