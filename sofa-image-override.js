(() => {
  const productTitle = "Двухместный диван в аренду";
  const replacementImage = "assets/catalog/divan-dvuhmestnyy-new.png";

  function updateProductImage() {
    const candidates = document.querySelectorAll(
      "article, .product-card, .catalog-card, .service-product-card, .catalog-item"
    );

    candidates.forEach((card) => {
      if (!card.textContent?.includes(productTitle)) return;

      const image = card.querySelector("img");
      if (!image || image.dataset.sofaImageUpdated === "true") return;

      image.src = replacementImage;
      image.dataset.src = replacementImage;
      image.dataset.full = replacementImage;
      image.dataset.lightboxSrc = replacementImage;
      image.dataset.sofaImageUpdated = "true";

      const imageLink = image.closest("a");
      const currentHref = imageLink?.getAttribute("href") || "";
      if (imageLink && /\.(png|jpe?g|webp)(?:\?.*)?$/i.test(currentHref)) {
        imageLink.href = replacementImage;
      }
    });
  }

  function start() {
    updateProductImage();
    new MutationObserver(updateProductImage).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
