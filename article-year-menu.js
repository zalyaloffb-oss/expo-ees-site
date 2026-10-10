(() => {
 const init=()=>{
 const filter=document.querySelector('.article-year-filter');if(!filter)return;
 const buttons=[...filter.querySelectorAll('[data-article-year]')];
 const track=document.createElement('div');track.className='article-years-track';buttons.forEach(b=>track.append(b));
 const prev=document.createElement('button'),next=document.createElement('button');prev.type=next.type='button';prev.className='article-year-arrow previous';next.className='article-year-arrow next';prev.setAttribute('aria-label','Предыдущие годы');next.setAttribute('aria-label','Следующие годы');prev.textContent='‹';next.textContent='›';filter.prepend(prev,track,next);
 prev.onclick=()=>track.scrollBy({left:-160,behavior:'smooth'});next.onclick=()=>track.scrollBy({left:160,behavior:'smooth'});
 };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
(() => {
 const init=()=>{
  const shell=document.querySelector('.portfolio-project-nav-shell');if(!shell)return;
  const nav=shell.querySelector('.portfolio-project-nav');const toggle=document.createElement('button');toggle.type='button';toggle.className='portfolio-menu-toggle';toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<span></span><i aria-hidden="true"></i>';shell.prepend(toggle);shell.classList.add('portfolio-menu-collapsed');
  const sync=()=>{toggle.querySelector('span').textContent=nav.querySelector('a.is-active')?.textContent.trim()||'МЕРОПРИЯТИЯ';};sync();new MutationObserver(sync).observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
  const close=()=>{shell.classList.add('portfolio-menu-collapsed');toggle.setAttribute('aria-expanded','false');};toggle.onclick=()=>{toggle.setAttribute('aria-expanded',String(!shell.classList.toggle('portfolio-menu-collapsed')));};
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));shell.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
 };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
/* Swipe through photos using the same navigation as the arrow buttons. */
(() => {
 let gesture=null;
 document.addEventListener('touchstart',e=>{
  const viewer=e.target.closest('.portfolio-lightbox.is-open');
  if(!viewer||e.touches.length!==1||!e.target.matches('img')){gesture=null;return;}
  const p=e.touches[0];gesture={viewer,x:p.clientX,y:p.clientY};
 },{passive:true});
 document.addEventListener('touchend',e=>{
  const start=gesture;gesture=null;if(!start||!start.viewer.classList.contains('is-open')||!e.changedTouches.length)return;
  const p=e.changedTouches[0],dx=p.clientX-start.x,dy=p.clientY-start.y;
  if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.3)return;
  start.viewer.querySelector(dx<0?'.portfolio-lightbox-next':'.portfolio-lightbox-prev')?.click();
 },{passive:true});
 document.addEventListener('touchcancel',()=>gesture=null,{passive:true});
})();
/* Mobile article reading order and touch gallery. */
(() => {
 const init=()=>{
 const article=document.querySelector('.article-full');if(!article)return;
 const meta=article.querySelector('.article-full-meta');if(meta){meta.querySelectorAll('span')[1]?.remove();const date=meta.querySelector('span');if(date)date.textContent=date.textContent.replace(/г\./gi,'г');}
 const content=article.querySelector('.article-full-content');const lead=article.querySelector('.article-full-lead'),back=article.querySelector('.article-back-link');const nodes=[lead,back].filter(Boolean);const homes=nodes.map(n=>{const p=document.createComment('article text position');n.before(p);return p;});const mq=matchMedia('(max-width:640px)');const sync=()=>{if(!content)return;if(mq.matches){if(lead)content.prepend(lead);if(back)content.append(back);}else nodes.forEach((n,i)=>homes[i].after(n));};sync();mq.addEventListener('change',sync);
 const slider=article.querySelector('[data-article-media-slider]');if(!slider)return;let origin;
 slider.addEventListener('touchstart',e=>{origin=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
 slider.addEventListener('touchend',e=>{if(!origin)return;const p=e.changedTouches[0],dx=p.clientX-origin.x,dy=p.clientY-origin.y;origin=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)slider.querySelector(dx<0?'.article-media-next':'.article-media-prev')?.click();},{passive:true});slider.addEventListener('touchcancel',()=>origin=null,{passive:true});
 };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
