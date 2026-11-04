/* Runs in the dedicated presenter window. */
(function(){
  const $=selector=>document.querySelector(selector);
  let current=null,lastKey=null,previewBase=null,started=Date.now();
  const currentFrame=$('#current-slide iframe'),upcomingFrame=$('#upcoming-slide iframe');
  function geometry(){
    const top=Math.ceil($('#presenter-toolbar').getBoundingClientRect().height)+18;
    const preview=Math.max(100,(document.documentElement.clientHeight-top-42)/2);
    for(const [name,value] of Object.entries({'--presenter-top':top,'--current-top':top+8,'--preview-height':preview,'--upcoming-top':top+preview+28}))document.documentElement.style.setProperty(name,value+'px');
  }
  new ResizeObserver(geometry).observe($('#presenter-toolbar'));window.addEventListener('resize',geometry);geometry();
  function send(action,value){
    if(window.opener&&!window.opener.closed)window.opener.postMessage(JSON.stringify({namespace:'colloquium-presenter',action,value}),location.origin);
  }
  function previewState(){
    if(!current)return;
    for(const [frame,next] of [[currentFrame,false],[upcomingFrame,true]]){
      frame.contentWindow.postMessage(JSON.stringify({method:'setState',args:[current.state]}),location.origin);
      if(next)frame.contentWindow.postMessage(JSON.stringify({method:'next'}),location.origin);
    }
  }
  currentFrame.addEventListener('load',previewState);upcomingFrame.addEventListener('load',previewState);
  function render(data){
    current=data;$('#presenter-connection').hidden=true;
    $('#presenter-position').textContent=`Slide ${data.index+1} of ${data.count} · Reveal ${data.step} of ${data.steps}`;
    $('#presenter-title').textContent=data.title;$('#presenter-slide').value=String(data.index);
    $('#presenter-previous').disabled=data.first;$('#presenter-next').disabled=data.last;
    $('#presenter-mode').textContent=data.clean?'Return to rehearsal':'Clean audience view';
    const notes=$('.speaker-controls-notes .value');
    if(lastKey!==data.key||notes.innerHTML!==data.notes)notes.innerHTML=data.notes;
    if(lastKey!==data.key){$('#speaker-controls').scrollTop=0;notes.scrollTop=0;}
    lastKey=data.key;
    const url=new URL(data.url);for(const key of ['notes','controls','rehearsal'])url.searchParams.delete(key);url.searchParams.set('receiver','1');url.searchParams.set('postMessageEvents','true');url.searchParams.set('scrollActivationWidth','false');url.searchParams.set('transition','none');url.searchParams.set('backgroundTransition','none');url.searchParams.set('autoSlide','0');
    const base=url.origin+url.pathname+url.search;
    if(previewBase!==base){previewBase=base;currentFrame.src=url.href;upcomingFrame.src=url.href;}
    else previewState();
  }
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==window.opener||typeof event.data!=='string')return;
    let data;try{data=JSON.parse(event.data);}catch{return;}
    if(data.namespace!=='colloquium-presenter')return;
    if(data.type==='state')render(data);
    if(data.type==='setup'){
      const select=$('#presenter-slide');select.replaceChildren();
      for(const slide of data.slides){const option=document.createElement('option');option.value=String(slide.value);option.textContent=`${slide.value+1} · ${slide.title}`;select.append(option);}
      $('#presenter-map').hidden=!data.map;$('#presenter-closing').hidden=!data.closing;
      const refs=$('#presenter-references');refs.innerHTML=data.references;
      const close=refs.querySelector('button');if(close){close.id='presenter-close-references';close.textContent='Close references';close.addEventListener('click',()=>refs.close());}
    }
  });
  for(const [id,action] of Object.entries({'presenter-previous':'previous','presenter-next':'next','presenter-map':'map','presenter-closing':'closing','presenter-mode':'mode'}))$('#'+id).addEventListener('click',()=>send(action));
  $('#presenter-slide').addEventListener('change',event=>{send('jump',Number(event.target.value));event.target.blur();});
  $('#presenter-focus').addEventListener('click',event=>{const on=document.body.classList.toggle('presenter-focus-notes');event.target.textContent=on?'Show previews':'Focus notes';});
  $('#presenter-reference-button').addEventListener('click',()=>$('#presenter-references').showModal());
  document.addEventListener('keydown',event=>{
    if(event.target.closest('input,textarea,select,[contenteditable="true"]')||document.querySelector('dialog[open]')||event.ctrlKey||event.metaKey||event.altKey)return;
    const action={ArrowRight:'next',ArrowDown:'next',' ':'next',PageDown:'next',ArrowLeft:'previous',ArrowUp:'previous',PageUp:'previous',m:'map',M:'map',End:'closing',t:'mode',T:'mode',s:'noop',S:'noop'}[event.key];
    if(action){event.preventDefault();send(action);}
  });
  function clock(){
    $('#presenter-clock').textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const seconds=Math.floor((Date.now()-started)/1000);$('#presenter-timer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
  }
  function resetTimer(){started=Date.now();clock();}
  $('#presenter-reset-timer').addEventListener('click',resetTimer);
  // Let the native button handle Enter/Space without triggering slide navigation.
  $('#presenter-reset-timer').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')event.stopPropagation();});
  $('#presenter-timer').addEventListener('click',resetTimer);
  $('#presenter-timer').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();resetTimer();}});
  clock();setInterval(clock,1000);
  send('ready');
  setInterval(()=>{
    send(current?'heartbeat':'ready');
    if(!window.opener||window.opener.closed){$('#presenter-connection').hidden=false;$('#presenter-connection').textContent='The audience window is closed. Reopen the private presentation and click Start presenting.';}
  },1000);
})();
