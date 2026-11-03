/* Shared slide-window controls. The public export has no presenter code. */
(function(root) {
  const params=new URLSearchParams(location.search);
  const receiver=params.has('receiver');
  const isPublic=document.documentElement.dataset.audience==='public';
  let clean=receiver||params.get('controls')==='0'||(isPublic&&params.get('controls')!=='1');
  let deck=null;
  function paint(){
    document.documentElement.classList.toggle('audience-clean',clean);
    const button=document.getElementById('audience-mode-button');
    if(button)button.setAttribute('aria-pressed',String(clean));
  }
  function setClean(value){
    clean=receiver||Boolean(value);paint();
    if(!receiver){
      const url=new URL(location.href);url.searchParams.set('controls',clean?'0':'1');
      history.replaceState(null,'',url);
    }
    deck?.layout();
    document.dispatchEvent(new CustomEvent('audience-mode-changed',{detail:{clean}}));
  }
  paint();
  root.ColloquiumAudience={
    bind(instance){
      deck=instance;
      document.getElementById('audience-mode-button')?.addEventListener('click',()=>setClean(true));
      document.addEventListener('keydown',event=>{
        if(event.key.toLowerCase()!=='t'||event.ctrlKey||event.metaKey||event.altKey||receiver)return;
        if(event.target.closest('input,textarea,select,[contenteditable="true"]')||document.querySelector('dialog[open]'))return;
        event.preventDefault();event.stopImmediatePropagation();setClean(!clean);
      },true);
    },
    setClean,
    isClean:()=>clean
  };
})(window);
