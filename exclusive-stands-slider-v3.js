(() => {
  const slug = new URLSearchParams(location.search).get("slug");
  if (slug !== "eksklyuzivnyye_vystavochnyye_stendy") return;

  const init = () => {
    const oldSlider = document.querySelector(".exclusive-stands-slider");
    if (oldSlider) oldSlider.remove();

    const excluded = "header, footer, nav, aside, .site-header, .catalog-sidebar, .service-tabs, .service-cards, .product-grid";
    const images = [...document.querySelectorAll("main img, article img, .gallery img, .service-gallery img")]
      .filter((img) => !img.closest(excluded))
      .map((img) => img.currentSrc || img.src || img.getAttribute("data-src"))
      .filter(Boolean)
      .filter((src, index, all) => all.indexOf(src) === index)
      .slice(0, 16);

    if (images.length < 2) return false;

    const slider = document.createElement("section");
    slider.className = "exclusive-stands-slider";
    slider.id = "exclusive-stands-slider";
    slider.setAttribute("aria-label", "Галерея эксклюзивных выставочных стендов");

    const track = document.createElement("div");
    track.className = "exclusive-stands-slider__track";

    for (let i = 0; i < images.length; i += 2) {
      const slide = document.createElement("div");
      slide.className = "exclusive-stands-slider__slide";
      [images[i], images[i + 1] || images[0]].forEach((src) => {
        const media = document.createElement("div");
        media.className = "exclusive-stands-slider__media";
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Эксклюзивный выставочный стенд";
        img.loading = i === 0 ? "eager" : "lazy";
        media.append(img);
        slide.append(media);
      });
      track.append(slide);
    }

    const prev = document.createElement("button");
    prev.className = "exclusive-stands-slider__arrow exclusive-stands-slider__arrow--prev";
    prev.type = "button";
    prev.ariaLabel = "Предыдущий слайд";
    prev.textContent = "‹";

    const next = document.createElement("button");
    next.className = "exclusive-stands-slider__arrow exclusive-stands-slider__arrow--next";
    next.type = "button";
    next.ariaLabel = "Следующий слайд";
    next.textContent = "›";

    const dots = document.createElement("div");
    dots.className = "exclusive-stands-slider__dots";
    const count = track.children.length;
    let active = 0;

    const show = (index) => {
      active = (index + count) % count;
      track.style.transform = `translateX(-${active * 100}%)`;
      [...dots.children].forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    };

    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement("button");
      dot.className = "exclusive-stands-slider__dot";
      dot.type = "button";
      dot.ariaLabel = `Слайд ${i + 1}`;
      dot.addEventListener("click", () => show(i));
      dots.append(dot);
    }

    prev.addEventListener("click", () => show(active - 1));
    next.addEventListener("click", () => show(active + 1));
    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(active - 1);
      if (event.key === "ArrowRight") show(active + 1);
    });

    slider.append(track, prev, next, dots);
    const header = document.querySelector(".site-header, header");
    if (header?.parentNode) header.insertAdjacentElement("afterend", slider);
    else (document.querySelector("main") || document.body).prepend(slider);

    let timer = setInterval(() => show(active + 1), 5000);
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", () => {
      clearInterval(timer);
      timer = setInterval(() => show(active + 1), 5000);
    });
    show(0);
    return true;
  };

  const boot = () => {
    if (init()) return;
    setTimeout(init, 600);
    setTimeout(init, 1600);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
