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
global.alert=()=>{};
global.confirm=()=>true;
global.prompt=()=>'';
global.requestAnimationFrame=()=>{};
global.setTimeout=()=>{};
global.setInterval=()=>{};
global.matchMedia=()=>({matches:false,addListener(){},addEventListener(){}});

const site=path.resolve(__dirname,'../01_SITE/mamilas.html');
const html=fs.readFileSync(site,'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
(0,eval)(src+';window.__DATA=DATA;window.__isRealPath=isRealPath;');
const D=window.__DATA;
const failures=[];
const results=[];
function check(ok,msg){if(!ok)failures.push(msg);}
function row(name,data){results.push({name,...data});}
function isReal(id){return window.__isRealPath(id);}
function canonicalTuple(){return JSON.stringify({project:S.project,path:S.productionPath,world:S.world,visual:S.visualWorld,material:S.teachingMaterial,reference:S.reference,refMix:S.refMix,palette:S.palette,chars:S.chars,charBudget:S.charBudget,styleEngine:S.styleEngine,hybridMode:S.hybridMode});}

check(D.projects.length===25,'Expected 25 projects, got '+D.projects.length);
check(D.paths.length===17,'Expected 17 paths, got '+D.paths.length);
check(D.refs.length===205,'Expected 205 refs (172 v35 + 33 FABLE5/v36), got '+D.refs.length);
check((window.V32_VISUALS||[]).length===27,'Expected 27 visuals');
check((window.V32_MATERIALS||[]).length===18,'Expected 18 materials');
const validAmac=new Set(['cocuk_egitim','premium_stilize','anime_aksiyon','oyun_dunyasi','gercek_reklam','urun_makro','belgesel_kurumsal','lokasyon_yasam']);
check(D.refs.every(r=>validAmac.has(r.amac)),'Every ref must have a valid amac');
check(window.V32_VISUALS.every(v=>v.icinTR&&v.kacinTR),'Every visual must have Turkish micro-guides');
check(window.V32_MATERIALS.every(m=>m.icinTR&&m.kacinTR&&m.matGrup),'Every material must have Turkish micro-guides and subgroup');
check(window.V32_VISUALS.every(v=>v.adTR),'Every visual must have a Turkish Recipe label');
check(window.V32_MATERIALS.every(m=>m.adTR),'Every material must have a Turkish Recipe label');
const gameRefs=D.refs.filter(r=>r.cat==='Game Art Direction');
const gameAmac=[...new Set(gameRefs.map(r=>r.amac))];
check(gameRefs.length===54,'Game category must be 54 (48 v35 + 6 FABLE5/v36)');
check(gameAmac.length>=4,'Game refs must split across at least four purposes, got '+gameAmac.join(', '));

for(const p of D.projects){
  S.teachingMaterial='blocks';S.visualWorld=isReal(p.path)?'pixar_feature':'macro_product_real';S.world='clay';S.refMix=['arcane_texture'];
  window.setProject(p.id);
  const lock=window.primeRenderLock();
  const realBad=isReal(S.productionPath)&&/Premium frame inside|soft-clay lesson|animated feature world/i.test(lock);
  const eduMat=p.path==='ANIMATION_EDU'&&window.V32_MATERIALS.some(m=>m.id===p.world)?S.teachingMaterial===p.world:true;
  check(!realBad,'Real project contaminated: '+p.id);
  check(eduMat,'EDU material stale for '+p.id+': '+S.teachingMaterial+' expected '+p.world);
  check(S.reference===p.ref,'Project ref mismatch: '+p.id);
  check(S.palette===p.palette,'Project palette mismatch: '+p.id);
  check(window.mamilasEffectiveRefs().length>0,'Project default ref suppressed: '+p.id+' / '+p.ref);
  row('project:'+p.id,{path:S.productionPath,world:S.world,visual:S.visualWorld,material:S.teachingMaterial,ok:!realBad&&eduMat});
}
for(const p of D.projects){
  Object.assign(S,{teachingMaterial:'blocks',visualWorld:'pixar_feature',world:'clay',reference:'arcane_texture',refMix:['arcane_texture'],palette:'deep_space_blue',chars:'poison-a',charBudget:77,styleEngine:'anime',hybridMode:true});
  window.setProject(p.id);const a=canonicalTuple();
  Object.assign(S,{teachingMaterial:'glass_cards',visualWorld:'macro_product_real',world:'product_macro_tabletop',reference:'product_macro',refMix:['product_macro'],palette:'commercial_neutral',chars:'poison-b',charBudget:3,styleEngine:'real',hybridMode:true});
  window.setProject(p.id);const b=canonicalTuple();
  check(a===b,'Project canonical tuple depends on prior state: '+p.id);
}

for(const p of D.projects){
  window.setProject(p.id);
  S.scenes=[{id:'text#0001',source:'Kaynak fikri tek fiziksel olayla görünür olur.',vo:'Kaynak fikri tek fiziksel olayla görünür olur.',onText:'-'}];
  const outputs={
    brief:window.buildBrief(),
    image:window.mamilasImagePrompts(),
    motion:window.mamilasMotionPrompts(),
    suno:window.agentPacket('suno'),
    imageAgent:window.agentPacket('image'),
    motionAgent:window.agentPacket('motion')
  };
  for(const [kind,out] of Object.entries(outputs)){
    check(typeof out==='string'&&out.length>80,'Empty '+kind+' output for '+p.id);
    check(!/undefined|\[object Object\]|\bNaN\b/.test(out),'Malformed '+kind+' output for '+p.id);
  }
  check(/TURKISH VISIBLE-TEXT LOCK/.test(outputs.brief),'Brief text lock missing for '+p.id);
  check(/VISIBLE TEXT STATE: NO_TEXT/.test(outputs.image),'Image text state missing for '+p.id);
  check(/TEXT FREEZE/.test(outputs.motion),'Motion text freeze missing for '+p.id);
  if(isReal(p.path)){
    const lock=window.primeRenderLock();
    check(!/Premium frame inside|soft-clay lesson|animated feature world/i.test(lock),'Real positive render lock contaminated for '+p.id);
  }
}

for(const p of D.paths){
  S.teachingMaterial='blocks';S.visualWorld='pixar_feature';S.world='clay';S.refMix=['arcane_texture'];
  window.setPath(p.id);
  const lock=window.primeRenderLock();
  const realBad=isReal(p.id)&&/Premium frame inside|soft-clay lesson|animated feature world/i.test(lock);
  const styBad=p.id==='STYLIZED_PREMIUM'&&(S.visualWorld==='pixar_feature'||S.world==='clay');
  check(!realBad,'Real path contaminated: '+p.id);
  check(!styBad,'Stylized path retained Pixar/clay');
  row('path:'+p.id,{project:S.project,world:S.world,visual:S.visualWorld,material:S.teachingMaterial,ok:!realBad&&!styBad});
}
for(const p of D.paths){
  Object.assign(S,{teachingMaterial:'blocks',visualWorld:'pixar_feature',world:'clay',reference:'arcane_texture',refMix:['arcane_texture'],palette:'deep_space_blue',chars:'poison-a',charBudget:77,styleEngine:'anime',hybridMode:true});
  window.setPath(p.id);const a=canonicalTuple();
  Object.assign(S,{teachingMaterial:'glass_cards',visualWorld:'macro_product_real',world:'product_macro_tabletop',reference:'product_macro',refMix:['product_macro'],palette:'commercial_neutral',chars:'poison-b',charBudget:3,styleEngine:'real',hybridMode:true});
  window.setPath(p.id);const b=canonicalTuple();
  check(a===b,'Path canonical tuple depends on prior state: '+p.id);
}

const decodeCases=[
 ['3. sınıf fen dersi: su döngüsü ve yağmur','ANIMATION_EDU'],
 ['Anime painterly aksiyon filmi','STYLIZED_PREMIUM'],
 ['Telefon kılıfı ürün reklamı, logo ve paket','PRODUCT_HERO'],
 ['Kahve reklamı, buhar ve krema yüzeyi','FOOD_MACRO'],
 ['Elektrikli otomobil reklamı, far çizgisi','AUTOMOTIVE_MOBILITY'],
 ['Belediye vatandaş belgeseli','LIVE_ACTION_CORPORATE']
];
for(const [raw,expected] of decodeCases){
  S.briefRaw=raw;window.applyDecoder();
  check(S.productionPath===expected,'Decoder path mismatch: '+raw+' => '+S.productionPath+' expected '+expected);
  check(sourceIntegrity().coverage===100,'Decoder ingest source loss: '+expected);
}

window.setProject('ultra_real_commercial');
S.reference='arcane_texture';S.refMix=['arcane_texture'];
check(window.mamilasSelectedRefs().length===1,'Selected ref must remain visible');
check(window.mamilasEffectiveRefs().length===0,'Stylized ref must be suppressed on real path');
check(window.mamilasSuppressedRefs().length===1,'Suppressed ref must be reported');
check(!/Arcane Texture Grammar/.test(window.buildBrief()),'Suppressed ref leaked into final brief');
S.hybridMode=true;
check(window.mamilasEffectiveRefs().length===1,'Hybrid mode must allow selected ref');
S.hybridMode=false;

for(const projectId of ['ultra_real_commercial','stylized_premium','education']){
  window.setProject(projectId);
  S.scenes=[{id:'text#0001',source:'Kaynak olay görünür olur.',vo:'Kaynak olay görünür olur.',onText:'-'}];
  for(const r of D.refs){
    S.reference=r.id;S.refMix=[r.id];
    const selected=window.mamilasSelectedRefs(),effective=window.mamilasEffectiveRefs(),suppressed=window.mamilasSuppressedRefs();
    check(selected.length===1&&selected[0].id===r.id,'Selected ref partition failed: '+projectId+'/'+r.id);
    check(effective.length+suppressed.length===1,'Effective/suppressed partition failed: '+projectId+'/'+r.id);
    const dnaSection=window.buildBrief().split('== REFERENCE DNA → DIRECTIVES')[1].split('== PALETTE AS LIGHT')[0];
    if(suppressed.length)check(!dnaSection.includes(r.name),'Suppressed ref name leaked: '+projectId+'/'+r.id);
    else check(dnaSection.includes(r.name),'Effective ref missing: '+projectId+'/'+r.id);
  }
}

S.scenes=[
 {id:'text#0001',source:'Masada ürün duruyor.',vo:'Masada ürün duruyor.',onText:'-'},
 {id:'text#0002',source:'Ekranda kısa bir başlık belirir.',vo:'Ekranda kısa bir başlık belirir.',onText:'-'},
 {id:'text#0003',source:'Logo görünür.',vo:'Logo görünür.',onText:'MAMİLAS'},
 {id:'text#0004',source:'Tabelada "BUGÜN AÇIĞIZ" yazısı görünür.',vo:'Tabelada "BUGÜN AÇIĞIZ" yazısı görünür.',onText:'-'},
 {id:'text#0005',source:'Ekranda metin: Hoş Geldiniz.',vo:'Ekranda metin: Hoş Geldiniz.',onText:'-'},
 {id:'text#0006',source:'Logo görünür.',vo:'Logo görünür.',onText:'-',logo:'logo sağ üstte sabit'},
 {id:'text#0007',source:'Logo görünür.',vo:'Logo görünür.',onText:'-',logo:'EXACT: MAMILAS'}
];
check(window.mamilasVisibleTextState(S.scenes[0]).mode==='NO_TEXT','NO_TEXT classification failed');
check(window.mamilasVisibleTextState(S.scenes[1]).mode==='TURKISH_GENERATED','TURKISH_GENERATED classification failed');
check(window.mamilasVisibleTextState(S.scenes[2]).mode==='EXACT','EXACT classification failed');
check(window.mamilasVisibleTextState(S.scenes[3]).exact==='BUGÜN AÇIĞIZ','Quoted source EXACT extraction failed');
check(window.mamilasVisibleTextState(S.scenes[4]).exact==='Hoş Geldiniz','Labeled source EXACT extraction failed');
check(window.mamilasVisibleTextState(S.scenes[5]).mode!=='EXACT','Logo production note must not become visible exact text');
check(window.mamilasVisibleTextState(S.scenes[6]).exact==='MAMILAS','Marked logo EXACT extraction failed');
check(/meaningful Turkish only/.test(window.primeImagePromptAt(1)),'Turkish generated lock missing in image prompt');
check(/character-for-character/.test(window.primeImagePromptAt(2)),'Exact text lock missing in image prompt');
check(/TEXT FREEZE/.test(window.primeMotionPromptAt(2)),'Motion text freeze missing');
check(/BUGÜN AÇIĞIZ/.test(window.mamilasImagePrompts()),'Bulk image export lost source EXACT text');
check(/TEXT FREEZE/.test(window.mamilasMotionPrompts()),'Bulk motion export lost text freeze');
check(/TURKISH VISIBLE-TEXT LOCK/.test(window.buildBrief()),'Final brief text lock missing');
check(/unauthorized English visible writing/.test(window.briefFor('proof')),'Proof English-visible-text fail missing');
check(/exact Turkish replacement/.test(window.briefFor('proof')),'Proof Turkish replacement requirement missing');
for(const id of ['idea','image','motion','suno','proof','master']){
  const packet=window.agentPacket(id);
  check(/TURKISH VISIBLE-TEXT LOCK/.test(packet),'Agent packet text lock missing: '+id);
  check(packet.includes(S.productionPath),'Agent packet path missing: '+id);
}
check(/unauthorized English visible writing/i.test(window.agentPacket('proof'))&&/exact Turkish replacement/i.test(window.agentPacket('proof')),'Proof agent packet text enforcement missing');

S.reference='pixar_dimensional';S.refMix=['pixar_dimensional'];
for(const id of ['soul','kurzgesagt_clarity','ghibli_organic','arcane_texture'])window.primeToggleRef(id);
check(S.refMix.length===3,'Recipe ref selection must cap at 3');
check(S.reference===S.refMix[0],'Primary reference must track capped mix');

window.setProject('ultra_real_commercial');
const realBefore=canonicalTuple();
check(window.primeSetVisual('pixar_feature')===false,'REAL register must reject animation visual');
check(window.primeSetMaterial('blocks')===false,'Non-EDU register must reject Teaching Material mutation');
check(canonicalTuple()===realBefore,'Rejected REAL selection mutated canonical state');
window.setProject('education');
const eduBefore={project:S.project,path:S.productionPath};
check(window.primeSetVisual('macro_product_real')===false,'EDU register must reject REAL visual');
window.primeToggleRef('arcane_texture');
check(S.project===eduBefore.project&&S.productionPath===eduBefore.path,'Reference selection changed project/path');

for(const route of ['recipe','lab','final','agents','project','path','world','teaching','reference']){
  S.route=route;
  let out='';
  try{out=window.renderMain();}catch(e){failures.push('Route '+route+' error: '+e.message);}
  check(typeof out==='string'&&out.length>20,'Route '+route+' rendered empty');
}
window.setProject('education');
const suggestion=window.mamilasRecipeSuggest();
check(suggestion.visuals.length>=1&&suggestion.visuals.length<=3&&suggestion.visuals[0]===suggestion.visual,'Visual recommendations must contain primary plus up to two alternatives');
check(suggestion.materials.length>=1&&suggestion.materials.length<=3,'EDU material recommendations must contain up to three choices');
check(suggestion.refs.length>=1&&suggestion.refs.length<=3,'Ref recommendations must contain up to three choices');
window.setProject('product_hero');
const productSuggestion=window.mamilasRecipeSuggest();
check(productSuggestion.amac!==suggestion.amac&&productSuggestion.visual!==suggestion.visual,'Adaptive recommendation must change across project/register');
window.setProject('education');
const recipe=window.pageRecipe();
check(/Adaptif Reçete/.test(recipe),'Adaptive Recipe missing');
check(/Türkçe görünür yazı kilidi aktif/.test(recipe),'Recipe text lock notice missing');
check(/ÖNERİLEN/.test(recipe),'Recipe recommendations missing');
check((recipe.match(/ÖNERİLEN ŞERİDİ/g)||[]).length===3,'Recipe must show Visual, Teaching and Reference recommendation strips in EDU');
check(/SEÇİLİ \(1\/3\)/.test(recipe),'Selected Reference pin section missing');
check(/En fazla 3 ref/.test(recipe),'Max-three Reference explanation missing');
check(/Dil/.test(recipe)&&/Matematik/.test(recipe)&&/Bilim/.test(recipe)&&/Değerler \/ Tarih/.test(recipe)&&/Sistem \/ Teknoloji/.test(recipe),'Teaching material subgroups missing');
check(/\(teknik\)/.test(recipe),'Reference technical fallback label missing');
// v36 FINAL PROOF: large ref groups are subgrouped by CONTENT family (Anime & Manga, Oyun...),
// not by DNA-affect buckets — users browse by content, DNA affect stays a card badge.
check(/Anime &amp; Manga|Oyun Dünyaları|Sinematik|Reklam \/ Ürün/.test(recipe),'Large Reference purpose groups must include content-family subgroups');
check(!/default education, Aras \+ Defne/.test(recipe),'English visual best text leaked into Turkish micro-guide');
check(/Boyutlu Animasyon Filmi/.test(recipe)&&/Yumuşak Kil/.test(recipe)&&/Aras \+ Defne Eğitimi/.test(recipe),'Turkish Recipe option labels missing');
check(!/>3D Animated Feature</.test(recipe)&&!/>Soft Clay</.test(recipe)&&!/>Aras \+ Defne Education</.test(recipe),'English Recipe option labels leaked');
check(/Canlı Temiz Eğitim/.test(recipe)&&!/>Vibrant Clean Education</.test(recipe),'Turkish Recipe palette labels missing');
check(/Prime Studio OS · v36/.test(window.renderSide())&&!/Prime Studio OS · v3[45]/.test(window.renderSide()),'Visible shell version must be v36');
check(/Adaptif Önizleme/.test(window.renderRight())&&/Görsel Dünya/.test(window.renderRight()),'Turkish right-side Recipe labels missing');
check(/MAMILAS PRIME BRIEF v35/.test(window.buildBrief())&&!/MAMILAS PRIME BRIEF v34/.test(window.buildBrief()),'Final Brief version must be v35');

const report={generatedAt:new Date().toISOString(),counts:{paths:D.paths.length,projects:D.projects.length,refs:D.refs.length,visuals:window.V32_VISUALS.length,materials:window.V32_MATERIALS.length},failures,results};
console.log(JSON.stringify(report,null,2));
process.exitCode=failures.length?1:0;
