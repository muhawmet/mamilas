// MAMILAS PRIME v36 — FABLE5 preview engine test
// Asserts: scene coverage for every ref, palette-axis independence (scene identity
// fixed, colors change), no hardcoded hex inside bespoke scene functions, TAMAM flow,
// refMix cycling, and that the IP-safe export chain stays untouched by the demo layer.
// Usage: node v36_preview_test.js ../01_SITE/mamilas.html
// NOTE: intentionally non-strict — the DOM shim assigns global.navigator, which is a
// read-only getter under Node >=21; sloppy mode lets that assignment no-op.
const fs=require('fs');
const path=require('path');

function el(){
  return new Proxy(function(){},{get:(t,k)=>{
    if(k==='style')return {};
    if(k==='classList')return {add(){},remove(){},toggle(){},contains(){return false}};
    if(['appendChild','setAttribute','addEventListener','removeChild','insertBefore','remove','focus','click','select'].includes(k))return ()=>el();
    if(k==='querySelector')return ()=>el();
    if(k==='querySelectorAll'||k==='children')return [];
    if(['innerHTML','textContent','value','className','id'].includes(k))return '';
    if(k==='parentNode'||k==='firstChild')return el();
    return el();
  },set:()=>true,apply:()=>el()});
}
const doc=el();
global.window=global;
global.document=new Proxy(doc,{get:(t,k)=>{
  if(['getElementById','querySelector','createElement'].includes(k))return ()=>el();
  if(k==='querySelectorAll')return ()=>[];
  if(['body','head','documentElement'].includes(k))return el();
  if(k==='addEventListener')return ()=>{};
  if(k==='cookie')return '';
  return doc[k];
}});
global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
global.location={hash:'',href:'',reload:()=>{}};
global.navigator={userAgent:'node'};
global.alert=()=>{};global.confirm=()=>true;global.prompt=()=>'';
global.requestAnimationFrame=()=>{};global.setTimeout=()=>{};global.setInterval=()=>{};
global.matchMedia=()=>({matches:false,addListener(){},addEventListener(){}});

const site=path.resolve(process.cwd(),process.argv[2]||'../01_SITE/mamilas.html');
const src=fs.readFileSync(site,'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
(0,eval)(src+';window.__DATA=DATA;');
const D=window.__DATA;
const failures=[];
function check(ok,msg){if(!ok)failures.push(msg);}

// 1) Engine surface exists
check(typeof window.fableRender==='function','fableRender missing');
check(typeof window.fableSceneIds==='function','fableSceneIds missing');
check(typeof window.refPreviewSVG==='function','refPreviewSVG missing');
const sceneIds=window.fableSceneIds();
check(sceneIds.length>=160,'Expected >=160 bespoke scenes, got '+sceneIds.length);

// 2) Every bespoke scene id maps to a real ref (no orphans)
const orphans=sceneIds.filter(id=>!D.refs.find(r=>r.id===id));
check(orphans.length===0,'Orphan scenes (no matching ref): '+orphans.join(','));

// 3) Every ref resolves an SVG; all should hit the FABLE path (bespoke or family)
let fable=0,orig=0;
for(const r of D.refs){
  let s='';
  try{s=window.refPreviewSVG(r.preview||'default',r.id);}catch(e){check(false,'Preview threw for '+r.id+': '+e.message);continue;}
  check(/^<svg/.test(s),'Preview is not SVG for '+r.id);
  if(s.indexOf('fableSvg')>=0)fable++;else orig++;
}
check(orig===0,'Some refs fell back to the legacy motif preview: '+orig);

// 4) Palette axis: scene identity fixed, colors change (3 palettes, key refs)
const pals=['vibrant_clean_education','deep_space_blue','luxury_black_gold'];
for(const id of ['one_piece_sunny_adventure','bleach_soul_blade','elden_ring_gothic_scale','mha_hero_burst','chanel_bw_luxury']){
  const outs=pals.map(p=>window.fableRender(id,p));
  check(new Set(outs).size===3,'Palette swap did not change colors for '+id);
  // scene identity: structure (tags/coords) identical when color values are blanked
  const skel=outs.map(s=>s.replace(/#[0-9a-fA-F]{6}/g,'#').replace(/fk\d+|fv\d+|fg\d+|fl\d+/g,'U'));
  check(skel[0]===skel[1]&&skel[1]===skel[2],'Scene identity changed across palettes for '+id);
}

// 5) Bespoke scene functions must not hardcode hex colors (all color via P.*)
const FABLE_SRC=src.slice(src.indexOf('MAMILAS FABLE 5'));
const sceneBlock=FABLE_SRC.slice(FABLE_SRC.indexOf('=== ANİME SAHNELERİ ==='),FABLE_SRC.indexOf('/*F5_SCENES_END*/'));
check(sceneBlock.length>1000,'Scene block not found for hex audit');
check(!/#[0-9a-fA-F]{3}/.test(sceneBlock.replace(/Yeni referans kütüphanesi[\s\S]*?\.forEach\(fAddRef\);/,'')),'Hardcoded hex color inside bespoke scenes');

// 6) refMix cycling: fableView rotates within mix without touching S.reference
S.reference='one_piece_sunny_adventure';S.refMix=['one_piece_sunny_adventure','bleach_soul_blade'];S.fableView=null;
window.fableCycle();
check(S.fableView==='bleach_soul_blade','fableCycle must advance to second ref');
check(S.reference==='one_piece_sunny_adventure','fableCycle must NOT change the primary reference');
const cycled=window.refPreviewSVG('ship','one_piece_sunny_adventure');
const direct=window.fableRender('bleach_soul_blade',S.palette);
check(cycled===direct,'Cycled preview must render the viewed ref scene');
S.fableView=null;

// 7) TAMAM flow: route flips to final; agent packet flows through existing compiler
S.route='recipe';
window.fableTamam();
check(S.route==='final','fableTamam must set route=final');
const pk=agentPacket('image');
check(typeof pk==='string'&&pk.length>500&&/MAMILAS .*DIRECTOR/i.test(pk),'agentPacket(image) broken');

// 8) Demo isolation: brief/agent exports must never contain panel SVG demo content.
// NOTE: 'Sunny' DOES legitimately appear — it is part of the canonical v35 ref name
// 'One Piece-like Sunny Adventure Grammar (IP-safe)'; only FABLE5-demo artifacts are leaks.
const brief=buildBrief();
for(const [label,txt] of [['buildBrief',brief],['agentPacket',pk]]){
  check(txt.indexOf('<svg')<0&&txt.indexOf('fableSvg')<0&&txt.indexOf('FABLE')<0,label+' leaked preview SVG');
  check(!/Luffy|Ichigo/i.test(txt),label+' leaked recognizable demo naming');
}

// 9) Right panel: strip + button (recipe) / agent chips (final)
S.route='recipe';
let rr=String(window.renderRight());
check(rr.indexOf('fableStrip')>=0,'fableStrip missing in right panel');
check(rr.indexOf('fableTamam()')>=0,'TAMAM button missing on non-final route');
check(rr.indexOf('fableWrap')>=0,'Preview wrap not clickable');
S.route='final';
rr=String(window.renderRight());
check(rr.indexOf('fableAgent(')>=0,'Agent chips missing on final route');
check(rr.indexOf('fableDownload()')>=0,'Brief download chip missing on final route');

// 10) Hover recolor is non-destructive state
S.route='recipe';S.fablePalHover=null;
const before=window.fableRender('one_piece_sunny_adventure',S.palette);
window.fablePalHover('luxury_black_gold');
check(S.fablePalHover==='luxury_black_gold','fablePalHover state not set');
window.fablePalHover();
check(!S.fablePalHover,'fablePalHover must clear');
check(window.fableRender('one_piece_sunny_adventure',S.palette)===before,'Hover must not permanently change preview');

const result={tool:'v36_preview_test',generatedAt:new Date().toISOString(),
  site:path.relative(process.cwd(),site),
  counts:{refs:D.refs.length,bespokeScenes:sceneIds.length,fableCovered:fable},
  failures};
console.log(JSON.stringify(result,null,2));
process.exitCode=failures.length?1:0;
