(() => {
  const header = document.querySelector(".site-header");
  const source = header?.querySelector(".header-left-stack");
  if (!header || !source || document.querySelector(".mobile-sticky-identity")) return;

  const isHomePage = Boolean(document.querySelector(".old-home-hero"));
  const servicesGroup = header.querySelector(".main-nav > .nav-group:first-child");
  const servicesTrigger = servicesGroup?.querySelector(":scope > .nav-trigger");

  if (isHomePage) {
    header.classList.add("is-mobile-expanded", "mobile-home-menu");
    servicesGroup?.classList.add("is-open");
    if (servicesTrigger) {
      servicesTrigger.textContent = "Каталог продукции";
      servicesTrigger.setAttribute("aria-expanded", "true");
    }
  } else {
    const menuToggle = document.createElement("button");
    menuToggle.className = "mobile-header-toggle";
    menuToggle.type = "button";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = "<span>Контакты и меню</span><i aria-hidden=\"true\"></i>";

    menuToggle.addEventListener("click", () => {
      const isExpanded = header.classList.toggle("is-mobile-expanded");
      menuToggle.setAttribute("aria-expanded", String(isExpanded));
      menuToggle.querySelector("span").textContent = isExpanded ? "Свернуть меню" : "Контакты и меню";

      if (servicesGroup && servicesTrigger) {
        servicesGroup.classList.toggle("is-open", isExpanded);
        servicesTrigger.setAttribute("aria-expanded", String(isExpanded));
      }
    });

    header.prepend(menuToggle);
  }

  const mobileBar = source.cloneNode(true);
  mobileBar.classList.add("mobile-sticky-identity");
  mobileBar.setAttribute("aria-label", "Логотип и поиск по сайту");

  const logoLink = mobileBar.querySelector(".brand");
  if (logoLink) logoLink.href = "expo-ees-neon-concept.html";

  if (isHomePage) {
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
  }

  document.body.appendChild(mobileBar);
})();
