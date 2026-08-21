(() => {
  const source = document.querySelector(".site-header .header-left-stack");
  if (!source || document.querySelector(".mobile-sticky-identity")) return;

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
