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
  logoLink?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(mobileBar);
})();
