(() => {
  const init = () => {
    const key = 'expo-request-cart-v1';
    const clamp = value => Math.min(9999, Math.max(1, Math.floor(Number(value) || 1)));
    let items = [];
    try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) items = saved.filter(x => x && typeof x.id === 'string' && typeof x.title === 'string').map(x => ({id:x.id,title:x.title,quantity:clamp(x.quantity)})); } catch {}
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h3l3 12h11l3-9H6M9 20h.01M18 20h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const button = document.createElement('button'); button.className = 'request-cart-fab'; button.type='button'; button.innerHTML=icon+'<span></span>'; document.body.append(button);
    const dialog=document.createElement('dialog'); dialog.className='request-cart-dialog';
    dialog.innerHTML='<div class="request-cart-head"><h2>Корзина</h2><button type="button" aria-label="Закрыть корзину">×</button></div><div class="request-cart-items"></div><button class="btn btn-primary request-cart-create" type="button">Создать заявку</button><form class="request-cart-form" hidden><h3>Заявка на аренду</h3><label>Ваше имя<input name="name" autocomplete="name" required maxlength="100"></label><label>Телефон или email<input name="contact" autocomplete="tel" required maxlength="150"></label><label>Дата, место и комментарий<textarea name="comment" maxlength="2000"></textarea></label><button class="btn btn-primary" type="submit">Подготовить письмо</button><p>Откроется ваша почта с перечнем товаров. Отправьте письмо, чтобы передать заявку.</p><button class="request-cart-download" type="button">Скачать заявку (.txt)</button></form>';
    document.body.append(dialog);
    const list=dialog.querySelector('.request-cart-items'), form=dialog.querySelector('form'), create=dialog.querySelector('.request-cart-create');
    const announce=document.createElement('span'); announce.className='cart-announcement'; announce.setAttribute('role','status'); document.body.append(announce);
    const persist=()=>{try {localStorage.setItem(key,JSON.stringify(items));}catch{} render();};
    function quantityControl(value,onChange) {
      const group=document.createElement('div'); group.className='request-quantity';
      const minus=document.createElement('button'),input=document.createElement('input'),plus=document.createElement('button');
      minus.type=plus.type='button'; minus.textContent='−'; plus.textContent='+'; minus.setAttribute('aria-label','Уменьшить количество'); plus.setAttribute('aria-label','Увеличить количество');
      input.type='number';input.min='1';input.max='9999';input.step='1';input.value=value;input.setAttribute('aria-label','Количество');
      const change=v=>{input.value=clamp(v);onChange(Number(input.value));};
      minus.onclick=()=>change(Number(input.value)-1);plus.onclick=()=>change(Number(input.value)+1);input.onchange=()=>change(input.value);group.append(minus,input,plus);return group;
    }
    function render(){
      const total=items.reduce((a,b)=>a+b.quantity,0);button.querySelector('span').textContent=total;button.setAttribute('aria-label',`Корзина, товаров: ${total}`);list.replaceChildren();
      if(!items.length){list.textContent='Корзина пока пуста. Добавьте товары из каталога.';form.hidden=true;}
      items.forEach(item=>{const row=document.createElement('div');row.className='request-cart-row';const title=document.createElement('strong');title.textContent=item.title;const remove=document.createElement('button');remove.type='button';remove.textContent='Удалить';remove.setAttribute('aria-label',`Удалить ${item.title}`);remove.onclick=()=>{items=items.filter(x=>x.id!==item.id);persist();};row.append(title,quantityControl(item.quantity,q=>{item.quantity=q;persist();}),remove);list.append(row);});create.disabled=!items.length;
    }
    document.querySelectorAll('.product-card,.tent-product-card').forEach(card=>{
      const title=card.querySelector('h3')?.textContent.trim();if(!title)return;
      const src=card.querySelector('img')?.getAttribute('src')||'';const id=title+'|'+src;
      let quantity=1;const controls=document.createElement('div');controls.className='product-cart-controls';const add=document.createElement('button');add.className='product-cart-add';add.type='button';add.innerHTML=icon;add.setAttribute('aria-label',`Добавить в корзину: ${title}`);add.title='Добавить в корзину';
      add.onclick=()=>{const existing=items.find(x=>x.id===id);if(existing)existing.quantity=clamp(existing.quantity+quantity);else items.push({id,title,quantity});persist();announce.textContent=`${title} — добавлено ${quantity} шт.`;add.classList.add('is-added');setTimeout(()=>add.classList.remove('is-added'),800);};
      controls.append(quantityControl(1,q=>quantity=q),add);card.append(controls);
    });
    button.onclick=()=>{render();dialog.showModal();};dialog.querySelector('.request-cart-head button').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    create.onclick=()=>{form.hidden=false;form.querySelector('input').focus();};
    const requestText=()=>{const d=new FormData(form);return ['Заявка на аренду',...items.map((x,i)=>`${i+1}. ${x.title} — ${x.quantity} шт.`),'',`Имя: ${d.get('name')}`,`Контакт: ${d.get('contact')}`,`Комментарий: ${d.get('comment')}`].join('\n');};
    form.onsubmit=e=>{e.preventDefault();if(!items.length)return;window.location.href='mailto:info@expo-ees.ru?subject='+encodeURIComponent('Заявка на аренду с сайта')+'&body='+encodeURIComponent(requestText());};
    dialog.querySelector('.request-cart-download').onclick=()=>{if(!form.reportValidity())return;const url=URL.createObjectURL(new Blob(['\uFEFF'+requestText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Заявка-ИвентЭкспоСервис.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
    window.addEventListener('storage',e=>{if(e.key===key)try{const v=JSON.parse(e.newValue||'[]');if(Array.isArray(v)){items=v.filter(x=>x&&typeof x.id==='string'&&typeof x.title==='string').map(x=>({...x,quantity:clamp(x.quantity)}));render();}}catch{}});render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
