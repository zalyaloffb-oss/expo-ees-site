(() => {
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const current=()=>window.originalTentPages?.[new URLSearchParams(location.search).get('slug')];
  const carousel=(b,label)=>`<section class="tent-original-carousel" data-source-block="${esc(b.id)}" data-slider="${esc(b.id)}" aria-label="${esc(label)}"><div class="tent-original-viewport"><div class="tent-original-track">${b.images.map((i,n)=>`<button type="button" class="tent-original-slide" data-image="${n}" aria-label="Увеличить: ${esc(i.alt||label)}"><img src="${esc(i.src)}" alt="${esc(i.alt||label)}" loading="${n<2?'eager':'lazy'}"></button>`).join('')}</div></div><div class="tent-original-controls">${['both','arrows'].includes(b.settings.navigation)?'<button type="button" data-prev aria-label="Предыдущее фото">‹</button>':''}<button type="button" data-pause aria-label="Приостановить слайдер">Ⅱ</button>${['both','arrows'].includes(b.settings.navigation)?'<button type="button" data-next aria-label="Следующее фото">›</button>':''}</div>${['both','dots'].includes(b.settings.navigation)?`<div class="tent-original-dots">${b.images.map((_,n)=>`<button type="button" data-dot="${n}" aria-label="Слайд ${n+1}" aria-current="${n===0}"></button>`).join('')}</div>`:''}</section>`;
  window.renderOriginalTentPage=sidebar=>{const data=current();return `<section class="section tent-original-page"><div class="service-shell">${sidebar}<div class="service-content tent-original-content"><h1>${esc(data.title)}</h1>${data.blocks.map(b=>{
    if(b.type==='directions')return `<div class="tent-original-directions">${b.cards.map(c=>`<div class="tent-original-direction"><a class="tent-original-direction-photo" href="service-page.html?slug=${esc(c.slug)}"><img src="${esc(c.image)}" alt="${esc(c.title)}"><span><strong>${esc(c.title)}</strong><small>Подробнее</small></span></a><a class="tent-original-direction-label" href="service-page.html?slug=${esc(c.slug)}">${esc(c.label)}</a></div>`).join('')}</div>`;
    if(b.type==='carousel')return carousel(b,data.title);
    if(b.type==='text')return `<div class="tent-original-text" data-source-block="${esc(b.id)}">${b.html}</div>`;
    if(b.type==='products')return `<div class="tent-original-products tent-product-grid">${b.products.map(p=>`<article class="tent-original-product tent-product-card"><div class="tent-product-copy"><h3>${esc(p.title)}</h3></div>${carousel(p.slider,p.title)}<div class="tent-original-text tent-original-product-text">${p.html}</div></article>`).join('')}</div>`;
    return '';
  }).join('')}</div></div></section>`;};
  document.addEventListener('DOMContentLoaded',()=>{
    const data=current();if(!data)return;
    const sliders=data.blocks.flatMap(b=>b.type==='carousel'?[b]:b.type==='products'?b.products.map(p=>p.slider):[]);
    const dialog=document.createElement('dialog');dialog.className='tent-original-lightbox';dialog.innerHTML='<button type="button" data-close aria-label="Закрыть">×</button><button type="button" data-prev aria-label="Предыдущее фото">‹</button><img alt=""><button type="button" data-next aria-label="Следующее фото">›</button><p></p>';document.body.append(dialog);
    let photos=[],photoIndex=0,returnFocus;
    const showPhoto=n=>{photoIndex=(n+photos.length)%photos.length;const photo=photos[photoIndex];dialog.querySelector('img').src=photo.src;dialog.querySelector('img').alt=photo.alt;dialog.querySelector('p').textContent=`${photoIndex+1} / ${photos.length} — ${photo.alt}`;};
    dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-prev]').onclick=()=>showPhoto(photoIndex-1);dialog.querySelector('[data-next]').onclick=()=>showPhoto(photoIndex+1);dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>returnFocus?.focus());dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')showPhoto(photoIndex-1);if(e.key==='ArrowRight')showPhoto(photoIndex+1);});
    let lightTouch;dialog.addEventListener('touchstart',e=>{if(e.touches.length===1)lightTouch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});dialog.addEventListener('touchend',e=>{if(!lightTouch)return;const dx=e.changedTouches[0].clientX-lightTouch.x,dy=e.changedTouches[0].clientY-lightTouch.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))showPhoto(photoIndex+(dx<0?1:-1));lightTouch=null;},{passive:true});
    sliders.forEach(block=>{
      const box=document.querySelector(`[data-slider="${block.id}"]`);if(!box)return;
      const track=box.querySelector('.tent-original-track'),slides=[...track.children],dots=[...box.querySelectorAll('[data-dot]')],mq=matchMedia('(max-width:1024px)');
      let index=0,timer,paused=matchMedia('(prefers-reduced-motion:reduce)').matches||block.settings.autoplay==='no',touch,dragged=false;
      const count=()=>mq.matches?Number(block.settings.slides_to_show_tablet||1):Number(block.settings.slides_to_show||1);
      slides.slice(0,2).forEach(e=>{const clone=e.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.tabIndex=-1;track.append(clone);});
      const paint=(animate=true)=>{box.style.setProperty('--tent-slides',count());track.style.transitionDuration=animate?`${block.settings.speed||500}ms`:'0ms';track.style.transform=`translateX(-${index*100/count()}%)`;dots.forEach((d,n)=>d.setAttribute('aria-current',String(n===index%slides.length)));};
      const move=n=>{if(index>=slides.length){index=0;paint(false);track.getBoundingClientRect();}index+=n;if(index<0)index=slides.length-1;paint();};
      const stop=()=>clearInterval(timer),start=()=>{stop();if(!paused&&slides.length>1)timer=setInterval(()=>move(1),Number(block.settings.autoplay_speed)||2000);};
      track.addEventListener('transitionend',()=>{if(index>=slides.length){index=0;paint(false);}});
      box.querySelector('[data-prev]')?.addEventListener('click',()=>{move(-1);start();});box.querySelector('[data-next]')?.addEventListener('click',()=>{move(1);start();});
      const pause=box.querySelector('[data-pause]'),paintPause=()=>{pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Запустить слайдер':'Приостановить слайдер');};pause.onclick=()=>{paused=!paused;paintPause();start();};
      dots.forEach((d,n)=>d.onclick=()=>{index=n;paint();start();});box.addEventListener('focusin',stop);box.addEventListener('focusout',start);if(block.settings.pause_on_hover==='yes'){box.addEventListener('mouseenter',stop);box.addEventListener('mouseleave',start);}
      track.addEventListener('click',e=>{if(dragged){e.preventDefault();return;}const button=e.target.closest('[data-image]');if(!button)return;returnFocus=button;photos=block.images;showPhoto(Number(button.dataset.image));dialog.showModal();stop();});
      box.addEventListener('touchstart',e=>{dragged=false;if(e.touches.length!==1){touch=null;return;}touch={x:e.touches[0].clientX,y:e.touches[0].clientY};stop();},{passive:true});box.addEventListener('touchend',e=>{if(touch){const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){dragged=true;move(dx<0?1:-1);}}touch=null;start();},{passive:true});box.addEventListener('touchcancel',()=>{touch=null;start();},{passive:true});mq.addEventListener('change',()=>paint(false));paint(false);paintPause();start();
    });
  });
})();
