(() => {
  const productImages = new Map([
    ["Двухместный диван в аренду", "assets/catalog/divan-dvuhmestnyy-new-v5.png?v=1"],
    ["Трехместный диван в аренду", "assets/products/divany-3-seat-studio-v3.png?v=1"],
    ["Кресло эко-кожа полукруглое", "assets/products/kresla-round-eco-studio-v3.png?v=1"],
    ["Кресло эко-кожа квадратное", "assets/products/kresla-square-eco-studio-v3.png?v=1"],
    ["Стул Samba", "assets/products/stulya-samba-studio-v3.png?v=1"],
    ["Стул Eames белый", "assets/products/stulya-eames-studio-v3.png?v=1"],
    ["Стул барный \"Бомба\" белый", "assets/products/stulya-bomba-studio-v2.png?v=1"],
    ["Стул барный Hi-Tec белый", "assets/products/stulya-hi-tec-studio-v2.png?v=1"],
    ["Стул Adde White", "assets/products/stulya-adde-studio-v2.png?v=1"],
    ["Стул банкетный", "assets/products/stulya-banket-studio-v2.png?v=1"],
    ["Пластиковая складная скамья", "assets/products/stulya-bench-studio-v2.png?v=1"],
    ["Стул складной Сатурн белый", "assets/products/stulya-saturn-studio-v2.png?v=1"],
    ["Стул белый пластиковый", "assets/products/stulya-white-plastic-studio-v2.png?v=1"],
    ["Стул мягкий офисный ISO", "assets/products/stulya-iso-studio-v2.png?v=1"],
    ["Стол стеклянный \"Гидра\"", "assets/products/stoly-hydra-studio-v2.png?v=1"],
    ["Стол стеклянный круглый", "assets/products/stoly-glass-round-studio-v2.png?v=1"],
    ["Стол-книжка разборный", "assets/products/stoly-book-studio-v2.png?v=1"],
    ["Стол складной пластиковый", "assets/products/stoly-folding-plastic-studio-v2.png?v=1"],
    ["Стол журнальный квадратный", "assets/products/stoly-coffee-square-studio-v2.png?v=1"],
    ["Стол журнальный прямоугольный", "assets/products/stoly-coffee-rect-studio-v2.png?v=1"],
    ["Стол круглый большой ЛДСП", "assets/products/stoly-round-ldsp-studio-v2.png?v=1"],
    ["Стол прямоугольный ЛДСП", "assets/products/stoly-rect-ldsp-studio-v2.png?v=1"],
    ["Стол квадратный ЛДСП", "assets/products/stoly-square-ldsp-studio-v2.png?v=1"],
    ["Стол журнальный со стеклом", "assets/products/stoly-glass-coffee-studio-v2.png?v=1"],
    ["Фуршетный коктейльный стол", "assets/products/stoly-cocktail-studio-v2.png?v=1"],
    ["Тумба для президиума", "assets/products/stoly-presidium-studio-v2.png?v=1"],
    ["Столы для конференций", "assets/products/stoly-conference-studio-v2.png?v=1"],
    ["Информационная стойка", "assets/products/stojki-info-studio-v2.png?v=1"],
    ["Витрина низкая квадратная", "assets/products/stojki-vitrine-square-studio-v2.png?v=1"],
    ["Информационная стойка полукруглая", "assets/products/stojki-info-round-studio-v2.png?v=1"],
    ["Витрина низкая полукруглая", "assets/products/stojki-vitrine-round-studio-v2.png?v=1"],
    ["Витрина высокая узкая", "assets/products/stojki-vitrine-tall-narrow-studio-v2.png?v=1"],
    ["Витрина высокая", "assets/products/stojki-vitrine-tall-studio-v2.png?v=1"],
    ["Информационная стойка с фризом", "assets/products/stojki-info-frieze-studio-v2.png?v=1"],
    ["Стеллаж деревянный", "assets/products/stojki-shelving-wood-studio-v2.png?v=1"],
    ["Стеллаж металлический", "assets/products/stojki-shelving-metal-studio-v2.png?v=1"],
    ["Тумба-ресепшн квадратная", "assets/products/stojki-reception-studio-v2.png?v=1"],
    ["Трибуна для выступлений спикера", "assets/products/stojki-tribune-studio-v2.png?v=1"],
    ["Чехлы на стулья банкетные", "assets/products/tekstil-chair-covers-studio-v2.png?v=1"],
    ["Скатерть круглая белая", "assets/products/tekstil-round-cloth-studio-v2.png?v=1"],
    ["Скатерть прямоугольная белая", "assets/products/tekstil-rect-cloth-studio-v2.png?v=1"],
    ["Скатерть квадратная белая", "assets/products/tekstil-square-cloth-studio-v2.png?v=1"],
    ["Чехлы на столы коктейльные", "assets/products/tekstil-cocktail-cover-studio-v2.png?v=1"],
    ["Салфетка столовая белая", "assets/products/tekstil-napkin-studio-v2.png?v=1"],
    ["Напольная вешалка-стойка в аренду", "assets/equipment/wardrobe-hanger-stand-studio-v2.png?v=1"],
    ["Напольное вешало-гардероб в аренду", "assets/equipment/wardrobe-mobile-rack-studio-v2.png?v=1"],
    ["Плечики для одежды в аренду", "assets/equipment/wardrobe-clothes-hanger-studio-v2.png?v=1"],
    ["Навесная настенная вешалка в аренду", "assets/equipment/wardrobe-wall-hanger-studio-v2.png?v=1"],
    ["Столбик ограждающий с канатом в аренду", "assets/equipment/wardrobe-rope-barrier-studio-v2.png?v=1"],
    ["Стойка с лентой в аренду", "assets/equipment/wardrobe-belt-barrier-studio-v2.png?v=1"],
    ["Зеркало напольное в аренду", "assets/equipment/wardrobe-floor-mirror-studio-v2.png?v=1"],
    ["Комплект номерков для гардероба в аренду", "assets/equipment/wardrobe-tags-studio-v2.png?v=1"],
    ["Мобильный гардероб в аренду", "assets/equipment/wardrobe-cloakroom-racks-studio-v2.png?v=1"],
  ]);

  const sourceSpecificImages = new Map([
    ["assets/products/stojki-info-round.jpg", "assets/products/stojki-info-round-studio-v2.png?v=1"],
    ["assets/products/stojki-info-round-2.jpg", "assets/products/stojki-info-round-2-studio-v2.png?v=1"],
  ]);

  function replaceImage(card, replacementImage) {
    const image = card?.querySelector("img");
    if (!image) return;

    image.dataset.originalSrc ||= image.getAttribute("src") || "";
    image.src = replacementImage;
    image.srcset = "";
    image.classList.add("enhanced-product-image");
    image.dataset.src = replacementImage;
    image.dataset.full = replacementImage;
    image.dataset.lightboxSrc = replacementImage;

    const imageLink = image.closest("a");
    const currentHref = imageLink?.getAttribute("href") || "";
    if (imageLink && /\.(png|jpe?g|webp)(?:\?.*)?$/i.test(currentHref)) {
      imageLink.href = replacementImage;
    }

    if (!image.closest(".product-image-zoom-frame")) {
      const frame = document.createElement("figure");
      frame.className = "product-image-zoom-frame";
      image.parentNode.insertBefore(frame, image);
      frame.appendChild(image);
    }
  }

  function updateProductImage() {
    const labels = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, a, p, span, strong"
    );

    labels.forEach((label) => {
      const card = label.closest(
        "article, li, .product-card, .catalog-card, .service-product-card, .catalog-item, [class*='product-card'], [class*='catalog-card']"
      );
      const cardImage = card?.querySelector("img");
      const currentImage = cardImage?.dataset.originalSrc || cardImage?.getAttribute("src") || "";
      let replacementImage = productImages.get(label.textContent?.trim());
      sourceSpecificImages.forEach((specificImage, originalImage) => {
        if (currentImage.includes(originalImage)) replacementImage = specificImage;
      });
      if (!replacementImage) return;
      replaceImage(card, replacementImage);
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
