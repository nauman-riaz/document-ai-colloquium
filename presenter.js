/* Presenter transport: notes appear only in the separate speaker window. */
(function(root){
  let controller=null;
  function create({deck,map,closing}){
    const receiver=new URLSearchParams(location.search).has('receiver');
    let popup=null;
    const send=data=>{if(popup&&!popup.closed)popup.postMessage(JSON.stringify({namespace:'colloquium-presenter',...data}),location.origin);};
    function sync(){
      const slide=deck.getCurrentSlide();if(!slide)return;
      const groups=new Set([...slide.querySelectorAll('.fragment')].map(e=>e.dataset.fragmentIndex));
      const step=new Set([...slide.querySelectorAll('.fragment.visible')].map(e=>e.dataset.fragmentIndex)).size;
      send({type:'state',key:location.pathname+'#'+slide.id+'/'+step,title:slide.dataset.title||slide.id,index:deck.getIndices().h,count:deck.getTotalSlides(),step,steps:groups.size,
        notes:slide.querySelector('aside.notes')?.innerHTML||'',state:deck.getState(),url:location.href,
        first:deck.isFirstSlide()&&step===0,last:deck.isLastSlide()&&step===groups.size,clean:ColloquiumAudience.isClean()});
    }
    function setup(){
      send({type:'setup',slides:[...document.querySelectorAll('.slides>section')].map((slide,i)=>({value:i,title:slide.dataset.title||slide.id})),
        map:Boolean(map),closing:Boolean(closing),references:document.getElementById('references-dialog')?.innerHTML||''});
      sync();
    }
    function open({present=false}={}){
      if(receiver)return null;
      if(!popup||popup.closed){
        popup=window.open('','colloquium-presenter','width=1320,height=860');
        if(!popup){alert('The presenter window could not open. Please allow popups for this presentation, then click Start presenting again.');return null;}
        const url=new URL('presenter.html',location.href);
        if(popup.location.href==='about:blank'||popup.location.pathname!==url.pathname)popup.location.replace(url.href);
      }
      popup.focus();
      if(present)ColloquiumAudience.setClean(true);
      setup();return popup;
    }
    if(!receiver){
      window.addEventListener('message',event=>{
        if(event.origin!==location.origin||typeof event.data!=='string')return;
        let data;try{data=JSON.parse(event.data);}catch{return;}
        if(data.namespace!=='colloquium-presenter')return;
        // Reconnect an already open presenter after the audience is refreshed.
        if(!popup&&['ready','heartbeat'].includes(data.action)){
          try{if(event.source.opener===window&&event.source.name==='colloquium-presenter'){popup=event.source;setup();}}catch{return;}
        }
        if(event.source!==popup)return;
        switch(data.action){
          case 'ready':setup();break;
          case 'heartbeat':send({type:'alive'});break;
          case 'previous':deck.prev();break;
          case 'next':deck.next();break;
          case 'jump':if(Number.isInteger(data.value)&&data.value>=0&&data.value<deck.getTotalSlides())deck.slide(data.value,0,-1);break;
          case 'map':map?.();break;
          case 'closing':closing?.();break;
          case 'mode':ColloquiumAudience.setClean(!ColloquiumAudience.isClean());break;
        }
      });
      document.getElementById('start-presenting-button')?.addEventListener('click',()=>open({present:true}));
      document.getElementById('notes-button')?.addEventListener('click',()=>open());
      for(const event of ['ready','slidechanged','fragmentshown','fragmenthidden'])deck.on(event,sync);
      document.addEventListener('audience-mode-changed',sync);
    }
    controller={open};return controller;
  }
  root.ColloquiumPresenter={create,open:()=>controller?.open()};
})(window);
