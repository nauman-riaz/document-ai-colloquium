if(new URLSearchParams(location.search).has('review-layout'))document.documentElement.classList.add('review-layout');
/* Local, dependency-free authoring layer. Reveal and GSAP are vendored. */
const DOCVQA_RESULTS = [
  {label:'100 real',value:43.61},
  {label:'100 real + synthetic',value:65.82},
  {label:'Full real',value:71.45}
];
const RESULTS = [
  {model:'CAT-Net',baseline:75.0,prc:62.4,fpa:1.1},
  {model:'DTD',baseline:72.6,prc:10.7,fpa:17.7},
  {model:'DocForgeNet',baseline:77.4,prc:9.5,fpa:21.5},
  {model:'FFDN',baseline:85.6,prc:75.2,fpa:0.1},
  {model:'RTM',baseline:72.2,prc:64.4,fpa:0.2},
  {model:'ADCD-Net',baseline:80.6,prc:84.5,fpa:0.3}
];
const SVG_NS = 'http://www.w3.org/2000/svg';
const reducedMotion = (new URLSearchParams(location.search).has('review-layout') || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const printMode = new URLSearchParams(location.search).has('print-pdf');

function researchMap(variant) {
  if (variant === 'closing') {
    const history=researchMap('progress').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')
      .replace('C1110 110 1170 110 1230 110','C1330 110 1468.75 150 1468.75 226.5625')
      .replace('C1110 342 1170 342 1230 342','C1330 342 1468.75 300 1468.75 226.5625');
    return `<svg viewBox="0 0 1420 460" role="img" aria-label="Both research streams return to the opening document. Dashed extensions retain the future directions: Qwen and GRPO, and learning genuine-document patterns.">
      <g class="closing-map-history" transform="translate(0 45) scale(.64)">${history}</g>
      <g class="closing-future closing-future-generation"><path d="M358.4 115.4C430 115.4 490 12 650 12H795"/><circle cx="650" cy="12" r="5"/><circle cx="795" cy="12" r="5"/><text x="650" y="43" text-anchor="middle">Qwen</text><text x="795" y="43" text-anchor="middle">GRPO</text></g>
      <g class="closing-future closing-future-forensics"><path d="M672 263.88C770 263.88 870 55 980 110"/><circle cx="980" cy="110" r="7"/><text x="1018" y="84" class="closing-future-status">Future direction</text><text x="1018" y="126">Learn genuine patterns</text></g>
    </svg>`;
  }
  if (variant === 'future-forensics') {
    const history = researchMap('progress').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return `<svg viewBox="0 0 1420 460" preserveAspectRatio="xMinYMid meet" role="img" aria-label="Future work on the forensic branch. The map stays compact, with the earlier Qwen and GRPO direction subdued. A dashed coral extension from the JPEG-grid study leads to learning genuine-document patterns. This is a research direction, not a validated detector.">
      <g class="future-map-history">${history}</g>
      <g class="future-prior-extension" aria-label="Earlier future direction: Qwen and GRPO">
        <path d="M358.4 115.4C430 115.4 490 12 650 12H795"/>
        <circle cx="650" cy="12" r="5"/><circle class="prior-planned-dot" cx="795" cy="12" r="5"/>
        <text x="650" y="43" text-anchor="middle">Qwen</text><text x="795" y="43" text-anchor="middle">GRPO</text>
      </g>
      <g class="future-extension future-anomaly-extension">
        <path class="future-extension-line" d="M672 263.88C770 263.88 870 55 980 110"/>
        <text class="future-map-status" x="1018" y="84">Research direction</text>
        <circle class="future-target-dot future-planned-dot" cx="980" cy="110" r="7"/>
        <text class="future-map-title" x="1018" y="126">Learn genuine patterns</text>
        <text class="future-map-desc" x="1018" y="163">Find suspicious changes</text>
      </g>
    </svg>`;
  }
  if (variant === 'future') {
    // Reuse the same map so the future direction visibly grows from DocDjinn.
    const history = researchMap('progress').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return `<svg viewBox="0 0 1420 460" preserveAspectRatio="xMinYMid meet" role="img" aria-label="Research map. DocDjinn supplies DocScribe's training pairs. A separate extension from DocDjinn leads to a completed SFT generator and planned GRPO training; the forensic stream remains alongside it.">
      <g class="future-map-history">${history}</g>
      <g class="future-extension future-sft-extension">
        <path class="future-extension-line" d="M358.4 115.4C550 115.4 760 55 980 110"/>
        <text class="future-area-label" x="980" y="30">GENERATION</text>
        <text class="future-map-status" x="1018" y="84">SFT completed</text>
        <circle class="future-sft-dot future-target-dot" cx="980" cy="110" r="7"/>
        <text class="future-map-title" x="1018" y="126">Qwen3-VL-4B</text>
        <text class="future-map-desc" x="1018" y="163">Trained on DocDjinn examples</text>
      </g>
      <g class="future-extension future-grpo-extension">
        <path class="future-planned-line" d="M980 122V252"/>
        <circle class="future-planned-dot" cx="980" cy="262" r="7"/>
        <text class="future-map-status future-planned-text" x="1018" y="235">GRPO planned</text>
        <text class="future-map-title" x="1018" y="277">Learn from feedback</text>
        <text class="future-map-desc" x="1018" y="314">Generate → score → update</text>
        <text class="future-reward-label" x="1018" y="347">Usefulness + validity + diversity</text>
      </g>
    </svg>`;
  }
  const focus = variant === 'focused';
  if (!focus) return `<svg viewBox="0 0 1420 460" preserveAspectRatio="xMinYMid meet" role="img" aria-label="Research directions from the first-colloquium foundation, DHSD and StylusAI. The synthesis and structure path connects DocDjinn to DocScribe through training pairs. The forensic evidence path connects DocForgeNet to the JPEG-grid study through detector evaluation.">
    <g class="progress-foundation">
      <text class="map-foundation-label" x="20" y="183">FIRST COLLOQUIUM</text>
      <text class="map-title" x="20" y="238">DHSD + StylusAI</text>
      <path class="map-link" d="M20 270C120 270 220 270 280 270C295 270 305 270 315 270"/>
      <circle class="map-foundation-dot" cx="20" cy="270" r="6"/>
      <text class="map-desc" x="20" y="314">Handwriting</text>
    </g>
    <g class="progress-synthesis">
      <text class="map-lane-label" x="540" y="48">Synthesis &amp; structure</text>
      <path class="map-link" d="M315 270C425 270 420 110 560 110C725 110 890 110 1050 110C1110 110 1170 110 1230 110"/>
      <circle class="map-dot current-dot" cx="560" cy="110" r="7"/><circle class="map-dot current-dot" cx="1050" cy="110" r="7"/>
      <text class="map-title" x="540" y="167">DocDjinn</text><text class="map-desc" x="540" y="207">Generate</text>
      <text class="map-title" x="1030" y="167">DocScribe</text><text class="map-desc" x="1030" y="207">Reconstruct</text>
      <text class="progress-link-label" x="800" y="94" text-anchor="middle">training pairs →</text>
    </g>
    <g class="progress-integrity">
      <text class="map-lane-label" x="540" y="284">Forensic evidence</text>
      <path class="map-link integrity" d="M315 270C425 270 420 342 560 342C725 342 890 342 1050 342C1110 342 1170 342 1230 342"/>
      <circle class="map-dot integrity current-dot" cx="560" cy="342" r="7"/><circle class="map-dot integrity current-dot" cx="1050" cy="342" r="7"/>
      <text class="map-title integrity" x="540" y="399">DocForgeNet</text><text class="map-desc" x="540" y="439">Localize</text>
      <text class="map-title integrity" x="1030" y="399">JPEG-grid study</text><text class="map-desc" x="1030" y="439">Test reliability</text>
      <text class="progress-link-label forensic-link-label" x="800" y="326" text-anchor="middle">detector evaluation →</text>
    </g>
  </svg>`;
  return `<svg viewBox="0 0 1420 190" preserveAspectRatio="xMinYMid meet" role="img" aria-label="Current document integrity research: DocForgeNet localizes alterations; the JPEG-grid study tests detector cues.">
    <g class="map-integrity"><text class="map-lane-label" x="0" y="20">Document integrity</text>
    <path class="map-link integrity" d="M18 67H930"/>
    <circle class="map-dot integrity" cx="18" cy="67" r="6"/><circle class="map-dot integrity" cx="610" cy="67" r="6"/>
    <text class="map-title" x="0" y="125">DocForgeNet</text><text class="map-desc" x="0" y="161">Localize alterations</text>
    <text class="map-title integrity" x="592" y="125">JPEG-grid study</text><text class="map-desc" x="592" y="161">Test the detector’s cues</text></g>
  </svg>`;
}
document.querySelectorAll('[data-map]').forEach(el => {el.innerHTML = researchMap(el.dataset.map);});

// Paint the map and its attached curve from the same progress value each frame.
function createFutureMapMotion(slide) {
  const history=slide.querySelector('.future-map-history');
  const compact=slide.classList.contains('future-forensics');
  const dot=compact?[...history.querySelectorAll('.progress-integrity .map-dot')].at(-1):history.querySelector('.progress-synthesis .map-dot');
  const curve=slide.querySelector('.future-extension-line');
  const destination=slide.querySelector('.future-target-dot');
  const source={x:Number(dot.getAttribute('cx')),y:Number(dot.getAttribute('cy'))};
  const end={x:Number(destination.getAttribute('cx')),y:Number(destination.getAttribute('cy'))};
  const state={progress:compact?1:0};
  let target=compact?1:0,tween=null;
  function paint() {
    const scale=1-.36*state.progress, offsetY=45*state.progress;
    history.setAttribute('transform',`translate(0 ${offsetY}) scale(${scale})`);
    const x=source.x*scale,y=source.y*scale+offsetY,span=end.x-x;
    curve.setAttribute('d',`M${x} ${y}C${x+span*.31} ${y} ${end.x-span*.35} ${Math.min(y,end.y)-55} ${end.x} ${end.y}`);
  }
  function update(expanded,{animate=true}={}) {
    const next=compact||expanded?1:0;
    if(!animate||reducedMotion||printMode) {
      tween?.kill();tween=null;target=next;state.progress=next;paint();return;
    }
    if(next===target)return;
    target=next;tween?.kill();
    tween=gsap.to(state,{progress:target,duration:.65,ease:'power2.inOut',onUpdate:paint,onComplete:()=>{tween=null;}});
  }
  function finish() {tween?.kill();tween=null;state.progress=target;paint();}
  paint();
  return {update,finish};
}
const futureMapMotions=new Map(['research-outlook','forensic-outlook'].map(id=>[id,createFutureMapMotion(document.getElementById(id))]));

// The closing form is the opening illustration; highlights explain questions,
// never a measured forgery or prediction. All states are reversible/direct-entry safe.
function createClosingMotion() {
  const slide=document.getElementById('research-question');
  const map=slide.querySelector('.closing-map'), page=slide.querySelector('.closing-document');
  const structure=slide.querySelector('.closing-structure-copy'), integrity=slide.querySelector('.closing-integrity-copy');
  const regions=slide.querySelector('.closing-structure-regions'), suspect=slide.querySelector('.closing-integrity-region');
  const caption=page.querySelector('figcaption'), summary=slide.querySelector('.closing-summary');
  const states=[
    {map:1,page:0,x:555,y:300,scale:1,structure:0,integrity:0,regions:0,suspect:0,caption:0,summary:0},
    {map:.04,page:1,x:555,y:300,scale:1,structure:1,integrity:0,regions:1,suspect:0,caption:1,summary:0},
    {map:.04,page:1,x:555,y:300,scale:1,structure:.5,integrity:1,regions:.3,suspect:1,caption:1,summary:0},
    {map:1,page:1,x:985,y:446.8,scale:90/490,structure:0,integrity:0,regions:0,suspect:0,caption:0,summary:1}
  ];
  const state={...states[0]};let tween=null,target=0;
  function paint(){
    map.style.opacity=state.map;page.style.opacity=state.page;
    page.style.transform=`translate(${state.x}px,${state.y}px) scale(${state.scale})`;
    structure.style.opacity=state.structure;integrity.style.opacity=state.integrity;
    regions.style.opacity=state.regions;suspect.style.opacity=state.suspect;
    caption.style.opacity=state.caption;summary.style.opacity=state.summary;
  }
  function finish(){tween?.kill();tween=null;Object.assign(state,states[target]);paint();}
  function update(step,animate){
    target=Math.min(step,3);tween?.kill();
    const showing=target===1||target===2;
    page.setAttribute('aria-hidden',target===0?'true':'false');
    map.setAttribute('aria-hidden',showing?'true':'false');
    structure.setAttribute('aria-hidden',showing?'false':'true');
    integrity.setAttribute('aria-hidden',target===2?'false':'true');
    summary.setAttribute('aria-hidden',target===3?'false':'true');
    if(!animate||reducedMotion||printMode){finish();requestAnimationFrame(()=>researchJourney.captureMap());return;}
    tween=gsap.to(state,{...states[target],duration:target===3?1.15:.75,ease:'power2.inOut',onUpdate:paint,onComplete:()=>{tween=null;researchJourney.captureMap();}});
  }
  paint();return {update,finish};
}
const closingMotion=createClosingMotion();

document.getElementById('seed-diagram').innerHTML = `<svg viewBox="0 0 420 190" role="img" aria-label="Three illustrative document groups, with three seed pages selected from the middle group">
  <defs><g id="seed-page"><rect width="42" height="57" rx="1" fill="#fffcf5" stroke="currentColor" stroke-width="1.5"/><path d="M8 12H32M8 20H27M8 32H32M8 39H32M8 46H23" fill="none" stroke="currentColor" stroke-width="1.5"/></g></defs>
  ${[[12,31],[62,15],[91,74],[159,34],[204,12],[229,90],[299,25],[345,60],[321,116]].map(([x,y],i)=>`<g transform="translate(${x} ${y})" class="seed-page ${[3,4,5].includes(i)?'seed-selected':''}"><use href="#seed-page"/><circle class="seed-check" cx="42" cy="0" r="8"/></g>`).join('')}
  <path class="seed-cluster" d="M6 20Q76 -14 128 35L145 151Q71 181 6 113ZM154 22Q218 -8 266 31L280 162Q202 182 148 125ZM292 12Q388 7 411 87L390 182Q312 196 285 126Z"/>
</svg>`;

document.getElementById('docvqa-chart').innerHTML = `<svg viewBox="0 0 950 420" role="img" aria-label="DocVQA answer similarity on a 0 to 100 scale: 100 real training samples, 43.61; 100 real plus synthetic data, 65.82; full real training data, 71.45.">
  ${[0,25,50,75,100].map(v=>`<line class="docvqa-grid" x1="65" x2="920" y1="${340-v*3}" y2="${340-v*3}"/><text class="docvqa-tick" x="45" y="${347-v*3}" text-anchor="end">${v}</text>`).join('')}
  ${DOCVQA_RESULTS.map((r,i)=>{const x=160+i*270;return `<g class="docvqa-series docvqa-series-${i}"><rect class="docvqa-bar" x="${x}" y="${340-r.value*3}" width="145" height="${r.value*3}"/><text class="docvqa-value" x="${x+72.5}" y="${320-r.value*3}" text-anchor="middle">${r.value.toFixed(2)}</text><text class="docvqa-label" x="${x+72.5}" y="382" text-anchor="middle">${i===1?'100 real +':r.label}${i===1?`<tspan x="${x+72.5}" dy="27">synthetic</tspan>`:''}</text></g>`;}).join('')}
</svg>`;

document.getElementById('grid-diagram').innerHTML = `<svg viewBox="0 0 128 128" role="img" aria-label="A magnified document detail with a schematic JPEG grid. Advance to illustrate four-pixel padding, recompression, and cropping.">
  <defs><clipPath id="sample-clip"><rect width="128" height="128"/></clipPath>
  <pattern id="original-grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#b8e0d2" stroke-width=".42"/></pattern>
  <pattern id="new-grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#f3b091" stroke-width=".52"/></pattern></defs>
  <g clip-path="url(#sample-clip)"><rect width="128" height="128" fill="#d9b594"/>
  <g id="sample-content"><image href="assets/prc-input.png" x="-96" y="-64" width="512" height="512"/></g>
  <rect id="grid-original" x="0" y="0" width="140" height="140" fill="url(#original-grid)"/>
  <rect id="grid-recompressed" x="0" y="0" width="140" height="140" fill="url(#new-grid)" opacity="0"/>
  <path id="padding-band" d="M0 128V0H128V4H4V128Z" fill="#d9b594" opacity="0"/>
  <path id="crop-boundary" d="M4 128V4H128" stroke="#fff6e7" stroke-width=".7" stroke-dasharray="2 1.5" fill="none" opacity="0"/></g>
</svg>`;

const chartStart = 205, chartWidth = 690;
const cx = value => chartStart + value / 100 * chartWidth;
document.getElementById('results-chart').innerHTML = `<svg viewBox="0 0 930 435" role="img" aria-label="Pixel-level F1 on DocTamper TestingSet: CAT-Net 75.0 to 62.4; DTD 72.6 to 10.7; DocForgeNet 77.4 to 9.5; FFDN 85.6 to 75.2; RTM 72.2 to 64.4; ADCD-Net 80.6 to 84.5. Higher is better.">
  ${[0,25,50,75,100].map(n => `<line class="chart-grid" x1="${cx(n)}" x2="${cx(n)}" y1="12" y2="389"/><text class="chart-value" x="${cx(n)}" y="424" text-anchor="middle" style="font-size:17px">${n}</text>`).join('')}
  ${RESULTS.map((r,i) => {const y=39+i*65;return `<g><text class="chart-model" x="0" y="${y+7}" ${r.model==='DocForgeNet'?'style="font-weight:700"':''}>${r.model}</text>
    <line class="chart-connector after-result" x1="${cx(r.baseline)}" x2="${cx(r.prc)}" y1="${y}" y2="${y}"/>
    <circle class="chart-baseline" cx="${cx(r.baseline)}" cy="${y}" r="6"/><text class="chart-value" x="${cx(r.baseline)}" y="${y-13}" text-anchor="middle">${r.baseline.toFixed(1)}</text>
    <circle class="chart-prc after-result" cx="${cx(r.prc)}" cy="${y}" r="6"/><text class="chart-value chart-prc-label after-result" x="${cx(r.prc)}" y="${y+26}" text-anchor="middle">${r.prc.toFixed(1)}</text></g>`;}).join('')}
</svg>`;

const SCRIBE_MODELS = [
  {name:'DocScribe',structure:.42,text:.52,precision:.77,recall:.31},
  {name:'Qwen',structure:.43,text:.97,precision:.52,recall:.41},
  {name:'Claude',structure:.60,text:.98,precision:.85,recall:.89}
];
for(const metric of ['structure','text']){
  document.getElementById(`scribe-${metric}-chart`).innerHTML=`<svg viewBox="0 0 420 270" role="img" aria-label="${metric==='structure'?'TreeBLEU':'Text F1'}: ${SCRIBE_MODELS.map(m=>`${m.name} ${m[metric].toFixed(2)}`).join('; ')}">
    ${SCRIBE_MODELS.map((m,i)=>{const y=30+i*78;return `<g class="metric-model-${i}"><text x="0" y="${y}" class="metric-model-name">${m.name}</text><text x="395" y="${y}" text-anchor="end" class="metric-value">${m[metric].toFixed(2)}</text><line x1="0" x2="395" y1="${y+20}" y2="${y+20}" class="metric-track"/><line x1="0" x2="${395*m[metric]}" y1="${y+20}" y2="${y+20}" class="metric-bar"/></g>`;}).join('')}
    <text x="0" y="266" class="metric-tick">0</text><text x="395" y="266" text-anchor="end" class="metric-tick">1</text></svg>`;
}
let comparisonTween=null;
function synchronizeComparison(step,animate){
  comparisonTween?.kill();
  const box=step>=2?'140 620 1100 700':'0 0 2678 3959';
  const frames=document.querySelectorAll('.reconstruction-window');
  if(animate&&!reducedMotion&&!printMode)comparisonTween=gsap.to(frames,{attr:{viewBox:box},duration:.7,ease:'power2.inOut'});
  else frames.forEach(e=>e.setAttribute('viewBox',box));
  document.getElementById('comparison-view-label').textContent=step>=2?'Corresponding text region · magnified at the same scale':'Whole renderings · matched example · same display scale';
}

const documentStates = [
  {x:-2260,y:-1628,scale:6,clipX:300,clipY:170,clipW:810,clipH:160},
  {x:-70,y:-360.35,scale:1.95,clipX:90,clipY:210,clipW:1180,clipH:80},
  {x:70,y:0,scale:500/1440,clipX:70,clipY:0,clipW:1500*500/1440,clipH:500}
];
const documentState = {...documentStates[0]};
let documentTween = null;
function paintDocument(){
  document.getElementById('document-camera').setAttribute('transform',`translate(${documentState.x} ${documentState.y}) scale(${documentState.scale})`);
  const clip=document.getElementById('document-aperture-rect');
  for(const [attr,key] of Object.entries({x:'clipX',y:'clipY',width:'clipW',height:'clipH'}))clip.setAttribute(attr,documentState[key]);
}
function synchronizeDocument(step,animate){
  documentTween?.kill();
  const target=documentStates[Math.min(step,2)];
  if(animate&&!reducedMotion&&!printMode)documentTween=gsap.to(documentState,{...target,duration:.9,ease:'power2.inOut',onUpdate:paintDocument});
  else {Object.assign(documentState,target);paintDocument();}
  document.getElementById('document-reveal-heading').innerHTML=['Begin with<br><em>one word.</em>','A word.<br><em>With a role.</em>','Content becomes useful<br><em>through structure.</em>'][step];
  document.getElementById('document-reveal-caption').textContent=['What does this word tell us about its source?','Department → Environmental Testing Lab','Understanding a page means recovering its relationships.'][step];
}

const gridTimeline = gsap.timeline({paused:true});
gridTimeline.addLabel('step0',0)
  .to('#sample-content',{x:4,y:4,duration:.65,ease:'power2.inOut'},0)
  .to('#grid-original',{x:4,y:4,duration:.65,ease:'power2.inOut'},0)
  .to('#padding-band',{opacity:1,duration:.4},0)
  .addLabel('step1',.65)
  .to('#grid-original',{opacity:0,duration:.6},.65)
  .to('#grid-recompressed',{opacity:1,duration:.6},.65)
  .to('#crop-boundary',{opacity:1,duration:.35},.9)
  .addLabel('step2',1.25)
  .to('#sample-content',{x:0,y:0,duration:.65,ease:'power2.inOut'},1.25)
  .to('#grid-recompressed',{x:-4,y:-4,duration:.65,ease:'power2.inOut'},1.25)
  .to('#padding-band, #crop-boundary',{opacity:0,duration:.5},1.25)
  .addLabel('step3',1.9);
gridTimeline.seek(0);
let sceneTween = null;
let lastSlideId = null;
let lastStep = -1;
const speakerNotes = ColloquiumStepNotes.createController(document.querySelectorAll('.slides > section'));
const deck = new Reveal({
  width:1600,height:900,margin:0,center:false,controls:false,progress:false,
  hash:true,fragmentInURL:true,history:false,transition:reducedMotion?'none':'fade',
  transitionSpeed:'fast',autoAnimateDuration:reducedMotion?0:.85,autoAnimateEasing:'ease-in-out',
  autoAnimateUnmatched:false,backgroundTransition:'fade',slideNumber:false,
  pdfSeparateFragments:false,pdfMaxPagesPerSlide:1,showNotes:false,
  keyboard:presentationKeys(),plugins:[RevealNotes]
});

function presentationKeys() {
  return {77:()=>goToMap(),79:()=>deck.toggleOverview(),35:()=>goToClosing()};
}
function goToSlide(id,{complete=false}={}) {
  if(deck.isOverview())deck.toggleOverview(false);
  const target=document.getElementById(id);
  if(!target)return;
  const groups=fragmentGroups(target);
  const fragment=complete&&groups.size?Math.max(...[...groups].map(Number)):-1;
  deck.slide(deck.getIndices(target).h,0,fragment);
  target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
}
function goToClosing(){goToSlide('thank-you',{complete:true});}

function goToMap() {
  const target = document.getElementById('research-map');
  deck.slide(deck.getIndices(target).h, 0, -1);
}

function fragmentGroups(slide, visibleOnly=false) {
  return new Set([...slide.querySelectorAll(visibleOnly?'.fragment.visible':'.fragment')].map(el=>el.dataset.fragmentIndex));
}

function synchronize({animate=true}={}) {
  const slide=deck.getCurrentSlide();if(!slide)return;
  const fragmentCount=fragmentGroups(slide).size;
  const step=fragmentGroups(slide,true).size;
  // Registered before the Notes plugin connects, so its state message contains this step.
  speakerNotes.show(slide,step);
  slide.dataset.step=String(printMode?fragmentCount:step);
  for(const [id,motion] of futureMapMotions) {
    if(slide.id===id)motion.update(printMode||step>0,{animate:animate&&lastSlideId===slide.id});
    else motion.finish();
  }
  if(slide.id==='research-question')closingMotion.update(printMode?3:step,animate&&lastSlideId===slide.id);
  else closingMotion.finish();
  if(slide.id==='motivation-document')synchronizeDocument(printMode?2:step,animate&&lastSlideId===slide.id);
  else documentTween?.kill();
  if(slide.id==='docscribe-task')synchronizeComparison(printMode?1:step,animate&&lastSlideId===slide.id);
  else comparisonTween?.kill();
  if(slide.id==='grid-experiment') {
    const effective=printMode?3:step;
    sceneTween?.kill();
    const time=gridTimeline.labels['step'+effective];
    if(animate&&!reducedMotion&&!printMode&&lastSlideId===slide.id&&Math.abs(lastStep-step)===1) sceneTween=gridTimeline.tweenTo(time,{duration:.65,ease:'power2.inOut'});
    else gridTimeline.seek(time,false);
    slide.querySelector('.state-caption').textContent=['Original block alignment','Pad by (4, 4) pixels','Recompress on the padded grid','Crop back: a half-block shift remains'][effective];
  } else {sceneTween?.kill();gridTimeline.pause();}
  const indices=deck.getIndices();const count=deck.getTotalSlides();
  document.getElementById('chapter-location').textContent=slide.dataset.location;
  document.body.classList.toggle('dark-slide',slide.classList.contains('research-checkpoint')||slide.classList.contains('finale'));
  document.getElementById('closing-button').disabled=slide.id==='thank-you'&&step===fragmentCount;
  document.getElementById('step-count').textContent=`${String(indices.h+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}${fragmentCount?' · '+step+'/'+fragmentCount:''}`;
  document.querySelector('.reading-progress span').style.width=((indices.h+(fragmentCount?step/(fragmentCount+1):0))/(count-1)*100)+'%';
  document.getElementById('previous-button').disabled=deck.isFirstSlide()&&step===0;
  document.getElementById('next-button').disabled=deck.isLastSlide()&&step===fragmentCount;
  researchJourney.update(slide, {initial:lastSlideId===null, changed:lastSlideId!==slide.id, previousId:lastSlideId,step});
  lastSlideId=slide.id;lastStep=step;
}

deck.on('ready',()=>synchronize({animate:false}));
deck.on('slidechanged',()=>synchronize({animate:false}));
deck.on('fragmentshown',()=>synchronize());
deck.on('fragmenthidden',()=>synchronize());
deck.on('slidetransitionend',()=>researchJourney.captureMap());
deck.on('resize',()=>researchJourney.captureMap());
deck.on('overviewshown',()=>document.body.classList.add('journey-overview'));
deck.on('overviewhidden',()=>document.body.classList.remove('journey-overview'));
deck.on('pdf-ready',()=>{
  synchronizeDocument(2,false);
  synchronizeComparison(1,false);
  closingMotion.update(3,false);
  document.querySelectorAll('section').forEach(slide=>slide.dataset.step=String(fragmentGroups(slide).size));
  gridTimeline.seek('step3');
  futureMapMotions.forEach(motion=>motion.update(true,{animate:false}));
});
window.addEventListener('beforeprint',()=>futureMapMotions.forEach(motion=>motion.update(true,{animate:false})));
window.addEventListener('afterprint',()=>futureMapMotions.forEach((motion,id)=>motion.update(fragmentGroups(document.getElementById(id),true).size>0,{animate:false})));
ColloquiumAudience.bind(deck);
// PRIVATE PRESENTER START
const presenter=ColloquiumPresenter.create({deck,map:goToMap,closing:goToClosing});
// PRIVATE PRESENTER END
deck.initialize();

document.getElementById('previous-button').addEventListener('click',()=>deck.prev());
document.getElementById('next-button').addEventListener('click',()=>deck.next());
document.getElementById('map-button').addEventListener('click',()=>goToMap());
document.getElementById('closing-button').addEventListener('click',goToClosing);

const help=document.getElementById('help-dialog');
const showHelp=()=>{deck.configure({keyboard:false});help.showModal();};
document.getElementById('help-button').addEventListener('click',showHelp);
document.getElementById('close-help').addEventListener('click',()=>help.close());
help.addEventListener('close',()=>deck.configure({keyboard:presentationKeys()}));
help.addEventListener('click',e=>{if(e.target===help){const b=help.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)help.close();}});
document.addEventListener('keydown',e=>{if(e.key==='?'&&!help.open&&!document.getElementById('references-dialog').open){e.preventDefault();showHelp();}});

// A chapter-grouped discussion index, generated from the actual deck order.
const indexRoot=document.getElementById('finale-slide-index');
const indexPreview=document.getElementById('slide-index-preview');
const indexGroups=new Map();
document.querySelectorAll('.slides > section').forEach((slide,i)=>{
  const group=slide.dataset.indexGroup||'Presentation';
  if(!indexGroups.has(group)){
    const column=document.createElement('div');column.className='slide-index-group';
    const label=document.createElement('p');label.className='slide-index-group-title';label.textContent=group;
    const links=document.createElement('div');links.className='slide-index-links';
    column.append(label,links);indexRoot.append(column);indexGroups.set(group,links);
  }
  const n=String(i+1).padStart(2,'0');
  const title=slide.dataset.title;
  const link=document.createElement('a');
  link.href='#/'+slide.id;link.textContent=n;
  link.title=n+' · '+title;
  link.setAttribute('aria-label','Go to slide '+(i+1)+': '+title);
  if(slide.id==='thank-you')link.setAttribute('aria-current','page');
  const preview=()=>indexPreview.textContent=n+' · '+title;
  link.addEventListener('mouseenter',preview);link.addEventListener('focus',preview);
  link.addEventListener('click',event=>{event.preventDefault();goToSlide(slide.id,{complete:true});});
  indexGroups.get(group).append(link);
});
indexRoot.addEventListener('mouseleave',()=>{if(!indexRoot.contains(document.activeElement))indexPreview.textContent='Choose a number to revisit a slide.';});

researchJourney.connect(id=>goToSlide(id,{complete:true}));

// Only the comparison page can request a short two-slide transition preview.
if(new URLSearchParams(location.search).has('embedded')){
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==window.parent||event.data!=='preview-closing')return;
    const replay=()=>setTimeout(()=>{
      if(deck.getCurrentSlide()?.id==='research-question'){
        researchJourney.captureMap();goToClosing();
      }
    },900);
    if(deck.isReady())replay();else deck.on('ready',replay);
  });
}

// References pause deck navigation, then restore it and the invoking control.
const references=document.getElementById('references-dialog');
const referencesButton=document.getElementById('references-button');
referencesButton.addEventListener('click',()=>{deck.configure({keyboard:false});references.showModal();});
document.getElementById('close-references').addEventListener('click',()=>references.close());
references.addEventListener('close',()=>{deck.configure({keyboard:presentationKeys()});referencesButton.focus();});
references.addEventListener('click',event=>{if(event.target===references){const box=references.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)references.close();}});
