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
