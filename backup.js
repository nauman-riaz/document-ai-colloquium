if(new URLSearchParams(location.search).has('review-layout'))document.documentElement.classList.add('review-layout');
/* A separate appendix keeps details available without lengthening the main route. */

const reducedMotion=(new URLSearchParams(location.search).has('review-layout') || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const deck=new Reveal({width:1600,height:900,margin:0,center:false,controls:false,progress:false,hash:true,fragmentInURL:true,history:false,transition:reducedMotion?'none':'fade',transitionSpeed:'fast',showNotes:false,pdfSeparateFragments:false,pdfMaxPagesPerSlide:1,plugins:[]});
function synchronizeBackup(){
  const slide=deck.getCurrentSlide();if(!slide)return;
  const groups=new Set([...slide.querySelectorAll('.fragment')].map(e=>e.dataset.fragmentIndex));
  const step=new Set([...slide.querySelectorAll('.fragment.visible')].map(e=>e.dataset.fragmentIndex)).size;
  slide.dataset.step=String(step);
  document.getElementById('step-count').textContent=`${deck.getIndices().h+1} / ${deck.getTotalSlides()} · ${step}/${groups.size}`;
  document.getElementById('previous-button').disabled=deck.isFirstSlide()&&step===0;
  document.getElementById('next-button').disabled=deck.isLastSlide()&&step===groups.size;
}
for(const event of ['ready','slidechanged','fragmentshown','fragmenthidden'])deck.on(event,synchronizeBackup);
ColloquiumAudience.bind(deck);
deck.initialize();
document.getElementById('previous-button').addEventListener('click',()=>deck.prev());
document.getElementById('next-button').addEventListener('click',()=>deck.next());

const references=document.getElementById('references-dialog');
const referencesButton=document.getElementById('references-button');
referencesButton.addEventListener('click',()=>{deck.configure({keyboard:false});references.showModal();});
document.getElementById('close-references').addEventListener('click',()=>references.close());
references.addEventListener('close',()=>{deck.configure({keyboard:true});referencesButton.focus();});
references.addEventListener('click',event=>{if(event.target===references){const b=references.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)references.close();}});
