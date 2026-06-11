// MAMILAS PRIME v36 — FINAL PROOF regression test
// Guards the FINAL PROOF fixes:
//  1) EDU_BANK concept-keyword word boundaries (ilkokul!=kök, matematik!=atık, birlikte!=birlik)
//  2) Unified ref search (window.refSearchMatch: id + synonym engine + Turkish keys)
//  3) Reference page: data-ref-card markup, live counter, family grouping on "Tümü"
//  4) Recipe page: content-family subgroups, search markup, Mood section in flow
//  5) Weak-brief warning in decoder reason
//  6) Untouchables: ref data fields (cat/use/dna/avoid/bestPaths) unchanged, 205 refs
// Usage: node v36_final_proof_test.js ../01_SITE/mamilas.html
// NOTE: intentionally non-strict — the DOM shim assigns global.navigator, which is a
// read-only getter under Node >=21; sloppy mode lets that assignment no-op (matches v35 harness).
const fs=require('fs');
const path=require('path');

// --- DOM shim (identical contract to v35 harness) ---
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
const html=fs.readFileSync(site,'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
(0,eval)(src+';window.__DATA=DATA;');
const D=window.__DATA;
const failures=[];
function check(ok,msg){if(!ok)failures.push(msg);}

// ---------- 1) EDU_BANK word boundaries (functional, through the live decoder) ----------
window.S.briefRaw='İlkokul çocukları için kesirleri anlatan eğitim videosu istiyoruz ama aynı zamanda yeni çıkan MatiK akıllı tahta ürünümüzün reklamı da olsun. Çocuklar Aras ile Defne karakterlerini birlikte görsün.\n\nKesir pizzaya bölünerek anlatılsın.\n\nFinalde MatiK tahtası sınıfta parlasın ve logo net okunsun.';
window.applyDecoder();
const b1=window.buildBrief();
check(window.S.productionPath==='ANIMATION_EDU','brief1: education path expected, got '+window.S.productionPath);
check(!/leaf model/.test(b1),'brief1: "ilkokul" still triggers the photosynthesis leaf concept (kök boundary broken)');
check(!/recycling loop/.test(b1),'brief1: "MatiK" still triggers the recycling concept (atık boundary broken)');
check(/circular form scored into equal parts/.test(b1),'brief1: fraction concept lost — kesir entry no longer fires');
check(/Aras and Defne as quiet closed-mouth observer anchors/.test(b1),'brief1: Aras&Defne anchor concept lost');

// legit keyword matches must survive the boundary fix
window.S.briefRaw='Geri dönüşüm haftası için atıkların nasıl ayrıştırıldığını anlatan eğitim videosu. Bitkinin kökü suyu nasıl çeker onu da gösterelim. Onluk ve birlik kavramı final sahnesinde.';
window.applyDecoder();
const b2=window.buildBrief();
check(/recycling loop/.test(b2),'brief2: legit "geri dönüşüm/atık" no longer reaches the recycling concept');

// ---------- 2) Unified ref search ----------
check(typeof window.refSearchMatch==='function','window.refSearchMatch missing — unified search authority gone');
const op=D.refs.find(r=>r.id==='one_piece_sunny_adventure');
const gl=D.refs.find(r=>r.id==='onepiece_grandline_scale');
check(!!op&&!!gl,'One Piece refs missing from DATA.refs');
check(window.refSearchMatch(op,'luffy'),'search: "luffy" no longer finds One Piece (synonym engine unwired)');
check(window.refSearchMatch(gl,'onepiece'),'search: "onepiece" no longer finds onepiece_grandline_scale (id not in haystack)');
const golden=D.refs.find(r=>/golden.?hour/i.test(r.id+' '+r.name));
check(!!golden&&window.refSearchMatch(golden,'altın saat'),'search: Turkish "altın saat" does not reach golden-hour refs');
const tabletop=D.refs.find(r=>r.id==='setup_tabletop');
check(!!tabletop&&window.refSearchMatch(tabletop,'ürün'),'search: Turkish "ürün" does not reach product/macro refs');
check(!window.refSearchMatch(op,'xqzw'),'search: nonsense query must not match');

// ---------- 3) Reference page markup ----------
window.S.refFam='ALL';window.S.refSearch='';window.S.refAffectChip='';
let refPage='';
try{refPage=window.pageReference();}catch(e){failures.push('pageReference threw: '+e);}
check(refPage.includes('data-ref-card'),'reference page: cards lack data-ref-card (live search dead)');
check(refPage.includes('codexRefShown'),'reference page: live counter span missing');
check(refPage.includes('data-ref-group'),'reference page: "Tümü" family grouping missing');
check(refPage.includes('Anime &amp; Manga')||refPage.includes('Anime & Manga'),'reference page: content family titles missing on Tümü');
check(refPage.includes('refSearchLive(this.value)'),'reference page: search input not wired to refSearchLive');

// ---------- 4) Recipe page markup ----------
let recipePage='';
try{recipePage=window.pageRecipe();}catch(e){failures.push('pageRecipe threw: '+e);}
check(recipePage.includes('6 · Mood'),'recipe: Mood section missing from flow');
check(recipePage.includes('data-ref-card'),'recipe: ref buttons lack data-ref-card');
check(recipePage.includes('refSearchLive(this.value)'),'recipe: search input not wired to refSearchLive');
check(recipePage.includes('Anime &amp; Manga')||recipePage.includes('Anime & Manga'),'recipe: content-family subgroups missing (DNA-affect buckets back?)');
check(typeof window.refContentFamTR==='function','window.refContentFamTR missing — recipe/reference taxonomy split again');
check(typeof window.refSearchLive==='function','refSearchLive missing');
try{window.refSearchLive('luffy');window.refSearchLive('');}catch(e){failures.push('refSearchLive threw: '+e);}

// ---------- 5) Weak-brief warning ----------
const weak=window.decodeBrief('video lazım acil. güzel olsun. uçan araba falan olabilir bütçe yok');
check(typeof weak.reason==='string'&&weak.reason.includes('UYARI: brief çok zayıf'),'decoder: weak-brief warning missing');
const strong=window.decodeBrief('İlkokul 3. sınıf öğrencileri için kesir kavramını anlatan 45 saniyelik eğitim videosu. Aras ve Defne pizza bölüşürken kesirleri keşfeder. Sıcak dokunsal bir dünya kurulsun ve final sahnesinde bütün-yarım-çeyrek ilişkisi net okunur olsun.');
check(typeof strong.reason==='string'&&!strong.reason.includes('UYARI'),'decoder: warning fires on a healthy brief');

// ---------- 6) Untouchables ----------
check(D.refs.length===205,'ref count changed: '+D.refs.length+' (expected 205)');
check(op.cat==='Anime / Shonen','one_piece cat field mutated: '+op.cat);
check(typeof op.use==='string'&&op.use.length>0&&typeof op.dna==='string','one_piece use/dna fields mutated');
check(Array.isArray(op.bestPaths)&&op.bestPaths.length>0,'one_piece bestPaths mutated');

const report={tool:'v36_final_proof_test',generatedAt:new Date().toISOString(),site,checks:'see source',failures};
console.log(JSON.stringify(report,null,2));
if(failures.length){process.exitCode=1;}
