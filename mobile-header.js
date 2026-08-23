(() => {
  const header = document.querySelector(".site-header");
  const source = header?.querySelector(".header-left-stack");
  if (!header || !source || document.querySelector(".mobile-sticky-identity")) return;

  const menuToggle = document.createElement("button");
  menuToggle.className = "mobile-header-toggle";
  menuToggle.type = "button";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.innerHTML = "<span>Контакты и меню</span><i aria-hidden=\"true\"></i>";

  menuToggle.addEventListener("click", () => {
    const isExpanded = header.classList.toggle("is-mobile-expanded");
    menuToggle.setAttribute("aria-expanded", String(isExpanded));
    menuToggle.querySelector("span").textContent = isExpanded ? "Свернуть меню" : "Контакты и меню";
  });

  header.prepend(menuToggle);

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
