(function(){
  var nav=document.getElementById('nav');
  var railBar=document.getElementById('railBar');
  var railYear=document.getElementById('railYear');
  var staticNav=nav&&nav.classList.contains('nav--static');
  var years=['1963','1963','1970s','1993','1990s','1990s','1990s','2008','2008','2024','2024','2024','2025','2025','1997','2001','2000','2010s','2010s','2010s','2025','2010s','2025'];

  function onScroll(){
    var y=window.scrollY;
    if(nav&&!staticNav){if(y>40){nav.classList.add('solid');}else{nav.classList.remove('solid');}}
    var h=document.documentElement.scrollHeight-window.innerHeight;
    var pct=h>0?(y/h*100):0;
    if(pct<0)pct=0;
    if(pct>100||h-y<2)pct=100;
    if(railBar){railBar.style.height=pct+'%';}
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.12});
    reveals.forEach(function(r){io.observe(r);});
  }else{
    reveals.forEach(function(r){r.classList.add('in');});
  }

  var works=Array.prototype.slice.call(document.querySelectorAll('.work'));
  var data=works.map(function(w){
    var img=w.querySelector('img');
    var vid=w.querySelector('video');
    var cap=w.querySelector('figcaption');
    var src=img?img.src.replace(/w_\d+/,'w_2000'):(vid?vid.getAttribute('poster').replace(/w_\d+/,'w_2000'):'');
    return{
      src:src,
      alt:img?img.alt:'Artwork',
      title:cap.querySelector('b').textContent,
      meta:cap.querySelector('span').textContent
    };
  });

  var lb=document.getElementById('lightbox');
  var lbImg=document.getElementById('lbImg');
  var lbTitle=document.getElementById('lbTitle');
  var lbMeta=document.getElementById('lbMeta');
  var lbCount=document.getElementById('lbCount');
  var current=0;
  var yearObs;

  function open(i){
    current=i;
    render();
    lb.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function close(){
    lb.classList.remove('open');
    lbImg.classList.remove('zoomed');
    document.body.style.overflow='';
  }
  function render(){
    var d=data[current];
    lbImg.classList.remove('zoomed');
    lbImg.src=d.src;
    lbImg.alt=d.alt;
    lbTitle.textContent=d.title;
    lbMeta.textContent=d.meta;
    lbCount.textContent=(current+1)+' / '+data.length;
  }
  function step(dir){
    current=(current+dir+data.length)%data.length;
    render();
  }

  works.forEach(function(w,i){
    w.addEventListener('click',function(){open(i);});
    w.setAttribute('tabindex','0');
    w.setAttribute('role','button');
    w.setAttribute('aria-label','View '+data[i].title);
    w.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i);}
    });
  });

  var bandA=document.getElementById('bandA');
  var bandB=document.getElementById('bandB');
  if(bandA&&bandB){
    data.forEach(function(d,i){
      var el=document.createElement('div');
      el.className='st';
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
      el.setAttribute('aria-label','View '+d.title);
      var im=document.createElement('img');
      im.loading='lazy';
      im.src=d.src.replace(/w_\d+/,'w_600');
      im.alt=d.alt;
      var cap=document.createElement('div');
      cap.className='st__cap';
      var b=document.createElement('b');
      b.textContent=d.title;
      var s=document.createElement('span');
      s.textContent=d.meta;
      cap.appendChild(b);
      cap.appendChild(s);
      el.appendChild(im);
      el.appendChild(cap);
      el.addEventListener('click',function(){open(i);});
      el.addEventListener('keydown',function(e){
        if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i);}
      });
      (i<12?bandA:bandB).appendChild(el);
    });
  }

  document.getElementById('lbClose').addEventListener('click',close);
  document.getElementById('lbPrev').addEventListener('click',function(){step(-1);});
  document.getElementById('lbNext').addEventListener('click',function(){step(1);});
  lbImg.addEventListener('click',function(){lbImg.classList.toggle('zoomed');});
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')step(-1);
    if(e.key==='ArrowRight')step(1);
  });

  if('IntersectionObserver' in window){
    yearObs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var i=parseInt(e.target.getAttribute('data-i'),10);
          if(!isNaN(i)&&years[i]){railYear.textContent=years[i];}
        }
      });
    },{threshold:.4});
    works.forEach(function(w){yearObs.observe(w);});
  }

  var media=window.matchMedia('(prefers-reduced-motion: reduce)');
  var vids=document.querySelectorAll('video');
  if(media.matches){
    vids.forEach(function(v){
      v.removeAttribute('autoplay');
      v.pause();
    });
  }else{
    vids.forEach(function(v){
      v.muted=true;
      var p=v.play();
      if(p&&p.catch){p.catch(function(){});}
    });
  }
  var cursorEl=document.getElementById('cursor');
  var finePointer=window.matchMedia('(pointer: fine)').matches;
  if(cursorEl&&finePointer&&!media.matches){
    document.body.classList.add('cursor-on');
    var cx=window.innerWidth/2,cy=window.innerHeight/2,tx=cx,ty=cy;
    var fallbackThumbs=[
      'https://res.cloudinary.com/db4pwya16/image/upload/f_auto,q_auto,w_200/v1785888035/copy_of_oil_on_canvas_fishermen_facing_an_adverse_southwest_wind_jose_mauricio_saldanha_alvarez.webp',
      'https://res.cloudinary.com/db4pwya16/image/upload/f_auto,q_auto,w_200/v1785885399/Oil%20on%20Board.%20Flying%20high%20and%20clear.%20Jose%20Mauricio%20Saldanha%20Alvarez.png',
      'https://res.cloudinary.com/db4pwya16/image/upload/f_auto,q_auto,w_200/v1785788810/%C3%93il%20on%20card%20board.%20Sailing%20in%20the%20bay.%201963.%20Jose%20Mauricio%20Saldanha%20Alvarez.jpg',
      'https://res.cloudinary.com/db4pwya16/image/upload/f_auto,q_auto,w_200/v1785885398/Drawing%20and%20watercolour%20on%20paper.%20Dubai%2CLights%2C%20%20harbor%20and%20boats%20Jose%20Mauricio%20Saldanha%20Alvarez.png',
      'https://res.cloudinary.com/db4pwya16/image/upload/f_auto,q_auto,w_200/v1785885400/Watercolour%20on%20paper.%20Araruama%20Lagoon.%201993.%20Jose%20Mauricio%20Saldanha%20Alvarez.png'
    ];
    var thumbs=data.length?data.map(function(d){return d.src.replace(/w_\d+/,'w_200');}):fallbackThumbs;
    var ci=0;
    cursorEl.style.backgroundImage='url("'+thumbs[0]+'")';
    document.addEventListener('mousemove',function(e){
      tx=e.clientX;ty=e.clientY;
      cursorEl.classList.add('visible');
    });
    document.addEventListener('mouseleave',function(){cursorEl.classList.remove('visible');});
    function loop(){
      cx+=(tx-cx)*.18;
      cy+=(ty-cy)*.18;
      cursorEl.style.left=cx+'px';
      cursorEl.style.top=cy+'px';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    setInterval(function(){
      var next=(ci+1)%thumbs.length;
      cursorEl.style.setProperty('--cursor-next','url("'+thumbs[next]+'")');
      cursorEl.classList.add('fading');
      setTimeout(function(){
        cursorEl.style.backgroundImage='url("'+thumbs[next]+'")';
        cursorEl.classList.remove('fading');
        ci=next;
      },800);
    },5000);
    var hoverables='a, button, .work, .st';
    document.addEventListener('mouseover',function(e){
      if(e.target.closest(hoverables)){cursorEl.classList.add('grow');}
    });
    document.addEventListener('mouseout',function(e){
      if(e.target.closest(hoverables)){cursorEl.classList.remove('grow');}
    });
  }
})();
