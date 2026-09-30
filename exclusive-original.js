(() => {
  'use strict';
  const esc = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pageData = () => window.originalStandPages?.[new URLSearchParams(location.search).get('slug')] || window.exclusiveOriginalData;
  window.renderOriginalExclusivePage = (sidebar) => {
    const data = pageData();
    return `<section class="section exclusive-original-page"><div class="service-shell">${sidebar}<div class="service-content exclusive-original-content"><h1>${esc(data.title)}</h1>${data.blocks.map((block, index) => {
      if (block.hidden) return `<div hidden data-source-block="${block.id}">${block.html || ''}</div>`;
      if (block.type === 'image') return `<figure class="original-stand-image" data-source-block="${block.id}"><img src="${esc(block.images[0].src)}" alt="${esc(block.images[0].alt)}"></figure>`;
      if (block.type === 'heading') return `<h2 data-source-block="${block.id}">${esc(block.text)}</h2>`;
      if (block.type === 'text') return `<div class="exclusive-original-text" data-source-block="${block.id}">${block.html}</div>`;
      return `<section class="exclusive-original-carousel" data-source-block="${block.id}" data-block-index="${index}" aria-label="${esc(block.label || (data === window.exclusiveOriginalData ? (index === 0 ? data.title : index === 4 ? 'Примеры выставочных стендов с подвесом' : 'Примеры проектов выставочных стендов') : data.title))}"><div class="exclusive-original-viewport"><div class="exclusive-original-track">${block.images.map((image, i) => `<button class="exclusive-original-slide" type="button" data-image="${i}" aria-label="Увеличить: ${esc(image.alt || 'Выставочный стенд')}"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="${index === 0 && i < 2 ? 'eager' : 'lazy'}"></button>`).join('')}</div></div><div class="exclusive-original-controls"><button type="button" data-prev aria-label="Предыдущий слайд">‹</button><button type="button" data-pause aria-label="Приостановить слайдер">Ⅱ</button><button type="button" data-next aria-label="Следующий слайд">›</button></div></section>`;
    }).join('')}</div></div></section>`;
  };
  document.addEventListener('DOMContentLoaded', () => {
    const carousels = [...document.querySelectorAll('.exclusive-original-carousel')];
    if (!carousels.length) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'exclusive-original-lightbox';
    dialog.innerHTML = '<button type="button" data-close aria-label="Закрыть">×</button><button type="button" data-back aria-label="Предыдущее фото">‹</button><img alt=""><button type="button" data-forward aria-label="Следующее фото">›</button><p></p>';
    document.body.append(dialog);
    let activeImages = [], activeIndex = 0, returnFocus;
    const showImage = step => {
      activeIndex = (step + activeImages.length) % activeImages.length;
      const item = activeImages[activeIndex];
      dialog.querySelector('img').src = item.src;
      dialog.querySelector('img').alt = item.alt;
      dialog.querySelector('p').textContent = `${activeIndex + 1} / ${activeImages.length} — ${item.alt}`;
    };
    dialog.querySelector('[data-close]').onclick = () => dialog.close();
    dialog.querySelector('[data-back]').onclick = () => showImage(activeIndex - 1);
    dialog.querySelector('[data-forward]').onclick = () => showImage(activeIndex + 1);
    dialog.addEventListener('close', () => returnFocus?.focus());
    dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', e => { if(e.key === 'ArrowLeft') showImage(activeIndex - 1); if(e.key === 'ArrowRight') showImage(activeIndex + 1); });
    carousels.forEach(carousel => {
      const block = pageData().blocks[Number(carousel.dataset.blockIndex)];
      const track = carousel.querySelector('.exclusive-original-track');
      const slides = [...track.children];
      const query = matchMedia('(max-width: 1024px)');
      const dots = [];
      if (['both','dots'].includes(block.settings.navigation)) {
        carousel.classList.add('has-source-navigation');
        const nav = document.createElement('div'); nav.className = 'original-stand-dots';
        slides.forEach((_, index) => { const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`Слайд ${index+1}`);dot.onclick=()=>{current=index;paint();start();};nav.append(dot);dots.push(dot); });
        carousel.append(nav);
      }
      let current = 0, timer, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Two end clones allow an uninterrupted one-photo advance, matching the source.
      slides.slice(0, 2).forEach(slide => { const clone = slide.cloneNode(true); clone.setAttribute('aria-hidden','true'); clone.tabIndex = -1; track.append(clone); });
      const paint = (animate = true) => { dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i === current % slides.length))); track.style.transitionDuration = animate ? '500ms' : '0ms'; track.style.transform = `translateX(-${current * (query.matches ? 100 : 50)}%)`; };
      const move = step => {
        if(current >= slides.length) {current = 0;paint(false); track.getBoundingClientRect();}
        current += step;
        if(current < 0) current = slides.length - 1;
        paint();
      };
      track.addEventListener('transitionend', () => {if(current >= slides.length){current=0;paint(false);}});
      const stop = () => clearInterval(timer);
      const start = () => {stop(); if(!paused) timer=setInterval(()=>move(1),block.settings.autoplay_speed);};
      carousel.querySelector('[data-next]').onclick = () => {move(1); start();};
      carousel.querySelector('[data-prev]').onclick = () => {move(-1); start();};
      const pause = carousel.querySelector('[data-pause]');
      const updatePause = () => {pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Запустить слайдер':'Приостановить слайдер');};
      pause.onclick = () => {paused=!paused;updatePause();start();};
      if(block.settings.pause_on_hover==='yes'){carousel.addEventListener('mouseenter',stop);carousel.addEventListener('mouseleave',start);}
      carousel.addEventListener('focusin',stop);
      carousel.addEventListener('focusout',start);
      track.addEventListener('click',e=>{const button=e.target.closest('[data-image]');if(!button)return;returnFocus=button;activeImages=block.images;showImage(Number(button.dataset.image));dialog.showModal();});
      let touchX;
      carousel.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;stop();},{passive:true});
      carousel.addEventListener('touchend',e=>{if(touchX!==undefined&&Math.abs(e.changedTouches[0].clientX-touchX)>40)move(e.changedTouches[0].clientX<touchX?1:-1);touchX=undefined;start();},{passive:true});
      query.addEventListener('change',()=>paint(false));
      updatePause();paint(false);start();
    });
  });
})();
