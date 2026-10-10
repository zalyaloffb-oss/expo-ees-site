(() => {
 const init=()=>{
  const filter=document.querySelector('.article-year-filter');if(!filter)return;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='article-year-toggle';toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<span>ГОД ПУБЛИКАЦИИ: ВСЕ ГОДЫ</span><i aria-hidden="true"></i>';
  const options=document.createElement('div');options.className='article-year-options';options.id='article-year-options';
  const buttons=[...filter.querySelectorAll('[data-article-year]')];buttons.forEach(b=>options.append(b));filter.prepend(toggle,options);filter.classList.add('year-collapsed');toggle.setAttribute('aria-controls',options.id);
  const close=()=>{filter.classList.add('year-collapsed');toggle.setAttribute('aria-expanded','false');};
  toggle.onclick=()=>{const collapsed=filter.classList.toggle('year-collapsed');toggle.setAttribute('aria-expanded',String(!collapsed));};
  buttons.forEach(b=>b.addEventListener('click',()=>{toggle.querySelector('span').textContent='ГОД ПУБЛИКАЦИИ: '+b.textContent.toUpperCase();close();if(matchMedia('(max-width:640px)').matches)toggle.focus();}));
  filter.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
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
