// Ejecuta cuando el DOM está listo (evita carreras)
window.addEventListener('DOMContentLoaded', () => {
  // ==== 1) Datos con galería ====
  const memories = [
  {
      id:'jugueria-fim',
      title:'Juguería FIM',
      date:'2024-10-01',
      category:'Universidad',
      lat:-12.02496424265247, lng:-77.04664994884759,
      note:'Considero que este día y en este lugar, fue nuestra primera cita. Aunque tengamos como oficial el 05 de octubre.',
      media:[
        {type:'image', src:'img/fim.jpeg'},
      
      ]
    },
    {
      id:'encuentro-fiee',
      title:'Esquina FIEE - UNI',
      date:'2024-10-10',
      category:'Universidad',
      lat: -12.017722132937443, lng:-77.04945850391653,
      note:'Cada vez que paso por aquí, recuerdo todas las veces que nos encontramos en esta esquina. ',
     media:[
        {type:'image', src:'img/fiee.jpeg'},
      
      ]
    },
    {
      id:'hotel-bolivar',
      title:'Gran Hotel Bolívar',
      date:'2025-02-18',
      category:'Cita',
      lat:-12.050939549849545, lng:-77.03509176673201,
      link:'https://www.youtube.com/watch?v=UXwfXYKJ2Zw&list=RDo4LdfJu-rKk&index=4',
      note:'Risas, miradas y promesas. El pisco hizo lo suyo, pero el recuerdo lo hiciste tú.',
        media:[ {type:'image', src:'img/bolivar.jpeg'} ]
    },
    {
      id:'unidad-ejecutora',
      title:'Unidad Ejecutora de Inversiones - UNI',
      date:'2024-05-05',
      category:'Universidad',
      lat:-12.018049796989994, lng:-77.04787914821752,
      note:'El día que fui a esperarte en UEI. Y todas las veces que pasaba por ahí para verte al menos dos segundos.',
      media:[ {type:'image', src:'img/uei.jpeg'} ]
    },
        {
      id:'ctic-uni',
      title:'Oficina de Tecnologías de Información - UNI',
      date:'2024-10-21',
      category:'Universidad',
      lat:-12.016682557463746, lng:-77.04986262117774,
      note:'Aquí es mi lugar de trabajo, pero este día en particular, te tocó a ti venir a verme. Y me acompañaste hasta que terminó mi clase de Inglés.',
      media:[ {type:'image', src:'img/oti.jpeg'} ]
    },

    {
      id:'Parque-minas',
      title:'Parque FIGMM - UNI',
      date:'2024-05-17',
      category:'Universidad',
      lat:-12.02024386326213, lng:-77.04799261704996,
      note:'Nuestro lugar favorito en la UNI. Aquí pasamos horas hablando, riendo, conociéndonos. La hora del almuerzo era mi momento favorito del día.',
      media:[ {type:'image', src:'img/parque1.jpeg'}]
    },
    {
      id:'r18',
      title:'R18 Restaurante & Bar',
      date:'2024-10-05',
      category:'Cita',
      lat:-12.046834992786483, lng:-77.03257790870346,
      note:'No tenemos una foto de este día. Pero sí un recuerdo imborrable.',
         media:[ {type:'image', src:'img/r18.jpg'} ]
    },
    {
      id:'peip',
      title:'PEIP',
      date:'2025-07-27',
      category:'Paseo',
      lat:-12.09259553933591, lng:-77.02670383366879,
      note:'Tu lugar de trabajo actual. No tengo una foto de ti en el PEIP. Tienes que enviarme una :)',
       media:[ {type:'image', src:'img/peip.jpeg'} ]
    },

        {
      id:'paradero-401',
      title:'Paradero 401 - Javier Prado',
      date:'2025-07-09',
      category:'Paseo',
      lat:-12.091437416450793, lng:-77.02619740116097,
      note:'Acompañarte cada día en el paradero me encanta',
             media:[ {type:'image', src:'img/paradero.jpeg'} ]
    },

            {
      id:'jockey-plaza',
      title:'Jockey Plaza',
      date:'2025-10-02',
      category:'Paseo',
      lat:-12.085256059442015, lng:-76.97724453024885,
      note:'Hemos estado infinidades de veces aquí, el lugar más céntrico que tenemos de ambas casas. Aunque a mi me quede un poquito lejos. Desde que estoy contigo, el Jockey tiene otro significado.',
              media:[ {type:'image', src:'img/jockey.jpeg'} ]
    },

            {
      id:'refugio-plaza',
      title:'Refugio - Jockey Plaza',
      date:'2025-08-02',
      category:'Paseo',
      lat: -12.084395714950956, lng:-76.97447882266222,
      note:'Nuestro lugar favorito para pasar un ratito juntas, disfrutando de la musica en vivo. Esta es la última foto tomada aquí',
        media:[ {type:'image', src:'img/refugio.jpeg'} ]
    },
    
    {
      id:'casacor-peru',
      title:'CASACOR Perú',
      date:'2025-05-31',
      category:'Paseo',
      lat: -12.09938039180363, lng:-77.06578544688855,
      note:'La primera vez que visitamos CASACOR juntas. Espero que sea la primera de muchas. Que se convierta en una tradición para nosotras.',
         media:[ {type:'image', src:'img/casacor.jpeg'} ]
    },

        {
      id:'casa-mellanie',
      title:'Ex Casa de Mellanie',
      date:'2024-05-17',
      category:'Paseo',
      lat: -12.01146316032545, lng:-77.0541766767198,
      note:'Todas las salidas que nos quedabamos en el pasillo de mi casa, cada tarde. Con Omar de compañero.',
      media:[ {type:'image', src:'img/casa.jpeg'} ]
    }


  ];

  // ==== 2) Referencias UI ====
  const chipsEl = document.getElementById('categoryChips');
  const listEl  = document.getElementById('list');
  const qEl     = document.getElementById('q');
  const fromEl  = document.getElementById('from');
  const toEl    = document.getElementById('to');

  // ==== 3) Mapa (Leaflet + OSM) ====
  const map = L.map('map').setView([-12.05,-77.04],13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'© OpenStreetMap contributors', maxZoom:19
}).addTo(map);

  // ==== 4) Estado/Utils ====
  const state = { markers: [], route: null, categories: [], filters: {q:'', from:null, to:null, cats:new Set()} };
  const parseDate = s => s ? new Date(s + 'T00:00:00') : null;
  const fmtDate   = s => s ? parseDate(s).toLocaleDateString() : '';
  const byDateAsc = (a,b)=> (a.date||'')<(b.date||'')?-1:((a.date||'')>(b.date||'')?1:0);

  state.categories = Array.from(new Set(memories.map(m=>m.category))).sort();
  const catColor = new Map();
  state.categories.forEach((c,i)=>{ const hue=Math.round(360*(i/Math.max(1,state.categories.length))); catColor.set(c, `hsl(${hue} 95% 52%)`); });
  const colorFor = cat => catColor.get(cat) || 'hsl(280 95% 52%)';

  // ==== 5) Chips y lista ====
  const minDate = memories.reduce((min,m)=>!min||m.date<min?m.date:min, null);
  const maxDate = memories.reduce((max,m)=>!max||m.date>max?m.date:max, null);
  if (fromEl) fromEl.value = minDate || '';
  if (toEl)   toEl.value   = maxDate || '';

  function renderChips(){
    if(!chipsEl) return;
    chipsEl.innerHTML='';
    const all=document.createElement('div'); all.className='chip'+(state.filters.cats.size===0?' active':''); all.textContent='Todas';
    all.onclick=()=>{state.filters.cats.clear(); refresh();}; chipsEl.appendChild(all);
    state.categories.forEach(cat=>{
      const el=document.createElement('div'); el.className='chip'+(state.filters.cats.has(cat)?' active':''); el.textContent=cat;
      el.onclick=()=>{ state.filters.cats.has(cat) ? state.filters.cats.delete(cat) : state.filters.cats.add(cat); refresh(); };
      chipsEl.appendChild(el);
    });
  }

  function renderList(items){
    if(!listEl) return;
    listEl.innerHTML='';
    if(!items.length){ listEl.innerHTML='<p class="meta">No hay recuerdos con esos filtros.</p>'; return; }
    items.forEach(m=>{
      const card=document.createElement('div'); card.className='card';
      const img=document.createElement('img'); img.className='thumb'; img.alt=''; img.loading='lazy'; img.decoding='async';
      const first = (m.media||[]).find(x=>x.type==='image'); img.src = first ? first.src : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Map_marker.svg';
      const box=document.createElement('div'); const title=document.createElement('div'); title.className='title';
      // Corazón en la lista
      const dot=document.createElement('span');
      dot.innerHTML = `<svg width="18" height="18" viewBox="0 0 28 28" fill="none"><path d="M14 24s-8-5.7-8-11.2A5.8 5.8 0 0 1 14 7a5.8 5.8 0 0 1 8 5.8C22 18.3 14 24 14 24z" fill="${colorFor(m.category)}" stroke="#fff" stroke-width="2"/></svg>`;
      dot.style.cssText = `display:inline-block;width:1.1rem;height:1.1rem;vertical-align:middle;margin-right:.4rem;`;
      title.appendChild(dot); title.appendChild(document.createTextNode(m.title));
      const meta=document.createElement('div'); meta.className='meta'; meta.textContent=`${fmtDate(m.date)} • ${m.category}`;
      const actions=document.createElement('div'); actions.style.marginTop='.35rem';
      const btn=document.createElement('button'); btn.className='btn'; btn.textContent='Ver en el mapa'; btn.onclick=()=> focusMemory(m.id);
      actions.appendChild(btn);
      box.appendChild(title); box.appendChild(meta); box.appendChild(actions);
      card.appendChild(img); card.appendChild(box); listEl.appendChild(card);
    });
  }

  // ==== 6) Popup con galería ====
function makePopup(m){
  const items = Array.isArray(m.media) ? m.media : [];
  const slides = items.map((med,i)=>{
    if(med.type==='video'){
      const posterAttr = med.poster ? `poster="${med.poster}"` : '';
      return `<div class="slide" data-index="${i}"><div class="fs-media"><video controls preload="metadata" ${posterAttr}><source src="${med.src}"></video></div></div>`;
    }
    return `<div class="slide" data-index="${i}"><div class="fs-media"><img src="${med.src}" loading="lazy" decoding="async" alt=""></div></div>`;
  }).join('');

  const nav = items.length>1 ? `
    <button class="gbtn prev" aria-label="Anterior">‹</button>
    <button class="gbtn next" aria-label="Siguiente">›</button>
    <div class="dots">${items.map((_,i)=>`<span class="dot" data-goto="${i}"></span>`).join('')}</div>` : '';

  const link = m.link ? `<a class="btn" href="${m.link}" target="_blank" rel="noopener">Abrir enlace</a>` : '';
  // const share = ...  // ELIMINADO

  const gallery = items.length ? `<div class="gallery" data-id="${m.id}" data-active="0"><div class="track">${slides}</div>${nav}</div>` : '';

  return `
    <div class="popup">
      <div style="font-weight:700;margin-bottom:.2rem">${m.title}</div>
      <div class="meta">${fmtDate(m.date)} • ${m.category}</div>
      ${gallery}
      <div style="margin:.5rem 0;line-height:1.5">${m.note||''}</div>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap">${link}</div>
    </div>`;
}

  // ==== 7) Marcadores (Leaflet controla el autopan) ====
  function addMarkers(items){
    state.markers.forEach(mk=> map.removeLayer(mk)); state.markers=[];
    items.forEach(m=>{
      // Icono corazón SVG
      const html = `<div class="heart-marker" style="position:relative;">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 24s-8-5.7-8-11.2A5.8 5.8 0 0 1 14 7a5.8 5.8 0 0 1 8 5.8C22 18.3 14 24 14 24z" fill="${colorFor(m.category)}" stroke="#fff" stroke-width="2"/>
        </svg>
      </div>`;
      const icon = L.divIcon({html, className:'', iconSize:[28,28], iconAnchor:[14,24]});
      const marker = L.marker([m.lat,m.lng],{title:m.title,icon}).addTo(map);

      marker.bindPopup(makePopup(m), {
        maxWidth: 360,
        closeButton: true,
        autoPan: true,
        keepInView: true,
        autoPanPaddingTopLeft:  L.point(12, 80),
        autoPanPaddingBottomRight: L.point(12, 24)
      });

      marker.memoryId=m.id;
      state.markers.push(marker);
    });
  }

  // ==== 8) Filtros/Render ====
  const applyFilters = ()=>{
    const q=(state.filters.q||'').trim().toLowerCase();
    const from=parseDate(state.filters.from);
    const to=parseDate(state.filters.to);
    const cats=state.filters.cats;
    return memories.filter(m=>{
      if(q && !(m.title+m.note+(m.category||'')).toLowerCase().includes(q)) return false;
      if(from && parseDate(m.date)<from) return false;
      if(to && parseDate(m.date)>to) return false;
      if(cats.size && !cats.has(m.category)) return false;
      return true;
    }).sort(byDateAsc);
  };

  function refresh(){
    renderChips();
    const items = applyFilters();
    addMarkers(items);
    renderList(items);
    if(state.route){ map.removeLayer(state.route); state.route=null; }
  }

  // ==== 9) Popup: iniciar galería y swipe ====
  map.on('popupopen', (ev)=>{
    const root = ev.popup.getElement().querySelector('.gallery');
    if(root) galleryUpdate(root, 0);

    if(root){
      const track = root.querySelector('.track');
      let startX=0, currentX=0, dragging=false;
      const threshold = 40;

      const onStart = (x)=>{ dragging=true; startX=x; currentX=x; track.style.transition='none'; };
      const onMove  = (x)=>{ if(!dragging) return; currentX=x; const dx=currentX-startX; const idx=parseInt(root.dataset.active||'0',10); track.style.transform=`translateX(${ -idx*100 + (dx/track.clientWidth)*100 }%)`; };
      const onEnd   = ()=>{ if(!dragging) return; dragging=false; track.style.transition='transform .35s ease'; const dx=currentX-startX; if(Math.abs(dx)>threshold){ galleryNext(root, dx<0?+1:-1); } else { galleryUpdate(root, parseInt(root.dataset.active||'0',10)); } };

      track.addEventListener('touchstart', e=> onStart(e.touches[0].clientX), {passive:true});
      track.addEventListener('touchmove',  e=> onMove(e.touches[0].clientX), {passive:true});
      track.addEventListener('touchend',   onEnd);

      track.addEventListener('mousedown', e=> onStart(e.clientX));
      window.addEventListener('mousemove', e=> onMove(e.clientX));
      window.addEventListener('mouseup', onEnd);
    }
  });

  // ==== 10) Acciones UI (centrado estable) ====
  function focusMemory(id){
    const mk=state.markers.find(x=>x.memoryId===id);
    if(!mk) return;
    const target = mk.getLatLng();
    map.once('moveend', ()=> mk.openPopup());
    map.panTo(target, {animate:true, duration:0.35});
    location.hash=id;
  }
  window.focusMemory = focusMemory;

  function drawRoute(){
    const items=applyFilters();
    if(items.length<2){ alert('Necesitas al menos 2 recuerdos filtrados para trazar una ruta.'); return; }
    if(state.route) map.removeLayer(state.route);
    state.route = L.polyline(items.map(m=>[m.lat,m.lng]),{weight:5,opacity:.95,color:'#704fa2ff',dashArray:'10,8',lineCap:'round'}).addTo(map);
    map.fitBounds(state.route.getBounds(),{padding:[20,20]});
  }
  const btnRoute = document.getElementById('btnRoute');
  if (btnRoute) btnRoute.onclick = drawRoute;

  if (qEl)    qEl.addEventListener('input', e=>{ state.filters.q=e.target.value; refresh(); });
  if (fromEl) fromEl.addEventListener('change', e=>{ state.filters.from=e.target.value||null; refresh(); });
  if (toEl)   toEl.addEventListener('change', e=>{ state.filters.to=e.target.value||null; refresh(); });
  const btnReset = document.getElementById('btnReset');
  if (btnReset) btnReset.onclick=()=>{
    if (qEl) qEl.value='';
    state.filters={q:'',from:minDate,to:maxDate,cats:new Set()};
    if (fromEl) fromEl.value=minDate||'';
    if (toEl)   toEl.value=maxDate||'';
    refresh();
  };

  // inicio
  state.filters.from=minDate; state.filters.to=maxDate; refresh();
  if(location.hash){ const id=location.hash.replace('#',''); setTimeout(()=>focusMemory(id),500); }

  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', ()=>{
      if (window.matchMedia('(max-width:900px)').matches){ document.body.classList.toggle('menu-open'); }
      else { document.body.classList.toggle('collapsed'); setTimeout(()=> map.invalidateSize(), 250); }
    });
  }
  window.addEventListener('load', ()=> setTimeout(()=> map.invalidateSize(), 60));
  window.addEventListener('resize', ()=> map.invalidateSize());

  // ==== 11) Galería: navegación, dots y fullscreen ====
  function galleryUpdate(root, idx){
    const track = root.querySelector('.track');
    const slides = track.querySelectorAll('.slide');
    const dots = root.querySelectorAll('.dot');
    idx = Math.max(0, Math.min(idx, slides.length-1));
    root.dataset.active = String(idx);
    track.style.transform = `translateX(${-idx*100}%)`;
    dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
  }
  function galleryNext(root, step){ galleryUpdate(root, (parseInt(root.dataset.active||'0',10)+step)); }

  document.addEventListener('click', (e)=>{
    const el = e.target;
    if(el.closest('.gbtn')){
      const root = el.closest('.gallery'); if(!root) return;
      galleryNext(root, el.classList.contains('next') ? +1 : -1);
    }
    if(el.closest('.dot')){
      const d = el.closest('.dot'); const root = el.closest('.gallery'); if(!root) return;
      galleryUpdate(root, parseInt(d.dataset.goto,10)||0);
    }
    if(el.closest('.fs-btn')){
      const root = el.closest('.gallery'); if(!root) return;
      const idx = parseInt(root.dataset.active||'0',10);
      const slide = root.querySelector(`.slide[data-index="${idx}"] .fs-media`);
      if(slide && slide.requestFullscreen){ slide.requestFullscreen(); }
    }
  });
});