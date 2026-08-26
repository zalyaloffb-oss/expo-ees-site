(() => {
  const header = document.querySelector(".site-header");
  const source = header?.querySelector(".header-left-stack");
  if (!header || !source || document.querySelector(".mobile-sticky-identity")) return;

  const servicesGroup = header.querySelector(".main-nav > .nav-group:first-child");
  const servicesTrigger = servicesGroup?.querySelector(":scope > .nav-trigger");
  const isMobileViewport = window.matchMedia("(max-width: 640px)").matches;

  if (isMobileViewport) {
    header.classList.add("is-mobile-expanded", "mobile-home-menu");
    servicesGroup?.classList.add("is-open");
  }
  if (servicesTrigger && isMobileViewport) {
    servicesTrigger.textContent = "Каталог продукции";
    servicesTrigger.setAttribute("aria-expanded", "true");
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
})();
