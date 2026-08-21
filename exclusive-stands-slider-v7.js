(function () {
  "use strict";

  var TARGET_SLUG = "eksklyuzivnyye_vystavochnyye_stendy";
  var ROOT_ID = "exclusive-stands-top-slider";
  var LIGHTBOX_ID = "exclusive-stands-lightbox";
  var AUTO_DELAY = 5000;

  function getSlug() {
    return new URLSearchParams(window.location.search).get("slug") || "";
  }

  if (getSlug() !== TARGET_SLUG) return;

  function injectStyles() {
    if (document.getElementById("exclusive-stands-slider-styles")) return;

    var style = document.createElement("style");
    style.id = "exclusive-stands-slider-styles";
    style.textContent = [
      "#" + ROOT_ID + "{position:relative;width:100%;margin:0 0 10px;overflow:hidden;border:1px solid rgba(10,214,240,.34);border-radius:8px;background:#05090f;isolation:isolate}",
      "#" + ROOT_ID + " .ess-viewport{overflow:hidden;width:100%}",
      "#" + ROOT_ID + " .ess-track{display:flex;transition:transform .65s cubic-bezier(.22,.61,.36,1);will-change:transform}",
      "#" + ROOT_ID + " .ess-slide{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;min-width:100%;padding:8px;box-sizing:border-box}",
      "#" + ROOT_ID + " .ess-image{position:relative;display:block;overflow:hidden;aspect-ratio:1.58/1;border-radius:6px;background:#080c13;cursor:zoom-in}",
      "#" + ROOT_ID + " .ess-image img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .45s ease,filter .45s ease}",
      "#" + ROOT_ID + " .ess-image:hover img{transform:scale(1.035);filter:brightness(1.08)}",
      "#" + ROOT_ID + " .ess-arrow{position:absolute;top:50%;z-index:3;display:grid;place-items:center;width:44px;height:56px;padding:0;border:1px solid rgba(12,220,245,.55);border-radius:8px;background:rgba(2,8,14,.82);color:#11def5;cursor:pointer;transform:translateY(-50%);backdrop-filter:blur(12px);transition:background .2s ease,color .2s ease}",
      "#" + ROOT_ID + " .ess-arrow:hover{background:rgba(10,214,240,.18);color:#fff}",
      "#" + ROOT_ID + " .ess-prev{left:16px}",
      "#" + ROOT_ID + " .ess-next{right:16px}",
      "#" + ROOT_ID + " .ess-arrow svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      "#" + ROOT_ID + " .ess-dots{position:absolute;left:50%;bottom:16px;z-index:3;display:flex;gap:7px;transform:translateX(-50%)}",
      "#" + ROOT_ID + " .ess-dot{width:7px;height:7px;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.42);cursor:pointer;transition:width .2s ease,background .2s ease}",
      "#" + ROOT_ID + " .ess-dot.is-active{width:24px;border-radius:8px;background:linear-gradient(90deg,#0fd9f1,#7458ff)}",
      "#" + LIGHTBOX_ID + "{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(0,4,9,.92);backdrop-filter:blur(14px)}",
      "#" + LIGHTBOX_ID + ".is-open{display:flex}",
      "#" + LIGHTBOX_ID + " .ess-lightbox-image{display:block;max-width:min(1500px,88vw);max-height:86vh;object-fit:contain;border:1px solid rgba(10,214,240,.45);border-radius:8px;background:#fff}",
      "#" + LIGHTBOX_ID + " .ess-lightbox-control{position:absolute;display:grid;place-items:center;width:48px;height:48px;padding:0;border:1px solid rgba(10,214,240,.5);border-radius:8px;background:rgba(3,10,18,.88);color:#fff;cursor:pointer}",
      "#" + LIGHTBOX_ID + " .ess-lightbox-prev{left:24px;top:50%;transform:translateY(-50%)}",
      "#" + LIGHTBOX_ID + " .ess-lightbox-next{right:24px;top:50%;transform:translateY(-50%)}",
      "#" + LIGHTBOX_ID + " .ess-lightbox-close{right:24px;top:24px;font-size:28px}",
      "#" + LIGHTBOX_ID + " .ess-lightbox-count{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);color:#fff;font:500 13px/1.2 inherit}",
      "@media(max-width:760px){#" + ROOT_ID + " .ess-slide{grid-template-columns:1fr;padding:6px}#" + ROOT_ID + " .ess-image{aspect-ratio:1.35/1}#" + ROOT_ID + " .ess-arrow{width:38px;height:48px}#" + ROOT_ID + " .ess-prev{left:10px}#" + ROOT_ID + " .ess-next{right:10px}#" + ROOT_ID + " .ess-dots{bottom:10px}#" + LIGHTBOX_ID + "{padding:12px}#" + LIGHTBOX_ID + " .ess-lightbox-image{max-width:94vw;max-height:82vh}#" + LIGHTBOX_ID + " .ess-lightbox-prev{left:8px}#" + LIGHTBOX_ID + " .ess-lightbox-next{right:8px}#" + LIGHTBOX_ID + " .ess-lightbox-close{right:10px;top:10px}}",
      "@media(prefers-reduced-motion:reduce){#" + ROOT_ID + " .ess-track,#" + ROOT_ID + " .ess-image img{transition:none}}"
    ].join("");
    document.head.appendChild(style);
  }

  function imageUrl(img) {
    return img.currentSrc || img.getAttribute("src") || img.getAttribute("data-src") || "";
  }

  function isUsableImage(img) {
    if (!img || img.closest("header,footer,.site-header,.site-footer,.clients,.client,.logo,.map,.leaflet-container")) return false;

    var src = imageUrl(img);
    var text = (src + " " + (img.alt || "") + " " + (img.className || "")).toLowerCase();
    if (!src || /logo|icon|avatar|marker|sprite|map|qr|favicon/.test(text)) return false;

    var rect = img.getBoundingClientRect();
    var width = img.naturalWidth || rect.width || 0;
    var height = img.naturalHeight || rect.height || 0;
    return width >= 420 && height >= 220;
  }

  function collectImages() {
    var scope = document.querySelector("main") || document.body;
    var seen = Object.create(null);
    var result = [];

    Array.prototype.forEach.call(scope.querySelectorAll("img"), function (img) {
      if (!isUsableImage(img)) return;
      var src = imageUrl(img);
      if (seen[src]) return;
      seen[src] = true;
      result.push({
        src: src,
        alt: img.alt || "Эксклюзивный выставочный стенд"
      });
    });

    return result.slice(0, 16);
  }

  function findInsertionPoint() {
    var heading = Array.prototype.find.call(
      document.querySelectorAll("h1,h2,h3"),
      function (node) {
        return /эксклюзивн.*выставочн.*стенд/i.test(node.textContent || "");
      }
    );

    if (heading) {
      var section = heading.closest("section,.section,.service-section,.content-section,.service-hero,.page-hero");
      if (section && section.parentElement) {
        return { parent: section.parentElement, before: section };
      }
      if (heading.parentElement) {
        return { parent: heading.parentElement, before: heading };
      }
    }

    var main = document.querySelector(
      ".service-main-content,.service-content,.catalog-main,.catalog-content,.content-area,article,main"
    );
    if (main) return { parent: main, before: main.firstElementChild };

    return { parent: document.body, before: document.body.firstElementChild };
  }

  function arrowMarkup(direction) {
    return direction === "left"
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  }

  function createLightbox(images) {
    var existing = document.getElementById(LIGHTBOX_ID);
    if (existing) existing.remove();

    var lightbox = document.createElement("div");
    lightbox.id = LIGHTBOX_ID;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Просмотр фотографий");
    lightbox.innerHTML =
      '<button class="ess-lightbox-control ess-lightbox-close" type="button" aria-label="Закрыть">×</button>' +
      '<button class="ess-lightbox-control ess-lightbox-prev" type="button" aria-label="Предыдущая фотография">' + arrowMarkup("left") + "</button>" +
      '<img class="ess-lightbox-image" alt="">' +
      '<button class="ess-lightbox-control ess-lightbox-next" type="button" aria-label="Следующая фотография">' + arrowMarkup("right") + "</button>" +
      '<div class="ess-lightbox-count" aria-live="polite"></div>';
    document.body.appendChild(lightbox);

    var current = 0;
    var output = lightbox.querySelector(".ess-lightbox-image");
    var count = lightbox.querySelector(".ess-lightbox-count");

    function render() {
      output.src = images[current].src;
      output.alt = images[current].alt;
      count.textContent = current + 1 + " / " + images.length;
    }

    function open(index) {
      current = index;
      render();
      lightbox.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("is-open");
      document.documentElement.style.overflow = "";
    }

    function move(delta) {
      current = (current + delta + images.length) % images.length;
      render();
    }

    lightbox.querySelector(".ess-lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".ess-lightbox-prev").addEventListener("click", function () { move(-1); });
    lightbox.querySelector(".ess-lightbox-next").addEventListener("click", function () { move(1); });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    });

    return { open: open };
  }

  function mount(images) {
    if (document.getElementById(ROOT_ID) || images.length < 2) return false;
    injectStyles();

    var perPage = window.matchMedia("(max-width: 760px)").matches ? 1 : 2;
    var pages = [];
    for (var i = 0; i < images.length; i += perPage) {
      pages.push(images.slice(i, i + perPage));
    }

    var root = document.createElement("section");
    root.id = ROOT_ID;
    root.setAttribute("aria-label", "Галерея эксклюзивных выставочных стендов");

    var slides = pages.map(function (page, pageIndex) {
      return '<div class="ess-slide" role="group" aria-label="' + (pageIndex + 1) + " из " + pages.length + '">' +
        page.map(function (item) {
          var index = images.indexOf(item);
          return '<button class="ess-image" type="button" data-image-index="' + index + '" aria-label="Увеличить фотографию">' +
            '<img src="' + item.src.replace(/"/g, "&quot;") + '" alt="' + item.alt.replace(/"/g, "&quot;") + '" loading="' + (pageIndex ? "lazy" : "eager") + '">' +
          "</button>";
        }).join("") +
      "</div>";
    }).join("");

    root.innerHTML =
      '<div class="ess-viewport"><div class="ess-track">' + slides + "</div></div>" +
      '<button class="ess-arrow ess-prev" type="button" aria-label="Предыдущий слайд">' + arrowMarkup("left") + "</button>" +
      '<button class="ess-arrow ess-next" type="button" aria-label="Следующий слайд">' + arrowMarkup("right") + "</button>" +
      '<div class="ess-dots">' +
        pages.map(function (_, index) {
          return '<button class="ess-dot' + (index === 0 ? " is-active" : "") + '" type="button" data-slide="' + index + '" aria-label="Слайд ' + (index + 1) + '"></button>';
        }).join("") +
      "</div>";

    var point = findInsertionPoint();
    point.parent.insertBefore(root, point.before || null);

    var track = root.querySelector(".ess-track");
    var dots = root.querySelectorAll(".ess-dot");
    var current = 0;
    var timer = null;
    var lightbox = createLightbox(images);

    function go(index) {
      current = (index + pages.length) % pages.length;
      track.style.transform = "translate3d(-" + current * 100 + "%,0,0)";
      Array.prototype.forEach.call(dots, function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (pages.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = window.setInterval(function () { go(current + 1); }, AUTO_DELAY);
      }
    }

    root.querySelector(".ess-prev").addEventListener("click", function () { go(current - 1); start(); });
    root.querySelector(".ess-next").addEventListener("click", function () { go(current + 1); start(); });
    Array.prototype.forEach.call(dots, function (dot) {
      dot.addEventListener("click", function () {
        go(Number(dot.getAttribute("data-slide")));
        start();
      });
    });
    Array.prototype.forEach.call(root.querySelectorAll(".ess-image"), function (button) {
      button.addEventListener("click", function () {
        lightbox.open(Number(button.getAttribute("data-image-index")));
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    var touchStart = null;
    root.addEventListener("touchstart", function (event) {
      touchStart = event.touches[0].clientX;
      stop();
    }, { passive: true });
    root.addEventListener("touchend", function (event) {
      if (touchStart === null) return;
      var delta = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(delta) > 45) go(current + (delta < 0 ? 1 : -1));
      touchStart = null;
      start();
    }, { passive: true });

    if (pages.length < 2) {
      root.querySelector(".ess-prev").hidden = true;
      root.querySelector(".ess-next").hidden = true;
      root.querySelector(".ess-dots").hidden = true;
    }

    start();
    return true;
  }

  function tryMount(attempt) {
    if (document.getElementById(ROOT_ID)) return;
    var images = collectImages();
    if (mount(images)) return;
    if (attempt < 20) window.setTimeout(function () { tryMount(attempt + 1); }, 350);
  }

  function init() {
    tryMount(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
