(() => {
  const header = document.querySelector(".site-header");
  const source = header?.querySelector(".header-left-stack");
  if (!header || !source || document.querySelector(".mobile-sticky-identity")) return;

  const servicesGroup = header.querySelector(".main-nav > .nav-group:first-child");
  const mainNav = header.querySelector(".main-nav");
  const isMobileViewport = window.matchMedia("(max-width: 640px)").matches;
  const isHomePage = Boolean(document.querySelector(".old-home-hero"));

  if (isMobileViewport) {
    header.classList.add("is-mobile-expanded", "mobile-home-menu");
    if (/service-page\.html$/i.test(window.location.pathname)) {
      header.classList.add("mobile-service-page");
      document.body.classList.add("mobile-service-catalog-page");
    }
  }

  if (isMobileViewport && mainNav) {
    const homeLink = document.createElement("a");
    homeLink.className = "mobile-primary-nav-link mobile-primary-home";
    homeLink.href = "expo-ees-neon-concept.html";
    homeLink.textContent = "Главная";

    const servicesLink = document.createElement("a");
    servicesLink.className = "mobile-primary-nav-link mobile-primary-services";
    servicesLink.href = "service-page.html";
    servicesLink.textContent = "Услуги";
    mainNav.append(homeLink, servicesLink);
  }

  const mobileBar = source.cloneNode(true);
  mobileBar.classList.add("mobile-sticky-identity");
  mobileBar.setAttribute("aria-label", "Логотип и поиск по сайту");

  const logoLink = mobileBar.querySelector(".brand");
  if (logoLink) logoLink.href = "expo-ees-neon-concept.html";

  const compactToggle = document.createElement("button");
  compactToggle.className = "mobile-sticky-menu";
  compactToggle.type = "button";
  compactToggle.setAttribute("aria-label", "Показать контакты и меню");
  compactToggle.setAttribute("aria-expanded", "false");
  compactToggle.innerHTML = "<i></i><i></i><i></i>";
  compactToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-mobile-aux-open");
    compactToggle.classList.toggle("is-open", isOpen);
    compactToggle.setAttribute("aria-expanded", String(isOpen));
    compactToggle.setAttribute("aria-label", isOpen ? "Скрыть контакты и меню" : "Показать контакты и меню");
  });
  mobileBar.appendChild(compactToggle);

  document.body.appendChild(mobileBar);

  const footerSocials = document.querySelector(".footer-socials");
  if (isMobileViewport && footerSocials) {
    const headerSocials = footerSocials.cloneNode(true);
    headerSocials.classList.add("mobile-header-socials");
    headerSocials.setAttribute("aria-label", "Социальные сети и способы связи");
    header.appendChild(headerSocials);
  }

  if (isMobileViewport && isHomePage && servicesGroup) {
    const homeCatalog = document.createElement("aside");
    homeCatalog.className = "service-catalog-sidebar mobile-home-product-catalog";
    homeCatalog.setAttribute("aria-label", "Каталог продукции");

    const catalogToggle = document.createElement("button");
    catalogToggle.className = "service-catalog-toggle";
    catalogToggle.type = "button";
    catalogToggle.setAttribute("aria-expanded", "true");
    catalogToggle.innerHTML = '<span class="service-catalog-title">каталог продукции:</span><i aria-hidden="true"></i>';

    const catalogList = document.createElement("nav");
    catalogList.className = "service-catalog-list";
    servicesGroup.querySelectorAll(".nav-column").forEach((column) => {
      const group = document.createElement("div");
      group.className = "service-catalog-group";

      const groupToggle = document.createElement("button");
      groupToggle.className = "service-catalog-main";
      groupToggle.type = "button";
      groupToggle.setAttribute("aria-expanded", "false");
      const sourceTitle = column.querySelector(":scope > span")?.textContent.trim() || "Раздел";
      groupToggle.textContent = sourceTitle === "Стенды" ? "Выставочные стенды" : sourceTitle;

      const sublist = document.createElement("div");
      sublist.className = "service-catalog-sublist";
      column.querySelectorAll(":scope > a").forEach((link) => sublist.appendChild(link.cloneNode(true)));

      groupToggle.addEventListener("click", () => {
        const willOpen = !group.classList.contains("is-open");
        catalogList.querySelectorAll(".service-catalog-group").forEach((item) => {
          item.classList.remove("is-open");
          item.querySelector(".service-catalog-main")?.setAttribute("aria-expanded", "false");
        });
        group.classList.toggle("is-open", willOpen);
        groupToggle.setAttribute("aria-expanded", String(willOpen));
      });

      group.append(groupToggle, sublist);
      catalogList.appendChild(group);
    });

    catalogToggle.addEventListener("click", () => {
      const isCollapsed = homeCatalog.classList.toggle("is-collapsed");
      catalogToggle.setAttribute("aria-expanded", String(!isCollapsed));
    });

    homeCatalog.append(catalogToggle, catalogList);
    header.insertAdjacentElement("afterend", homeCatalog);
  }
})();
