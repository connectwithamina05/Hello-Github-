const categories=['Брускетты','Гастробоксы','Десерты','Канапе','Мини-бургеры','Салаты','Сэндвичи','Тарталетки','Фритюр','Эклеры'];
const features=['Для вегетарианцев','С индейкой','С курицей','С морепродуктами','С мясом'];
const products=[
  {name:'ТАРТАЛЕТКА СО СВЕКОЛЬНЫМ МУССОМ, КАПЕРСАМИ И МИНДАЛЁМ',price:100,cat:'Тарталетки',feature:'Для вегетарианцев',img:1,tag:'подойдёт для вегетарианцев',tagSvg:'assets/tag-veg.svg'},
  {name:'ТАРТАЛЕТКА С ТАРТАРОМ ИЗ ЛОСОСЯ',price:195,cat:'Тарталетки',feature:'С морепродуктами',img:2,tag:'с рыбой',tagSvg:'assets/tag-fish.svg'},
  {name:'ТАРТАЛЕТКА С КРЕВЕТКОЙ И АВОКАДО-ЛАЙМОВЫМ КРЕМОМ',price:190,cat:'Тарталетки',feature:'С морепродуктами',img:3,tag:'с морепродуктами',tagSvg:'assets/tag-seafood.svg'},
  {name:'БРУСКЕТТА С ТОМАТАМИ И ЗЕЛЕНЬЮ',price:160,cat:'Брускетты',feature:'Для вегетарианцев',img:4,tag:'свежие продукты'},
  {name:'ГАСТРОБОКС ДЛЯ ПРАЗДНИКА',price:1290,cat:'Гастробоксы',feature:'С мясом',img:5,tag:'для праздника'},
  {name:'КАНАПЕ С СЫРОМ И ВИНОГРАДОМ',price:130,cat:'Канапе',feature:'Для вегетарианцев',img:6,tag:'на любой вкус'},
  {name:'МИНИ-БУРГЕР С КУРИЦЕЙ',price:240,cat:'Мини-бургеры',feature:'С курицей',img:7,tag:'любимый вкус'},
  {name:'ДЕСЕРТ С ЯГОДАМИ',price:220,cat:'Десерты',feature:'Для вегетарианцев',img:8,tag:'сладкое'},
  {name:'СЭНДВИЧ С ИНДЕЙКОЙ',price:250,cat:'Сэндвичи',feature:'С индейкой',img:9,tag:'вкусно'}
];
const state={cats:new Set(['Тарталетки']),features:new Set(),cart:{},favorites:new Set()};
const $=id=>document.getElementById(id);

function filters(){
  for(const [id,values,set] of [['categoryFilters',categories,state.cats],['featureFilters',features,state.features]]){
    $(id).innerHTML=values.map(v=>`<label><input type="checkbox" ${set.has(v)?'checked':''} data-type="${id}" value="${v}"><span>${v}</span></label>`).join('');
  }
}

function render(){
  const filtered=products.filter(p=>(!state.cats.size||state.cats.has(p.cat))&&(!state.features.size||state.features.has(p.feature)));
  const isDefaultTart = state.cats.size===1 && state.cats.has('Тарталетки') && state.features.size===0;
  $('resultCount').innerHTML=`Найдено: <b>${isDefaultTart ? 22 : filtered.length}</b>`;
  const activeLabels = [...state.cats, ...state.features];
  const resetBtn = $('resetFilters');
  if (activeLabels.length) {
    resetBtn.style.display = '';
    resetBtn.textContent = `× ${activeLabels.join(', ')}`;
  } else {
    resetBtn.style.display = 'none';
  }
  $('products').innerHTML=filtered.length?filtered.map(p=>{
    const i=products.indexOf(p);
    const fav=state.favorites.has(i);
    const badge=p.tagSvg?`<img class="tag-badge" src="${p.tagSvg}" alt="${p.tag}">`:`<span class="tag">${p.tag}</span>`;
    return `<article class="product"><div class="product-img-wrap"><img class="product-image" src="assets/food-${p.img}.jpg" alt="${p.name}" loading="lazy">${badge}</div><h3>${p.name}</h3><div class="price">${p.price} ₽ <small>/ 1 шт</small></div><div class="product-actions"><button class="add" data-add="${i}">В корзину</button><button class="heart ${fav?'active':''}" data-fav="${i}" aria-label="В избранное"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 20.5c-.3 0-.6-.1-.8-.3C7.8 17.3 3 13.1 3 8.4 3 5.4 5.3 3 8.2 3c1.6 0 3.1.8 3.8 2 .7-1.2 2.2-2 3.8-2C18.7 3 21 5.4 21 8.4c0 4.7-4.8 8.9-8.2 11.8-.2.2-.5.3-.8.3z"/></svg></button></div></article>`;
  }).join(''):'<p>По выбранным фильтрам ничего не найдено.</p>';
  const cartTotal = Object.values(state.cart).reduce((a,b)=>a+b,0);
  const favTotal = state.favorites.size;
  $('cartCount').textContent=cartTotal;
  $('cartCount').dataset.count=cartTotal;
  $('favCount').textContent=favTotal;
  $('favCount').dataset.count=favTotal;
}

document.addEventListener('change',e=>{
  if(e.target.matches('[data-type]')){
    const set=e.target.dataset.type==='categoryFilters'?state.cats:state.features;
    e.target.checked?set.add(e.target.value):set.delete(e.target.value);
    render();
  }
});

document.addEventListener('click',e=>{
  const a=e.target.closest('[data-add]'),f=e.target.closest('[data-fav]');
  if(a){
    const i=+a.dataset.add;
    state.cart[i]=(state.cart[i]||0)+1;
    render();
    const btns = document.querySelectorAll(`[data-add="${i}"]`);
    btns.forEach(b => b.textContent='Добавлено ✓');
  }
  if(f){
    const i=+f.dataset.fav;
    state.favorites.has(i)?state.favorites.delete(i):state.favorites.add(i);
    render();
  }
});

$('resetFilters').onclick=()=>{state.cats.clear();state.features.clear();filters();render()};
$('toggle').onclick=()=>$('navlinks').classList.toggle('open');

function drawer(mode){
  $('drawerTitle').textContent=mode==='cart'?'Корзина':'Избранное';
  const indices=mode==='cart'?Object.keys(state.cart).map(Number):[...state.favorites];
  $('drawerContent').innerHTML=indices.length?indices.map(i=>`<div class="drawer-row"><span>${products[i].name}<br><b>${products[i].price} ₽ ${mode==='cart'?`× ${state.cart[i]}`:''}</b></span>${mode==='cart'?`<button data-remove="${i}">−</button>`:''}</div>`).join('')+(mode==='cart'?`<h3>Итого: ${indices.reduce((s,i)=>s+products[i].price*state.cart[i],0)} ₽</h3><p style="font-size:12px">Для оформления заказа позвоните нам: <a href="tel:+78452906060">8 (8452) 90-60-60</a></p>`:''):'<p class="empty">Здесь пока пусто ♡</p>';
  $('drawer').showModal();
}

$('cartBtn').onclick=()=>drawer('cart');
$('favorites').onclick=()=>drawer('favorites');
$('closeDrawer').onclick=()=>$('drawer').close();
$('drawerContent').onclick=e=>{
  if(e.target.dataset.remove!==undefined){
    const i=+e.target.dataset.remove;
    state.cart[i]--;
    if(!state.cart[i])delete state.cart[i];
    render();
    drawer('cart');
  }
};
filters();
render();
