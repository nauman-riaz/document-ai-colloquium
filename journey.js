/* The research map opens into the finale. Evidence slides remain free of overlay paths. */
const researchJourney = (() => {
  const params=new URLSearchParams(location.search);
  document.body.classList.toggle('embedded-preview',params.has('embedded'));
  const enabled=params.get('ending')!=='classic'&&!params.has('print-pdf');
  if(!enabled)return {update(){},connect(){},captureMap(){}};
  document.body.classList.add('journey-mode');
  const root=document.getElementById('research-journey');
  const slides=[...document.querySelectorAll('.slides>section')];
  const pointGroups=[
    {ids:slides.filter(s=>s.dataset.indexGroup==='Starting point').map(s=>s.id),x1:90,x2:450,y:650},
    {ids:slides.filter(s=>s.dataset.indexGroup==='Synthesis & understanding'&&s.id!=='research-map').map(s=>s.id),x1:700,x2:1100,y:250},
    {ids:slides.filter(s=>s.dataset.indexGroup==='Document integrity').map(s=>s.id),x1:700,x2:1180,y:650}
  ];
  const positions={'research-map':[535,445],'research-question':[1370,445],'thank-you':[1490,445],'research-outlook':[1450,80],'forensic-outlook':[1450,770]};
  const radii={};
  for(const group of pointGroups){
    const spacing=(group.x2-group.x1)/Math.max(group.ids.length-1,1);
    group.ids.forEach((id,i)=>{positions[id]=[group.x1+spacing*i,group.y];radii[id]=Math.min(23,spacing*.43);});
  }
  const points=slides.map(s=>positions[s.id]);

  const paths={
    foundation:'M80 650H430C500 650 480 445 535 445',
    synthesis:'M535 445C590 445 580 250 700 250H1100C1260 250 1260 445 1370 445',
    integrity:'M535 445C590 445 580 650 700 650H1180C1300 650 1300 445 1370 445',
    conclusion:'M1370 445H1490'
  };
  root.innerHTML=`<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-label="The research journey: the handwriting foundation branches into document synthesis and understanding, and document integrity, then returns to a shared question of reliability.">
    <defs><filter id="journey-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9"/></filter></defs>
    <g id="journey-camera">
      ${Object.entries(paths).map(([name,d])=>`<path class="journey-track journey-${name}" d="${d}"/><path class="journey-ink journey-${name}" data-branch="${name}" d="${d}" pathLength="1"/>`).join('')}
      <g class="journey-map-labels" aria-hidden="true">
        <text class="journey-era" x="90" y="80">NAUMAN RIAZ · SECOND PHD COLLOQUIUM</text>
        <text class="journey-era" x="90" y="725">MOTIVATION + PREVIOUS WORK</text><text class="journey-work" x="90" y="764">DHSD + StylusAI</text>
        <text class="journey-description" x="90" y="798">The handwriting foundation</text>
        <text class="journey-era journey-upper" x="700" y="124">CURRENT · SYNTHESIS &amp; UNDERSTANDING</text>
        <text class="journey-work journey-upper" x="700" y="176">DocDjinn</text><text class="journey-work journey-upper" x="1055" y="176">DocScribe</text>
        <text class="journey-description" x="700" y="207">Useful supervision</text><text class="journey-description" x="1055" y="207">Document structure</text>
        <text class="journey-era journey-lower" x="700" y="725">CURRENT · DOCUMENT INTEGRITY</text>
        <text class="journey-work journey-lower" x="700" y="764">DocForgeNet</text><text class="journey-work journey-lower" x="1055" y="764">JPEG-grid study</text>
        <text class="journey-description" x="700" y="798">Localize alterations</text><text class="journey-description" x="1055" y="798">Examine detector cues</text>
      </g>
      <g class="journey-future-extensions" aria-hidden="true">
        <path class="journey-future-path journey-future-upper" d="M700 250C620 250 620 80 810 80H1450"/>
        <text class="journey-future-label journey-future-upper" x="1460" y="124" text-anchor="end">NEXT · Qwen / GRPO</text>
        <path class="journey-future-path journey-future-lower" d="M1180 650C1250 650 1300 770 1450 770"/>
        <text class="journey-future-label journey-future-lower" x="1460" y="810" text-anchor="end">NEXT · Genuine patterns</text>
      </g>
      <g class="journey-anchor" aria-hidden="true"><image href="assets/docdjinn-equipment-form.png" x="-45" y="-43.2" width="90" height="86.4"/></g>
      <g class="journey-completion" aria-hidden="true"><circle class="journey-halo" cx="1370" cy="445" r="40" filter="url(#journey-glow)"/><circle class="journey-ring" cx="1370" cy="445" r="27"/></g>
      <g id="journey-numbers" aria-label="Jump to any slide from the research path">
        ${slides.map((s,i)=>`<a href="#/${s.id}" tabindex="-1" aria-label="Go to slide ${i+1}: ${s.dataset.title}" data-slide="${s.id}" transform="translate(${points[i].join(' ')})"><title>${String(i+1).padStart(2,'0')} · ${s.dataset.title}</title><circle r="${radii[s.id]||23}"/><text y="1">${String(i+1).padStart(2,'0')}</text></a>`).join('')}
      </g>
    </g>
    <text id="journey-preview" x="90" y="824" aria-live="polite">Select a number to return to the evidence · End returns here</text>
  </svg>`;
  const links=[...root.querySelectorAll('#journey-numbers a')];
  const preview=root.querySelector('#journey-preview');
  const labels=root.querySelector('.journey-map-labels');
  const numberGroup=root.querySelector('#journey-numbers');
  const completion=root.querySelector('.journey-completion');
  const state={progress:0,tail:0};
  const anchor=root.querySelector('.journey-anchor');
  const futureExtensions=root.querySelector('.journey-future-extensions');
  let indexVisible=false,fromClosing=false;
  function showIndex(){
    const ready=document.body.classList.contains('journey-formed')&&indexVisible;
    document.body.classList.toggle('journey-index',indexVisible);
    numberGroup.style.opacity=ready?'1':'0';numberGroup.setAttribute('aria-hidden',ready?'false':'true');
    preview.setAttribute('aria-hidden',ready?'false':'true');
    links.forEach(a=>a.setAttribute('tabindex',ready?'0':'-1'));
  }
  const shape={
    foundation:[80,650,196,650,313,650,430,650,500,650,480,445,535,445],
    synthesis:[535,445,590,445,580,250,700,250,833,250,966,250,1100,250,1260,250,1260,445,1370,445],
    integrity:[535,445,590,445,580,650,700,650,860,650,1020,650,1180,650,1300,650,1300,445,1370,445],
    conclusion:[1370,445,1410,445,1450,445,1490,445]
  };
  const inkEls=Object.fromEntries(Object.keys(paths).map(k=>[k,root.querySelector(`[data-branch="${k}"]`)]));
  const trackEls=Object.fromEntries(Object.keys(paths).map(k=>[k,root.querySelector(`.journey-track.journey-${k}`)]));
  let timeline=null, lastMap=null, origin=null;
  const line=(a,b,length)=>Array.from({length},(_,i)=>{
    const axis=i%2, t=Math.floor(i/2)/(length/2-1);
    return a[axis]+(b[axis]-a[axis])*t;
  });
  // Coordinates are read from the visible map, so the hand-off follows its actual layout.
  function captureMap(){
    const map=document.querySelector('#research-question.present .closing-map svg');
    const overlay=root.querySelector('svg');
    if(!map||!map.getScreenCTM()||!overlay.getScreenCTM())return;
    const toOverlay=overlay.getScreenCTM().inverse();
    const source={foundation:'.progress-foundation .map-link',synthesis:'.progress-synthesis .map-link',integrity:'.progress-integrity .map-link'};
    const result={};
    for(const [key,selector] of Object.entries(source)){
      const path=map.querySelector(selector);
      if(!path||!path.getScreenCTM())return;
      const matrix=path.getScreenCTM();
      const convert=p=>{const q=new DOMPoint(p.x,p.y).matrixTransform(matrix).matrixTransform(toOverlay);return [q.x,q.y];};
      const controls=path.getAttribute('d').match(/-?\d*\.?\d+/g).map(Number);
      result[key]=controls.length===shape[key].length
        ? controls.flatMap((_,i)=>i%2?[]:convert({x:controls[i],y:controls[i+1]}))
        : line(convert(path.getPointAtLength(0)),convert(path.getPointAtLength(path.getTotalLength())),shape[key].length);
    }
    const lower=result.integrity,upper=result.synthesis;
    const join=[(upper.at(-2)+lower.at(-2))/2,(upper.at(-1)+lower.at(-1))/2];
    result.conclusion=line(join,join,shape.conclusion.length);
    lastMap=result;
  }
  function compactOrigin(){
    return {
      foundation:line([230,455],[450,455],shape.foundation.length),
      synthesis:line([560,350],[1120,350],shape.synthesis.length),
      integrity:line([560,550],[1120,550],shape.integrity.length),
      conclusion:line([1240,450],[1240,450],shape.conclusion.length)
    };
  }
  function cubicPath(values){
    let d=`M${values[0]} ${values[1]}`;
    for(let i=2;i<values.length;i+=6)d+=` C${values.slice(i,i+6).join(' ')}`;
    return d;
  }
  function paint(){
    for(const key of Object.keys(shape)){
      const values=shape[key].map((v,i)=>origin[key][i]+(v-origin[key][i])*state.progress);
      const d=cubicPath(values);
      inkEls[key].setAttribute('d',d);trackEls[key].setAttribute('d',d);
      inkEls[key].style.strokeDashoffset=key==='conclusion'?1-state.tail:0;
    }
    const x=origin.conclusion[0]+(1370-origin.conclusion[0])*state.progress;
    const y=origin.conclusion[1]+(445-origin.conclusion[1])*state.progress;
    anchor.setAttribute('transform',`translate(${x} ${y}) scale(${1-.85*state.progress})`);
    anchor.style.opacity=fromClosing?Math.max(0,1-state.progress*1.3):0;
  }
  function update(slide,{initial=false,changed=false,previousId=null,step=0}={}){
    const final=slide.id==='thank-you';
    if(!changed&&!initial){
      if(final){
        indexVisible=step>0;
        if(indexVisible&&!document.body.classList.contains('journey-formed'))timeline?.progress(1);
        showIndex();
      }
      else if(slide.id==='research-question')requestAnimationFrame(captureMap);
      return;
    }
    timeline?.kill();gsap.killTweensOf(state);
    document.body.classList.toggle('journey-finale',final);
    document.body.classList.remove('journey-formed');
    indexVisible=final&&step>0;showIndex();
    root.setAttribute('aria-hidden',final?'false':'true');
    preview.textContent='Select a number to return to the evidence · End returns here';
    gsap.set([labels,numberGroup,completion,futureExtensions],{opacity:0});
    anchor.style.opacity=0;
    if(!final){
      if(slide.id==='research-question')requestAnimationFrame(captureMap);
      return;
    }
    fromClosing=previousId==='research-question'&&!!lastMap;
    origin=fromClosing?lastMap:compactOrigin();
    Object.assign(state,{progress:0,tail:0});paint();
    // Direct Q&A entry is instant. Normal forward navigation keeps the pullback.
    const duration=indexVisible||new URLSearchParams(location.search).has('review-layout')||window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:1.8;
    timeline=gsap.timeline({onComplete:()=>{
      document.body.classList.add('journey-formed');showIndex();
    }});
    timeline.to(state,{progress:1,duration,ease:'power2.inOut',onUpdate:paint},0)
      .to(state,{tail:1,duration:duration*.4,ease:'power2.out',onUpdate:paint},duration*.6)
      .to(labels,{opacity:1,duration:duration*.35},duration*.55)
      .to(completion,{opacity:1,duration:duration*.3},duration*.7)
      .to(futureExtensions,{opacity:.6,duration:duration*.25},duration*.75);
  }
  function connect(navigate){
    links.forEach(a=>{
      a.addEventListener('click',event=>{event.preventDefault();navigate(a.dataset.slide);});
      const show=()=>preview.textContent=a.querySelector('title').textContent;
      a.addEventListener('mouseenter',show);a.addEventListener('focus',show);
    });
  }
  return {update,connect,captureMap};
})();
