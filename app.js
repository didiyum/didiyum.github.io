(function(){
  var $=function(i){return document.getElementById(i)};
  var menuBtn=$('menuBtn'),nav=$('nav'),catBtn=$('catBtn'),catSub=$('catSub'),searchBtn=$('searchBtn'),searchRow=$('searchRow');
  function set(b,p,o){b.setAttribute('aria-expanded',o);p.classList.toggle('open',o)}
  menuBtn.addEventListener('click',function(){set(menuBtn,nav,menuBtn.getAttribute('aria-expanded')!=='true')});
  catBtn.addEventListener('click',function(e){e.stopPropagation();set(catBtn,catSub,catBtn.getAttribute('aria-expanded')!=='true')});
  searchBtn.addEventListener('click',function(){var o=searchBtn.getAttribute('aria-expanded')!=='true';set(searchBtn,searchRow,o);if(o)$('q').focus()});
  document.addEventListener('click',function(e){if(!catSub.contains(e.target))set(catBtn,catSub,false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){set(catBtn,catSub,false);set(searchBtn,searchRow,false)}});
  function route(){
    var post=location.hash==='#reteta';
    $('v-post').classList.toggle('on',post);$('v-home').classList.toggle('on',!post);$('v-intro').classList.toggle('on',!post);
    set(menuBtn,nav,false);set(catBtn,catSub,false);window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);route();
  var root=document.documentElement,tb=$('themeBtn'),mq=window.matchMedia('(prefers-color-scheme: dark)'),saved=null;
  try{saved=localStorage.getItem('theme')}catch(e){}
  function applyTheme(d){root.setAttribute('data-theme',d?'dark':'light');tb.setAttribute('aria-checked',d);tb.firstChild.textContent=d?'☾':'☀'}
  applyTheme(saved?saved==='dark':mq.matches);
  tb.addEventListener('click',function(){var d=tb.getAttribute('aria-checked')!=='true';applyTheme(d);try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}});
  var su=encodeURIComponent(location.href.split('#')[0]+'#reteta'),st=encodeURIComponent(document.title);
  var smap={fb:'https://www.facebook.com/sharer/sharer.php?u='+su,x:'https://twitter.com/intent/tweet?url='+su+'&text='+st,pin:'https://www.pinterest.com/pin/create/button/?url='+su+'&description='+st,wa:'https://wa.me/?text='+st+'%20'+su};
  Array.prototype.forEach.call(document.querySelectorAll('[data-s]'),function(a){a.href=smap[a.dataset.s]});
  var cur=1,pages=[$('p1'),$('p2')],pb=$('pager').querySelectorAll('button');
  function showPage(n){
    cur=n;pages.forEach(function(p,i){p.hidden=(i+1)!==n});
    Array.prototype.forEach.call(pb,function(b){var v=b.dataset.p;
      if(v==='prev')b.disabled=n===1;else if(v==='next')b.disabled=n===pages.length;
      else if(+v===n)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  }
  $('pager').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;var v=b.dataset.p;showPage(v==='prev'?cur-1:v==='next'?cur+1:+v);window.scrollTo(0,0)});
  showPage(1);
  $('copyBtn').addEventListener('click',function(){
    try{navigator.clipboard.writeText(location.href);this.textContent='Link copiat'}catch(e){}
  });
})();
