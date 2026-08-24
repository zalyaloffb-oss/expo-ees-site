
function initPortfolioNavScroller() {
  document.querySelectorAll("[data-scroll-nav]").forEach((shell) => {
    const nav = shell.querySelector(".portfolio-project-nav");
    const arrows = shell.querySelectorAll("[data-scroll-direction]");
    if (!nav || !arrows.length) return;

    arrows.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        nav.scrollBy({ left: Number(arrow.dataset.scrollDirection || 0) * 460, behavior: "smooth" });
      });
    });

    nav.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      nav.scrollLeft += event.deltaY;
    }, { passive: false });
  });
}

function initPortfolioLightbox() {
  const images = [...document.querySelectorAll(".portfolio-project-gallery img")];
  if (!images.length || document.querySelector(".portfolio-lightbox")) return;

  const items = images.map((image) => {
    const project = image.closest(".portfolio-project");
    const title = project?.querySelector(".portfolio-project-head h2")?.textContent?.trim() || image.alt || "";
    return {
      image,
      src: image.currentSrc || image.src,
      title,
      alt: image.alt || title
    };
  });

  const lightbox = document.createElement("div");
  lightbox.className = "portfolio-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="portfolio-lightbox-close" type="button" aria-label="Закрыть просмотр">×</button>
    <button class="portfolio-lightbox-arrow portfolio-lightbox-prev" type="button" aria-label="Предыдущее фото"></button>
    <figure>
      <img src="" alt="">
      <figcaption>
        <strong></strong>
        <span></span>
      </figcaption>
    </figure>
    <button class="portfolio-lightbox-arrow portfolio-lightbox-next" type="button" aria-label="Следующее фото"></button>
  `;
  document.body.appendChild(lightbox);

  const preview = lightbox.querySelector("img");
  const captionTitle = lightbox.querySelector("strong");
  const captionMeta = lightbox.querySelector("span");
  const closeButton = lightbox.querySelector(".portfolio-lightbox-close");
  const prevButton = lightbox.querySelector(".portfolio-lightbox-prev");
  const nextButton = lightbox.querySelector(".portfolio-lightbox-next");
  let activeIndex = 0;

  const show = (index) => {
    activeIndex = (index + items.length) % items.length;
    const item = items[activeIndex];
    preview.src = item.src;
    preview.alt = item.alt;
    captionTitle.textContent = item.title;
    captionMeta.textContent = `${activeIndex + 1} / ${items.length}`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-lightbox-open");
    closeButton.focus({ preventScroll: true });
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-lightbox-open");
    images[activeIndex]?.focus({ preventScroll: true });
  };

  const move = (step) => show(activeIndex + step);

  items.forEach((item, index) => {
    item.image.classList.add("is-lightbox-ready");
    item.image.tabIndex = 0;
    item.image.setAttribute("role", "button");
    item.image.setAttribute("aria-label", `Открыть фото: ${item.title}`);
    item.image.addEventListener("click", () => show(index));
    item.image.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      show(index);
    });
  });

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}

function initArticleYearFilter() {
  const filter = document.querySelector(".article-year-filter");
  if (!filter) return;
  const buttons = [...filter.querySelectorAll("[data-article-year]")];
  const cards = [...document.querySelectorAll(".article-card[data-year]")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const year = button.dataset.articleYear;
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      cards.forEach((card) => {
        card.hidden = year !== "all" && card.dataset.year !== year;
      });
    });
  });
}

initPortfolioNavScroller();
initPortfolioLightbox();
initArticleYearFilter();

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

const phoneMenus = [...document.querySelectorAll(".phone-menu")];
phoneMenus.forEach((menu) => {
  const trigger = menu.querySelector(".phone-trigger");
  trigger?.addEventListener("click", (event) => {
    event.preventDefault();
    phoneMenus.forEach((item) => {
      if (item !== menu) item.classList.remove("is-open");
    });
    menu.classList.toggle("is-open");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".phone-menu")) {
    phoneMenus.forEach((menu) => menu.classList.remove("is-open"));
  }
});

function initMobileServiceMenu() {
  const servicesGroup = document.querySelector(".main-nav > .nav-group:first-child");
  const servicesTrigger = servicesGroup?.querySelector(":scope > .nav-trigger");
  const servicesMenu = servicesGroup?.querySelector(":scope > .nav-mega");
  if (!servicesGroup || !servicesTrigger || !servicesMenu) return;

  servicesTrigger.setAttribute("aria-expanded", "false");

  servicesTrigger.addEventListener("click", (event) => {
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    event.preventDefault();
    const isOpen = servicesGroup.classList.toggle("is-open");
    servicesTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  [...servicesMenu.querySelectorAll(".nav-column")].forEach((column, index) => {
    if (![1, 2, 3].includes(index)) return;
    const heading = column.querySelector(":scope > span");
    if (!heading) return;
    heading.setAttribute("role", "button");
    heading.setAttribute("tabindex", "0");
    heading.setAttribute("aria-expanded", "false");

    const toggleColumn = () => {
      if (!window.matchMedia("(max-width: 640px)").matches) return;
      const isOpen = column.classList.toggle("is-open");
      heading.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    heading.addEventListener("click", toggleColumn);
    heading.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleColumn();
    });
  });
}

initMobileServiceMenu();

const homeSlider = document.querySelector("[data-home-slider]");
if (homeSlider) {
  const slides = [...homeSlider.querySelectorAll(".home-slide")];
  const dots = [...homeSlider.querySelectorAll(".home-slider-dots button")];
  const tabs = [...homeSlider.querySelectorAll("[data-home-tab]")];
  const prev = homeSlider.querySelector(".home-slider-prev");
  const next = homeSlider.querySelector(".home-slider-next");
  const heading = homeSlider.querySelector(".home-slider-content h1");
  const lead = homeSlider.querySelector(".home-slider-content .lead");
  let activeSlide = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let homeSliderDirection = 1;
  let sliderTimer;
  let isHomeSliderAnimating = false;

  function updateHomeTabTravel() {
    if (!tabs.length) return;
    const tabWidth = tabs[0].offsetWidth || 74;
    const travel = Math.max(0, homeSlider.clientWidth - tabWidth * tabs.length);
    tabs.forEach((tab, tabIndex) => {
      tab.style.setProperty("--tab-index", tabIndex);
      tab.style.setProperty("--tabs-total", tabs.length);
      tab.style.setProperty("--tab-right", `${(tabs.length - 1 - tabIndex) * tabWidth}px`);
      tab.style.setProperty("--tab-shift", `${-travel}px`);
    });
  }

  function updateHomeSliderMeta() {
    updateHomeTabTravel();
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeSlide);
    });
    tabs.forEach((tab, tabIndex) => {
      tab.classList.toggle("is-active", tabIndex === activeSlide);
      tab.classList.toggle("is-left", tabIndex <= activeSlide);
      tab.setAttribute("aria-selected", tabIndex === activeSlide ? "true" : "false");
    });
    const active = slides[activeSlide];
    if (heading && active?.dataset.slideHeading) heading.textContent = active.dataset.slideHeading;
    if (lead && active?.dataset.slideLead) lead.textContent = active.dataset.slideLead;
  }

  function setHomeSlide(index, animate = true) {
    if (!slides.length) return;
    const maxSlide = slides.length - 1;
    const requestedIndex = index;
    let nextSlide = Math.max(0, Math.min(maxSlide, requestedIndex));
    if (requestedIndex > maxSlide) {
      homeSliderDirection = -1;
      nextSlide = Math.max(0, activeSlide - 1);
    } else if (requestedIndex < 0) {
      homeSliderDirection = 1;
      nextSlide = Math.min(maxSlide, activeSlide + 1);
    } else if (requestedIndex !== activeSlide) {
      homeSliderDirection = requestedIndex > activeSlide ? 1 : -1;
    }
    if (nextSlide === activeSlide || isHomeSliderAnimating) return;

    const previous = slides[activeSlide];
    const next = slides[nextSlide];
    activeSlide = nextSlide;

    if (!animate) {
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeSlide);
        slide.classList.remove("is-leaving", "is-entering");
      });
      updateHomeSliderMeta();
      return;
    }

    isHomeSliderAnimating = true;
    homeSlider.classList.toggle("is-reversing", homeSliderDirection < 0);
    next.classList.add("is-active", "is-entering");
    previous.classList.add("is-leaving");
    updateHomeSliderMeta();

    window.setTimeout(() => {
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeSlide);
        slide.classList.remove("is-leaving", "is-entering");
      });
      homeSlider.classList.remove("is-reversing");
      isHomeSliderAnimating = false;
    }, 920);
  }

  function startHomeSlider() {
    window.clearInterval(sliderTimer);
    sliderTimer = window.setInterval(() => setHomeSlide(activeSlide + homeSliderDirection), 4200);
  }

  prev?.addEventListener("click", () => {
    setHomeSlide(activeSlide - 1);
    startHomeSlider();
  });

  next?.addEventListener("click", () => {
    setHomeSlide(activeSlide + 1);
    startHomeSlider();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setHomeSlide(index);
      startHomeSlider();
    });
  });

  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", index === activeSlide ? "true" : "false");
    tab.addEventListener("click", () => {
      setHomeSlide(index);
      startHomeSlider();
    });
  });

  homeSlider.addEventListener("mouseenter", () => window.clearInterval(sliderTimer));
  homeSlider.addEventListener("mouseleave", startHomeSlider);
  window.addEventListener("resize", updateHomeTabTravel);
  updateHomeSliderMeta();
  startHomeSlider();
}

const toggles = document.querySelectorAll(".toggle");
const sizeSelect = document.querySelector("#sizeSelect");
const eventSelect = document.querySelector("#eventSelect");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryList = document.querySelector("#summaryList");

const sizeLabels = {
  small: "6 x 6 м",
  medium: "10 x 15 м",
  large: "20 x 30 м"
};

const optionLabels = {
  walls: "Боковые стены и входная группа",
  light: "Архитектурная подсветка периметра",
  climate: "Климат-контроль под сезон",
  furniture: "Мебель и текстиль для гостей",
  glass: "Остекление фасадной зоны",
  print: "Брендирование и широкоформатная печать",
  media: "Экран, звук и мультимедийное оборудование",
  wardrobe: "Гардеробная зона и стеллажи"
};

function updateSummary() {
  if (!summaryTitle || !summaryList || !sizeSelect || !eventSelect) return;
  const activeOptions = [...document.querySelectorAll(".toggle.is-active")]
    .map((button) => optionLabels[button.dataset.option]);

  summaryTitle.textContent = `${sizeLabels[sizeSelect.value]} / ${eventSelect.value.toLowerCase()}`;
  summaryList.innerHTML = activeOptions.length
    ? activeOptions.map((item) => `<li>${item}</li>`).join("")
    : "<li>Базовая тентовая конструкция без дополнительных опций</li>";
}

toggles.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-active");
    updateSummary();
  });
});

if (sizeSelect && eventSelect) {
  sizeSelect.addEventListener("change", updateSummary);
  eventSelect.addEventListener("change", updateSummary);
  updateSummary();
}

function initTentProductLightbox() {
  const groups = [...document.querySelectorAll(".tent-product-card")].map((card) => {
    const title = card.querySelector(".tent-product-copy h3")?.textContent?.trim() || "";
    const images = [...card.querySelectorAll(".tent-product-media img")];
    return { title, images };
  }).filter((group) => group.images.length);
  if (!groups.length || document.querySelector(".tent-product-lightbox")) return;

  const lightbox = document.createElement("div");
  lightbox.className = "portfolio-lightbox tent-product-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="portfolio-lightbox-close" type="button" aria-label="Закрыть просмотр">×</button>
    <button class="portfolio-lightbox-arrow portfolio-lightbox-prev" type="button" aria-label="Предыдущее фото"></button>
    <figure>
      <img src="" alt="">
      <figcaption>
        <strong></strong>
        <span></span>
      </figcaption>
    </figure>
    <button class="portfolio-lightbox-arrow portfolio-lightbox-next" type="button" aria-label="Следующее фото"></button>
  `;
  document.body.appendChild(lightbox);

  const preview = lightbox.querySelector("img");
  const captionTitle = lightbox.querySelector("strong");
  const captionMeta = lightbox.querySelector("span");
  const closeButton = lightbox.querySelector(".portfolio-lightbox-close");
  const prevButton = lightbox.querySelector(".portfolio-lightbox-prev");
  const nextButton = lightbox.querySelector(".portfolio-lightbox-next");
  let activeGroup = groups[0];
  let activeIndex = 0;

  const show = (group, index) => {
    activeGroup = group;
    activeIndex = (index + activeGroup.images.length) % activeGroup.images.length;
    const image = activeGroup.images[activeIndex];
    preview.src = image.currentSrc || image.src;
    preview.alt = image.alt || activeGroup.title;
    captionTitle.textContent = activeGroup.title;
    captionMeta.textContent = `${activeIndex + 1} / ${activeGroup.images.length}`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-lightbox-open");
    closeButton.focus({ preventScroll: true });
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-lightbox-open");
    activeGroup.images[activeIndex]?.focus({ preventScroll: true });
  };

  const move = (step) => show(activeGroup, activeIndex + step);

  groups.forEach((group) => {
    group.images.forEach((image, index) => {
      image.classList.add("is-lightbox-ready");
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `Открыть фото: ${group.title}`);
      image.addEventListener("click", () => show(group, index));
      image.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        show(group, index);
      });
    });
  });

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}

initTentProductLightbox();

function initProjectGeography() {
  const map = document.querySelector("#interactive-map");
  const popup = document.querySelector("#interactive-map-popup");
  if (!map || !popup) return;

  const parentMapInside = document.querySelector("#interactive-map-parent-inside");
  const portfolioByRegion = {
    "Самарская область": ["assets/pages/portfolio-01.jpg", "assets/site/portfolio-01.jpg", "assets/pages/vystavki-01.jpg"],
    "Чувашская Республика": ["assets/pages/portfolio-02.jpg", "assets/site/portfolio-02.jpg", "assets/pages/venues-for-events-01.jpg"],
    "Республика Марий Эл": ["assets/pages/portfolio-03.jpg", "assets/site/portfolio-03.jpg", "assets/pages/vystavki-02.jpg"],
    "Удмуртская Республика": ["assets/pages/portfolio-04.jpg", "assets/site/portfolio-04.jpg", "assets/pages/venues-for-events-03.jpg"],
    "Пензенская область": ["assets/pages/portfolio-05.jpg", "assets/site/case-01.jpg", "assets/pages/vystavki-03.jpg"],
    "Республика Мордовия": ["assets/pages/portfolio-06.jpg", "assets/site/case-02.jpg", "assets/pages/venues-for-events-04.jpg"],
    "Ульяновская область": ["assets/pages/portfolio-07.jpg", "assets/site/case-03.jpg", "assets/pages/vystavki-04.jpg"],
    "Нижегородская область": ["assets/pages/portfolio-08.jpg", "assets/site/case-04.jpg", "assets/pages/venues-for-events-05.jpg"],
    "Костромская область": ["assets/pages/vystavki-05.jpg", "assets/site/case-05.jpg", "assets/pages/venues-for-events-06.jpg"],
    "Волгоградская область": ["assets/pages/vystavki-06.jpg", "assets/site/portfolio-01.jpg", "assets/pages/venues-for-events-07.jpg"],
    "Кировская область": ["assets/pages/vystavki-07.jpg", "assets/site/portfolio-02.jpg", "assets/pages/venues-for-events-08.jpg"],
    "Оренбургская область": ["assets/pages/vystavki-08.jpg", "assets/site/portfolio-03.jpg", "assets/pages/portfolio-02.jpg"],
    "Саратовская область": ["assets/pages/venues-for-events-02.jpg", "assets/site/portfolio-04.jpg", "assets/pages/portfolio-03.jpg"],
    "Республика Татарстан": ["assets/pages/venues-for-events-06.jpg", "assets/site/case-01.jpg", "assets/pages/portfolio-04.jpg"]
  };
  const subjectRegions = [...map.querySelectorAll("[data-code][data-title]")];
  subjectRegions.forEach((region) => {
    const name = region.dataset.title;
    region.classList.add("loc-btn", "loc-path", "loc-region-shape");
    region.dataset.name = name;
    region.dataset.descr = `${name}: работаем с выставочными, деловыми и событийными проектами. По запросу подберём подходящие решения и покажем релевантные работы.`;
    region.dataset.items = JSON.stringify([
      { num: "01", text: "Выездные проекты" },
      { num: "02", text: "Стенды, шатры, мебель и оборудование" },
      { num: "03", text: `Код региона: ${region.dataset.code}` }
    ]);
    region.dataset.gallery = JSON.stringify(portfolioByRegion[name] || []);
  });
  let regions = [...map.querySelectorAll(".loc-btn")];
  const titlePopup = document.querySelector("#interactive-map-title");
  const listPopup = document.querySelector("#interactive-map-list");
  const btnClose = document.querySelector("#interactive-map-close");
  const galleryPopup = document.querySelector("#interactive-map-gallery");
  const descrPopup = document.querySelector("#interactive-map-descr");
  const zoomRange = document.querySelector(".map-zoom-range");
  const zoomButtons = [...document.querySelectorAll("[data-map-zoom]")];
  let mapScale = 0.72;
  let mapX = 0;
  let mapY = 0;
  let suppressRegionClick = false;
  let introTimer = 0;
  let regionUpdateTimer = 0;
  let lockedRegion = null;
  const minScale = 0.7;
  const maxScale = 3.2;
  const svgNS = "http://www.w3.org/2000/svg";

  const normalizeRegionName = (value = "") => value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/республика|область|край|автономный округ|автономная область|город|г\./g, "")
    .replace(/[«»"()]/g, "")
    .replace(/\s+-\s+|-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const projectRegionByName = new Map(
    regions.map((region) => [normalizeRegionName(region.dataset.name), region])
  );
  const fallbackGallery = regions.find((region) => region.dataset.gallery)?.dataset.gallery || "[]";

  const rfSubjects = [
    ["Республика Адыгея", "Адыгея", "Юг", 645, 1210],
    ["Республика Алтай", "Алтай Респ.", "Сибирь", 1570, 1200],
    ["Республика Башкортостан", "Башкортостан", "Приволжье", 1090, 940],
    ["Республика Бурятия", "Бурятия", "Сибирь", 2000, 1160],
    ["Республика Дагестан", "Дагестан", "Северный Кавказ", 860, 1310],
    ["Республика Ингушетия", "Ингушетия", "Северный Кавказ", 790, 1285],
    ["Кабардино-Балкарская Республика", "КБР", "Северный Кавказ", 720, 1280],
    ["Республика Калмыкия", "Калмыкия", "Юг", 780, 1190],
    ["Карачаево-Черкесская Республика", "КЧР", "Северный Кавказ", 680, 1260],
    ["Республика Карелия", "Карелия", "Северо-Запад", 720, 500],
    ["Республика Коми", "Коми", "Северо-Запад", 1040, 600],
    ["Республика Крым", "Крым", "Юг", 570, 1180],
    ["Республика Марий Эл", "Марий Эл", "Приволжье", 940, 830],
    ["Республика Мордовия", "Мордовия", "Приволжье", 840, 900],
    ["Республика Саха (Якутия)", "Якутия", "Дальний Восток", 2050, 630],
    ["Республика Северная Осетия - Алания", "Сев. Осетия", "Северный Кавказ", 760, 1290],
    ["Республика Татарстан", "Татарстан", "Приволжье", 970, 880],
    ["Республика Тыва", "Тыва", "Сибирь", 1700, 1220],
    ["Удмуртская Республика", "Удмуртия", "Приволжье", 1050, 820],
    ["Республика Хакасия", "Хакасия", "Сибирь", 1660, 1120],
    ["Чеченская Республика", "Чечня", "Северный Кавказ", 820, 1290],
    ["Чувашская Республика", "Чувашия", "Приволжье", 910, 870],
    ["Алтайский край", "Алтайский край", "Сибирь", 1500, 1130],
    ["Забайкальский край", "Забайкалье", "Дальний Восток", 2150, 1130],
    ["Камчатский край", "Камчатка", "Дальний Восток", 2550, 720],
    ["Краснодарский край", "Краснодарский край", "Юг", 660, 1180],
    ["Красноярский край", "Красноярский край", "Сибирь", 1700, 840],
    ["Пермский край", "Пермский край", "Приволжье", 1080, 720],
    ["Приморский край", "Приморье", "Дальний Восток", 2460, 1130],
    ["Ставропольский край", "Ставрополье", "Северный Кавказ", 720, 1220],
    ["Хабаровский край", "Хабаровский край", "Дальний Восток", 2380, 920],
    ["Амурская область", "Амурская обл.", "Дальний Восток", 2270, 1020],
    ["Архангельская область", "Архангельская обл.", "Северо-Запад", 930, 520],
    ["Астраханская область", "Астраханская обл.", "Юг", 900, 1210],
    ["Белгородская область", "Белгородская обл.", "Центр", 660, 1010],
    ["Брянская область", "Брянская обл.", "Центр", 610, 840],
    ["Владимирская область", "Владимирская обл.", "Центр", 790, 780],
    ["Волгоградская область", "Волгоградская обл.", "Юг", 850, 1140],
    ["Вологодская область", "Вологодская обл.", "Северо-Запад", 780, 640],
    ["Воронежская область", "Воронежская обл.", "Центр", 700, 970],
    ["Ивановская область", "Ивановская обл.", "Центр", 815, 740],
    ["Иркутская область", "Иркутская обл.", "Сибирь", 1900, 1050],
    ["Калининградская область", "Калининград", "Северо-Запад", 365, 720],
    ["Калужская область", "Калужская обл.", "Центр", 690, 830],
    ["Кемеровская область - Кузбасс", "Кузбасс", "Сибирь", 1580, 1030],
    ["Кировская область", "Кировская обл.", "Приволжье", 980, 760],
    ["Костромская область", "Костромская обл.", "Центр", 870, 710],
    ["Курганская область", "Курганская обл.", "Урал", 1250, 940],
    ["Курская область", "Курская обл.", "Центр", 640, 950],
    ["Ленинградская область", "Ленинградская обл.", "Северо-Запад", 650, 590],
    ["Липецкая область", "Липецкая обл.", "Центр", 720, 920],
    ["Магаданская область", "Магаданская обл.", "Дальний Восток", 2280, 650],
    ["Московская область", "Московская обл.", "Центр", 750, 780],
    ["Мурманская область", "Мурманская обл.", "Северо-Запад", 760, 390],
    ["Нижегородская область", "Нижегородская обл.", "Приволжье", 890, 820],
    ["Новгородская область", "Новгородская обл.", "Северо-Запад", 640, 650],
    ["Новосибирская область", "Новосибирская обл.", "Сибирь", 1480, 1020],
    ["Омская область", "Омская обл.", "Сибирь", 1370, 1000],
    ["Оренбургская область", "Оренбургская обл.", "Приволжье", 1070, 1040],
    ["Орловская область", "Орловская обл.", "Центр", 660, 900],
    ["Пензенская область", "Пензенская обл.", "Приволжье", 850, 950],
    ["Псковская область", "Псковская обл.", "Северо-Запад", 585, 690],
    ["Ростовская область", "Ростовская обл.", "Юг", 700, 1120],
    ["Рязанская область", "Рязанская обл.", "Центр", 780, 850],
    ["Самарская область", "Самарская обл.", "Приволжье", 960, 990],
    ["Саратовская область", "Саратовская обл.", "Приволжье", 900, 1050],
    ["Сахалинская область", "Сахалин", "Дальний Восток", 2510, 1010],
    ["Свердловская область", "Свердловская обл.", "Урал", 1180, 820],
    ["Смоленская область", "Смоленская обл.", "Центр", 620, 780],
    ["Тамбовская область", "Тамбовская обл.", "Центр", 760, 930],
    ["Тверская область", "Тверская обл.", "Центр", 690, 710],
    ["Томская область", "Томская обл.", "Сибирь", 1510, 910],
    ["Тульская область", "Тульская обл.", "Центр", 720, 860],
    ["Тюменская область", "Тюменская обл.", "Урал", 1280, 820],
    ["Ульяновская область", "Ульяновская обл.", "Приволжье", 920, 950],
    ["Челябинская область", "Челябинская обл.", "Урал", 1180, 960],
    ["Ярославская область", "Ярославская обл.", "Центр", 820, 700],
    ["Москва", "Москва", "Центр", 725, 760],
    ["Санкт-Петербург", "Санкт-Петербург", "Северо-Запад", 620, 560],
    ["Севастополь", "Севастополь", "Юг", 545, 1215],
    ["Еврейская автономная область", "ЕАО", "Дальний Восток", 2350, 1080],
    ["Ненецкий автономный округ", "Ненецкий АО", "Северо-Запад", 980, 430],
    ["Ханты-Мансийский автономный округ - Югра", "ХМАО - Югра", "Урал", 1320, 680],
    ["Чукотский автономный округ", "Чукотка", "Дальний Восток", 2550, 410],
    ["Ямало-Ненецкий автономный округ", "ЯНАО", "Урал", 1300, 540],
    ["Донецкая Народная Республика", "ДНР", "Юг", 620, 1095],
    ["Луганская Народная Республика", "ЛНР", "Юг", 655, 1080],
    ["Запорожская область", "Запорожская обл.", "Юг", 610, 1145],
    ["Херсонская область", "Херсонская обл.", "Юг", 585, 1155]
  ];

  const getProjectRegionForSubject = (name, label) => (
    projectRegionByName.get(normalizeRegionName(name))
    || projectRegionByName.get(normalizeRegionName(label))
  );

  const createSubjectLayer = () => {
    if (map.querySelector(".loc-subject-layer")) return;

    const layer = document.createElementNS(svgNS, "g");
    layer.classList.add("loc-subject-layer");
    layer.setAttribute("aria-label", "Субъекты Российской Федерации");

    rfSubjects.forEach(([name, label, district, x, y], index) => {
      const sourceRegion = getProjectRegionForSubject(name, label);
      const marker = document.createElementNS(svgNS, "a");
      const markerId = `rf-subject-${index + 1}`;
      const hasPortfolio = Boolean(sourceRegion);
      marker.id = markerId;
      marker.classList.add("loc-btn", "loc-subject-marker");
      if (hasPortfolio) marker.classList.add("_has-projects");
      marker.setAttribute("href", `#${markerId}`);
      marker.setAttribute("aria-label", name);
      marker.dataset.name = sourceRegion?.dataset.name || name;
      marker.dataset.descr = sourceRegion?.dataset.descr || `${name}: субъект РФ доступен для организации выставок, мероприятий, аренды шатров, мебели и оборудования. При выборе региона менеджер подберет решения и покажет релевантные проекты.`;
      marker.dataset.items = sourceRegion?.dataset.items || JSON.stringify([
        { num: "01", text: district },
        { num: "02", text: "Выездные проекты" },
        { num: "03", text: hasPortfolio ? "Есть работы в портфолио" : "Галерея подбирается по запросу" }
      ]);
      marker.dataset.gallery = sourceRegion?.dataset.gallery || fallbackGallery;

      const hit = document.createElementNS(svgNS, "circle");
      hit.classList.add("subject-hit");
      hit.setAttribute("cx", x);
      hit.setAttribute("cy", y);
      hit.setAttribute("r", "24");

      const dot = document.createElementNS(svgNS, "circle");
      dot.classList.add("subject-dot");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", hasPortfolio ? "9" : "6");

      const title = document.createElementNS(svgNS, "title");
      title.textContent = name;

      marker.append(title, hit, dot);
      layer.appendChild(marker);
    });

    map.appendChild(layer);
    regions = [...map.querySelectorAll(".loc-btn")];
  };

  const updateMapTransform = () => {
    map.style.setProperty("--map-scale", mapScale.toFixed(3));
    map.style.setProperty("--map-x", `${mapX}px`);
    map.style.setProperty("--map-y", `${mapY}px`);
    if (zoomRange) zoomRange.value = mapScale.toFixed(2);
  };

  const cancelIntroAnimation = () => {
    window.clearTimeout(introTimer);
    map.classList.remove("_intro-animating");
  };

  const setMapScale = (nextScale, originX = 0, originY = 0) => {
    const oldScale = mapScale;
    mapScale = Math.min(maxScale, Math.max(minScale, nextScale));
    const ratio = mapScale / oldScale;
    mapX = originX - (originX - mapX) * ratio;
    mapY = originY - (originY - mapY) * ratio;
    updateMapTransform();
  };

  const findRegionTarget = (target) => {
    if (!target) return null;
    if (target.closest) return target.closest(".loc-btn");
    let current = target;
    while (current && current !== map) {
      if (current.classList?.contains("loc-btn")) return current;
      current = current.parentNode;
    }
    return null;
  };

  const activateRegionFromEvent = (event) => {
    const region = findRegionTarget(event.target);
    if (!region || !map.contains(region)) return false;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (suppressRegionClick) return true;
    cancelIntroAnimation();
    openRegion(region);
    return true;
  };

  const regionTooltip = document.createElement("div");
  regionTooltip.className = "map-region-tooltip";
  regionTooltip.setAttribute("role", "tooltip");
  regionTooltip.setAttribute("aria-hidden", "true");
  parentMapInside?.appendChild(regionTooltip);

  const setRegionTooltipPosition = (clientX, clientY) => {
    if (!parentMapInside) return;
    const rect = parentMapInside.getBoundingClientRect();
    const x = Math.min(rect.width - 22, Math.max(22, clientX - rect.left));
    const y = Math.min(rect.height - 18, Math.max(42, clientY - rect.top));
    regionTooltip.style.left = `${x}px`;
    regionTooltip.style.top = `${y}px`;
  };

  const showRegionTooltip = (region, clientX, clientY) => {
    const name = region?.dataset.name;
    if (!name) return;
    regionTooltip.textContent = name;
    regionTooltip.classList.add("_visible");
    regionTooltip.setAttribute("aria-hidden", "false");
    setRegionTooltipPosition(clientX, clientY);
  };

  const hideRegionTooltip = () => {
    regionTooltip.classList.remove("_visible");
    regionTooltip.setAttribute("aria-hidden", "true");
  };

  map.addEventListener("pointerover", (event) => {
    const region = findRegionTarget(event.target);
    if (!region) return;
    const previousRegion = findRegionTarget(event.relatedTarget);
    if (previousRegion === region) return;
    showRegionTooltip(region, event.clientX, event.clientY);
  });

  map.addEventListener("pointermove", (event) => {
    const region = findRegionTarget(event.target);
    if (!region) return;
    setRegionTooltipPosition(event.clientX, event.clientY);
  });

  map.addEventListener("pointerout", (event) => {
    const region = findRegionTarget(event.target);
    if (!region) return;
    const nextRegion = findRegionTarget(event.relatedTarget);
    if (nextRegion === region) return;
    hideRegionTooltip();
  });

  map.addEventListener("focusin", (event) => {
    const region = findRegionTarget(event.target);
    if (!region || !parentMapInside) return;
    const regionRect = region.getBoundingClientRect();
    showRegionTooltip(
      region,
      regionRect.left + regionRect.width / 2,
      regionRect.top + regionRect.height / 2
    );
  });

  map.addEventListener("focusout", hideRegionTooltip);
  updateMapTransform();

  zoomRange?.addEventListener("input", () => {
    cancelIntroAnimation();
    setMapScale(Number(zoomRange.value), 0, 0);
  });

  zoomButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cancelIntroAnimation();
      const direction = button.dataset.mapZoom === "in" ? 1 : -1;
      setMapScale(mapScale + direction * 0.18, 0, 0);
    });
  });

  const clearPopup = () => {
    titlePopup.classList.add("_hide");
    listPopup.classList.add("_hide");
    galleryPopup.classList.add("_hide");
    descrPopup.classList.add("_hide");
    window.setTimeout(() => {
      listPopup.innerHTML = "";
      titlePopup.textContent = "";
      galleryPopup.innerHTML = "";
      descrPopup.textContent = "";
      titlePopup.classList.remove("_hide");
      listPopup.classList.remove("_hide");
      galleryPopup.classList.remove("_hide");
      descrPopup.classList.remove("_hide");
    }, 220);
  };

  const createGallery = (gallery) => {
    let activeIndex = 0;
    const prev = document.createElement("button");
    const next = document.createElement("button");
    const figure = document.createElement("figure");

    prev.className = "s-location__gallery-arrow _prev";
    next.className = "s-location__gallery-arrow _next";
    prev.type = "button";
    next.type = "button";
    prev.setAttribute("aria-label", "Предыдущее фото");
    next.setAttribute("aria-label", "Следующее фото");
    prev.textContent = "‹";
    next.textContent = "›";

    if (!gallery.length) {
      const empty = document.createElement("div");
      const emptyTitle = document.createElement("strong");
      const emptyText = document.createElement("span");
      figure.className = "s-location__gallery-empty";
      emptyTitle.textContent = "Портфолио региона формируется";
      emptyText.textContent = "Фотографии проектов появятся здесь после добавления материалов.";
      empty.append(emptyTitle, emptyText);
      figure.appendChild(empty);
      prev.disabled = true;
      next.disabled = true;
      galleryPopup.append(prev, figure, next);
      return;
    }

    const img = document.createElement("img");
    const counter = document.createElement("span");
    counter.className = "s-location__gallery-counter";

    const show = (index) => {
      activeIndex = (index + gallery.length) % gallery.length;
      img.src = gallery[activeIndex];
      img.alt = titlePopup.textContent || "Фото проекта";
      counter.textContent = `${activeIndex + 1} / ${gallery.length}`;
    };

    prev.addEventListener("click", () => show(activeIndex - 1));
    next.addEventListener("click", () => show(activeIndex + 1));
    figure.append(img, counter);
    galleryPopup.append(prev, figure, next);
    show(0);
  };

  const showDefaultSummary = () => {
    lockedRegion = null;
    regions.forEach((item) => item.classList.remove("_active"));
    titlePopup.textContent = "География проектов";
    listPopup.innerHTML = "";
    galleryPopup.innerHTML = "";
    galleryPopup.classList.add("_summary");

    const totalCard = document.createElement("div");
    const totalValue = document.createElement("strong");
    const totalLabel = document.createElement("span");
    totalCard.className = "s-location__projects-total";
    totalValue.textContent = "> 3540";
    totalLabel.textContent = "реализованных проектов";
    totalCard.append(totalValue, totalLabel);
    galleryPopup.appendChild(totalCard);

    descrPopup.textContent = "Выберите субъект РФ на карте, чтобы посмотреть информацию и портфолио проектов в регионе.";
    popup.classList.add("_active");
  };

  const openRegion = (region) => {
    window.clearTimeout(regionUpdateTimer);
    const dataItems = JSON.parse(region.dataset.items || "[]");
    const dataGallery = region.dataset.gallery ? JSON.parse(region.dataset.gallery) : [];
    const dataTitle = region.dataset.name || "Регион";
    const dataDescr = region.dataset.descr || "";

    regions.forEach((item) => item.classList.remove("_active"));
    region.classList.add("_active");

    let delay = 0;
    if (popup.classList.contains("_active")) {
      clearPopup();
      delay = 240;
    }

    regionUpdateTimer = window.setTimeout(() => {
      titlePopup.textContent = dataTitle;
      listPopup.innerHTML = "";
      dataItems.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="num">${item.num}</span><span class="val">${item.text}</span>`;
        listPopup.appendChild(li);
      });
      descrPopup.textContent = dataDescr;
      galleryPopup.innerHTML = "";
      galleryPopup.classList.remove("_summary");
      createGallery(dataGallery);
      popup.classList.add("_active");
    }, delay);
  };

  btnClose?.addEventListener("click", () => {
    lockedRegion = null;
    popup.classList.remove("_active");
    regions.forEach((item) => item.classList.remove("_active"));
    window.setTimeout(clearPopup, 220);
  });

  regions.forEach((region) => {
    region.setAttribute("tabindex", "0");
    region.setAttribute("role", "button");
    region.addEventListener("mouseover", () => {
      const href = region.getAttribute("href");
      const currentName = href ? map.querySelector(href) : null;
      currentName?.classList.add("_hover");
    });
    region.addEventListener("mouseout", () => {
      const href = region.getAttribute("href");
      const currentName = href ? map.querySelector(href) : null;
      currentName?.classList.remove("_hover");
    });
    region.addEventListener("click", (event) => {
      event.preventDefault();
      cancelIntroAnimation();
      lockedRegion = region;
      openRegion(region);
    });
    region.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      lockedRegion = region;
      openRegion(region);
    });
  });

  if (parentMapInside) {
    let isDragging = false;
    let didDrag = false;
    let startClientX = 0;
    let startClientY = 0;
    let startMapX = 0;
    let startMapY = 0;
    const activeTouches = new Map();
    let pinchLastDistance = 0;
    let pinchLastCenterX = 0;
    let pinchLastCenterY = 0;

    parentMapInside.addEventListener("wheel", (event) => {
      cancelIntroAnimation();
      event.preventDefault();
      const rect = parentMapInside.getBoundingClientRect();
      const pointX = event.clientX - rect.left - rect.width / 2;
      const pointY = event.clientY - rect.top - rect.height / 2;
      const direction = event.deltaY > 0 ? -1 : 1;
      setMapScale(mapScale + direction * 0.12, pointX, pointY);
    }, { passive: false });

    parentMapInside.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      cancelIntroAnimation();
      if (event.pointerType === "touch") {
        activeTouches.set(event.pointerId, { x: event.clientX, y: event.clientY });
        parentMapInside.setPointerCapture?.(event.pointerId);
        parentMapInside.classList.add("_grabbing");

        if (activeTouches.size === 1) {
          isDragging = true;
          didDrag = false;
          startClientX = event.clientX;
          startClientY = event.clientY;
          startMapX = mapX;
          startMapY = mapY;
        } else if (activeTouches.size === 2) {
          const [first, second] = Array.from(activeTouches.values());
          pinchLastDistance = Math.hypot(second.x - first.x, second.y - first.y);
          pinchLastCenterX = (first.x + second.x) / 2;
          pinchLastCenterY = (first.y + second.y) / 2;
          isDragging = false;
          didDrag = true;
        }
        return;
      }
      isDragging = true;
      didDrag = false;
      startClientX = event.clientX;
      startClientY = event.clientY;
      startMapX = mapX;
      startMapY = mapY;
      parentMapInside.classList.add("_grabbing");
      parentMapInside.setPointerCapture?.(event.pointerId);
    });

    const stopDrag = (event) => {
      if (!isDragging) return;
      isDragging = false;
      parentMapInside.classList.remove("_grabbing");
      parentMapInside.releasePointerCapture?.(event.pointerId);
      if (!didDrag && event.type === "pointerup") {
        const clickedElement = document.elementFromPoint(event.clientX, event.clientY);
        const clickedRegion = findRegionTarget(clickedElement);
        if (clickedRegion && map.contains(clickedRegion)) {
          cancelIntroAnimation();
          lockedRegion = clickedRegion;
          openRegion(clickedRegion);
        }
      }
      if (didDrag) {
        suppressRegionClick = true;
        window.setTimeout(() => {
          suppressRegionClick = false;
        }, 80);
      }
    };

    parentMapInside.addEventListener("pointerup", stopDrag);
    parentMapInside.addEventListener("pointercancel", stopDrag);
    parentMapInside.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "touch") stopDrag(event);
    });
    parentMapInside.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" && activeTouches.has(event.pointerId)) {
        activeTouches.set(event.pointerId, { x: event.clientX, y: event.clientY });
        event.preventDefault();

        if (activeTouches.size >= 2) {
          const [first, second] = Array.from(activeTouches.values());
          const distance = Math.hypot(second.x - first.x, second.y - first.y);
          const centerX = (first.x + second.x) / 2;
          const centerY = (first.y + second.y) / 2;
          const rect = parentMapInside.getBoundingClientRect();
          const pointX = centerX - rect.left - rect.width / 2;
          const pointY = centerY - rect.top - rect.height / 2;

          mapX += centerX - pinchLastCenterX;
          mapY += centerY - pinchLastCenterY;
          if (pinchLastDistance > 0 && distance > 0) {
            setMapScale(mapScale * (distance / pinchLastDistance), pointX, pointY);
          } else {
            updateMapTransform();
          }
          pinchLastDistance = distance;
          pinchLastCenterX = centerX;
          pinchLastCenterY = centerY;
          didDrag = true;
          return;
        }

        if (isDragging) {
          const deltaX = event.clientX - startClientX;
          const deltaY = event.clientY - startClientY;
          if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) didDrag = true;
          mapX = startMapX + deltaX;
          mapY = startMapY + deltaY;
          updateMapTransform();
        }
        return;
      }
      if (!isDragging) return;
      event.preventDefault();
      const deltaX = event.clientX - startClientX;
      const deltaY = event.clientY - startClientY;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) didDrag = true;
      mapX = startMapX + deltaX;
      mapY = startMapY + deltaY;
      updateMapTransform();
    });

    const finishTouch = (event) => {
      if (!activeTouches.has(event.pointerId)) return;
      activeTouches.delete(event.pointerId);
      parentMapInside.releasePointerCapture?.(event.pointerId);

      if (activeTouches.size === 1) {
        const remaining = activeTouches.values().next().value;
        isDragging = true;
        startClientX = remaining.x;
        startClientY = remaining.y;
        startMapX = mapX;
        startMapY = mapY;
        pinchLastDistance = 0;
        return;
      }

      if (activeTouches.size === 0) {
        isDragging = false;
        parentMapInside.classList.remove("_grabbing");
        if (didDrag) {
          suppressRegionClick = true;
          window.setTimeout(() => {
            suppressRegionClick = false;
          }, 80);
        }
        pinchLastDistance = 0;
      }
    };

    parentMapInside.addEventListener("pointerup", (event) => {
      if (event.pointerType === "touch") finishTouch(event);
    });
    parentMapInside.addEventListener("pointercancel", (event) => {
      if (event.pointerType === "touch") finishTouch(event);
    });

    const focusProjectRegions = () => {
      const paths = regions
        .map((region) => region.matches(".loc-path") ? region : region.querySelector(".loc-path"))
        .filter(Boolean);
      const mainRect = parentMapInside.getBoundingClientRect();
      const mapRect = map.getBoundingClientRect();
      if (!paths.length || !mainRect.width || !mapRect.width) return;

      const viewBox = map.viewBox.baseVal;
      const regionBox = paths.reduce((box, path) => {
        const current = path.getBBox();
        return {
          minX: Math.min(box.minX, current.x),
          minY: Math.min(box.minY, current.y),
          maxX: Math.max(box.maxX, current.x + current.width),
          maxY: Math.max(box.maxY, current.y + current.height)
        };
      }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

      const regionWidth = regionBox.maxX - regionBox.minX;
      const regionHeight = regionBox.maxY - regionBox.minY;
      if (!regionWidth || !regionHeight) return;

      const unitX = mapRect.width / viewBox.width;
      const unitY = mapRect.height / viewBox.height;
      const fitScale = Math.min(
        mainRect.width / (regionWidth * unitX),
        mainRect.height / (regionHeight * unitY)
      );
      const targetScale = Math.min(maxScale, Math.max(2.08, fitScale * 1.05));
      const centerX = regionBox.minX + regionWidth / 2;
      const centerY = regionBox.minY + regionHeight / 2;
      const viewCenterX = viewBox.x + viewBox.width / 2;
      const viewCenterY = viewBox.y + viewBox.height / 2;

      mapScale = targetScale;
      mapX = -(centerX - viewCenterX) * unitX * targetScale;
      mapY = -(centerY - viewCenterY) * unitY * targetScale;
      map.classList.add("_intro-animating");
      updateMapTransform();
      window.setTimeout(() => map.classList.remove("_intro-animating"), 1800);
    };

    showDefaultSummary();
  }
}

initProjectGeography();

function initCounterAnimation() {
  const counters = [...document.querySelectorAll("[data-counter-target]")];
  if (!counters.length) return;

  const formatCounter = (counter, value) => {
    const prefix = counter.dataset.counterPrefix || "";
    const suffix = counter.dataset.counterSuffix || "";
    counter.textContent = `${prefix}${Math.round(value)}${suffix}`;
  };

  const animateCounter = (counter) => {
    if (counter.dataset.counterDone === "true") return;
    counter.dataset.counterDone = "true";

    const target = Number(counter.dataset.counterTarget || 0);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      formatCounter(counter, target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        formatCounter(counter, target);
      }
    };

    requestAnimationFrame(tick);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counters.forEach((counter) => animateCounter(counter));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => observer.observe(counter));
}

initCounterAnimation();

function initStickyHeaderOffset() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateOffset = () => {
    const headerBottom = Math.ceil(header.getBoundingClientRect().bottom);
    document.documentElement.style.setProperty("--sticky-header-offset", `${headerBottom + 10}px`);
  };

  updateOffset();
  window.addEventListener("resize", updateOffset);
  window.addEventListener("scroll", updateOffset, { passive: true });
}

initStickyHeaderOffset();

function initNeonCustomSelects(root = document) {
  const selects = root.querySelectorAll(".lead-form select, .contacts-form select");
  selects.forEach((select) => {
    if (select.dataset.customSelect === "true") return;
    select.dataset.customSelect = "true";

    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add("custom-select-native");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "custom-select-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    const menu = document.createElement("div");
    menu.className = "custom-select-menu";
    menu.setAttribute("role", "listbox");

    const close = () => {
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    const update = () => {
      const option = select.options[select.selectedIndex] || select.options[0];
      trigger.textContent = option ? option.textContent : "";
      [...menu.querySelectorAll(".custom-select-option")].forEach((item, index) => {
        const isSelected = index === select.selectedIndex;
        item.classList.toggle("is-selected", isSelected);
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
      });
    };

    [...select.options].forEach((option, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "custom-select-option";
      item.setAttribute("role", "option");
      item.textContent = option.textContent;
      item.disabled = option.disabled;
      item.addEventListener("click", () => {
        if (option.disabled) return;
        select.selectedIndex = index;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        update();
        close();
        trigger.focus();
      });
      menu.appendChild(item);
    });

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const wasOpen = wrapper.classList.contains("is-open");
      document.querySelectorAll(".custom-select.is-open").forEach((item) => {
        if (item === wrapper) return;
        item.classList.remove("is-open");
        item.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", "false");
      });
      wrapper.classList.toggle("is-open", !wasOpen);
      trigger.setAttribute("aria-expanded", !wasOpen ? "true" : "false");
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const options = [...select.options];
      let nextIndex = select.selectedIndex;
      do {
        nextIndex = (nextIndex + direction + options.length) % options.length;
      } while (options[nextIndex]?.disabled && nextIndex !== select.selectedIndex);
      select.selectedIndex = nextIndex;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      update();
    });

    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) close();
    });

    select.addEventListener("change", update);
    wrapper.append(trigger, menu);
    update();
  });
}

initNeonCustomSelects();


const serviceCardSlugs = [
  "arenda-shatrov-i-tentovyh-konstrukczij-2",
  "eksklyuzivnyye_vystavochnyye_stendy",
  "arenda-mebeli-i-oborudovaniya",
  "arenda-sczen-press-volov-ofrmlenie-kartinnyh-galerej",
  "klimaticheskoe-oborudovanie",
  "oformlenie-prazdnikov",
  "garderob",
  "arenda-holodilnogo-oborudovaniya",
  "meropriyatiya"
];

document.querySelectorAll(".services-grid .service-card").forEach((card, index) => {
  const slug = serviceCardSlugs[index];
  if (!slug) return;
  const isWordPress = !window.location.pathname.includes(".html");
  const target = isWordPress ? `/${slug}/` : `service-page.html?slug=${slug}`;
  card.setAttribute("role", "link");
  card.setAttribute("tabindex", "0");
  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    window.location.href = target;
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = target;
    }
  });
});
