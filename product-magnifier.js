(() => {
  const start = () => {
    const lens = document.createElement('div');
    lens.className = 'product-hold-lens';
    lens.setAttribute('aria-hidden', 'true');
    document.body.append(lens);
    let timer, active = false, target, origin, point, suppressClick = false;
    const stop = () => { clearTimeout(timer); if (active) { suppressClick = true; setTimeout(() => suppressClick = false, 400); } active = false; lens.hidden = true; target = null; };
    lens.hidden = true;
    const paint = () => {
      if (!target || !active) return;
      const rect = target.getBoundingClientRect();
      const style = getComputedStyle(target);
      const scale = style.objectFit === 'cover' ? Math.max(rect.width / target.naturalWidth, rect.height / target.naturalHeight) : Math.min(rect.width / target.naturalWidth, rect.height / target.naturalHeight);
      const w = target.naturalWidth * scale, h = target.naturalHeight * scale;
      const x = Math.max(0, Math.min(rect.width, point.x - rect.left));
      const y = Math.max(0, Math.min(rect.height, point.y - rect.top));
      const diameter = Math.max(1, Math.min(450, innerWidth - 16, innerHeight - 16));
      const zoom = Math.max(diameter / w, diameter / h) * 1.3;
      lens.style.width = lens.style.height = `${diameter}px`;
      lens.style.left = `${Math.max(4, Math.min(innerWidth - diameter - 4, point.x - diameter / 2))}px`;
      lens.style.top = `${Math.max(4, Math.min(innerHeight - diameter - 4, point.y - diameter - 24))}px`;
      lens.style.backgroundImage = `url("${target.currentSrc}")`;
      lens.style.backgroundSize = `${w * zoom}px ${h * zoom}px`;
      lens.style.backgroundPosition = `${Math.min(0, Math.max(diameter - w * zoom, diameter / 2 - (x - (rect.width - w) / 2) * zoom))}px ${Math.min(0, Math.max(diameter - h * zoom, diameter / 2 - (y - (rect.height - h) / 2) * zoom))}px`;
    };
    document.querySelectorAll('.product-card img,.tent-product-card img').forEach(img => {
      img.classList.add('product-hold-image'); img.draggable = false;
      img.addEventListener('contextmenu', e => e.preventDefault());
      img.addEventListener('pointerdown', e => {
        if (!e.isPrimary || e.button !== 0 || !img.naturalWidth) return;
        stop(); target = img; origin = point = { x:e.clientX, y:e.clientY };
        timer = setTimeout(() => { if (!target) return; active = true; lens.hidden = false; paint(); }, 320);
      });
      img.addEventListener('click', e => { if (suppressClick) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    });
    document.addEventListener('pointermove', e => {
      if (!target) return;
      point = {x:e.clientX,y:e.clientY};
      if (!active && Math.hypot(point.x-origin.x,point.y-origin.y)>10) { stop(); return; }
      paint();
    }, {passive:true});
    document.addEventListener('touchmove', e => { if(active) e.preventDefault(); }, {passive:false});
    document.addEventListener('pointerup', stop);
    document.addEventListener('pointercancel', stop);
    window.addEventListener('blur', stop);
    window.addEventListener('scroll', stop, {passive:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
