// MAMILAS PRIME v36 — production-validation harness
// Drives realistic Turkish customer briefs through the live decoder + recommender.
// Read-only against v35 logic: it loads the site, exercises decodeBrief/applyDecoder,
// the v35 adaptive recommender and the selected/effective/suppressed ref partition,
// then reports decoded path, register, recommendation quality and ref export behavior.
// Usage: node v36_brief_validation.js ../01_SITE/mamilas.html
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
(0,eval)(src+';window.__DATA=DATA;window.__isRealPath=isRealPath;');
const D=window.__DATA;
// REG() lives in the private v34 scope; replicate its contract via exposed isRealPath.
const REG=()=>window.__isRealPath(S.productionPath)?'REAL':(S.productionPath==='ANIMATION_EDU'?'EDU':'STY');
const byId=(arr,id)=>arr.find(x=>x.id===id);
const visTR=id=>{const v=byId((window.V32_MATERIALS||[]).concat(window.V32_VISUALS||[]),id)||{};return v.adTR||v.label||id;};
const refTR=id=>{const r=byId(D.refs,id)||{};return r.name||id;};

// --- realistic customer briefs: five required categories + mixed/edge probes ---
const briefs=[
 // EDUCATION
 {cat:'EDU', label:'Fen — su döngüsü',
  raw:'Aras ve Defne ile 3. sınıf fen dersi: su döngüsü, buharlaşma ve yağmurun oluşumu anlatılsın.',
  expectPath:'ANIMATION_EDU', expectReg:'EDU'},
 {cat:'EDU', label:'Matematik — ölçme',
  raw:'İlkokul matematik dersi: uzunluk ölçme ve santimetre kavramı öğrencilere anlatılacak.',
  expectPath:'ANIMATION_EDU', expectReg:'EDU'},
 {cat:'EDU', label:'Değerler eğitimi',
  raw:'Çocuklara dürüstlük ve paylaşma değerlerini anlatan duygusal bir eğitim hikayesi.',
  expectPath:'ANIMATION_EDU', expectReg:'EDU', note:'no explicit edu keyword except "eğitim"'},

 // REAL COMMERCIAL
 {cat:'REAL', label:'Ticari marka filmi',
  raw:'Premium bir kahve markası için sinematik reklam filmi, sıcak stüdyo ışığı ve marka imzası.',
  expectPath:'FOOD_MACRO', expectReg:'REAL', note:'kahve => food macro by design'},
 {cat:'REAL', label:'Genel ticari reklam',
  raw:'Bir teknoloji girişimi için genel tanıtım reklam filmi, güven veren gerçekçi ton.',
  expectPath:'TECH_MEDICAL_PRECISION', expectReg:'REAL', note:'"teknoloji" routes to tech/medical'},

 // PRODUCT
 {cat:'PRODUCT', label:'Telefon kılıfı',
  raw:'Telefon kılıfı ürün reklamı: paket, logo ve e-ticaret görselleri, makro ürün çekimi.',
  expectPath:'PRODUCT_HERO', expectReg:'REAL'},
 {cat:'PRODUCT', label:'Kozmetik ambalaj',
  raw:'Yeni kozmetik ürün ambalajı için hero ürün çekimi ve marka logosu vurgusu.',
  expectPath:'PRODUCT_HERO', expectReg:'REAL'},

 // INSTITUTIONAL
 {cat:'INST', label:'Belediye 23 Nisan',
  raw:'Belediye için 23 Nisan bayramı etkinlik tanıtımı, vatandaş katılımı ve kamu hizmeti.',
  expectPath:'LIVE_ACTION_CORPORATE', expectReg:'REAL', note:'expect event_real project'},
 {cat:'INST', label:'Kurumsal belgesel',
  raw:'Kurumun başkanı ve çalışanlarıyla kamu hizmetini anlatan kurumsal tanıtım.',
  expectPath:'LIVE_ACTION_CORPORATE', expectReg:'REAL'},

 // STYLIZED
 {cat:'STY', label:'Anime aksiyon',
  raw:'Anime tarzı stilize aksiyon kısa filmi, painterly gölgeler ve manga çizgi estetiği.',
  expectPath:'STYLIZED_PREMIUM', expectReg:'STY'},
 {cat:'STY', label:'Arcane premium',
  raw:'Arcane benzeri premium stilize bir marka hikayesi, çizgi roman dokusu.',
  expectPath:'STYLIZED_PREMIUM', expectReg:'STY'},

 // MIXED / EDGE — decoder precedence probes (sequential override is by design)
 {cat:'EDGE', label:'Eğitim + ürün çakışması',
  raw:'Okul için eğitim amaçlı bir ürün tanıtımı: öğrencilere yeni bir kırtasiye ürünü logo ile gösterilecek.',
  expectPath:null, expectReg:null, note:'hits both eğitim AND ürün/logo; later rule wins — inspect'},
 {cat:'EDGE', label:'Belgesel + moda çakışması',
  raw:'Bir moda koleksiyonunun gerçek mekanda doğal ışıkla çekilen belgesel tarzı tanıtımı.',
  expectPath:null, expectReg:null, note:'hits moda AND belgesel; inspect precedence'},
 {cat:'EDGE', label:'Otomobil + sosyal medya',
  raw:'Elektrikli otomobil için Instagram reels formatında dikey sosyal medya reklamı.',
  expectPath:null, expectReg:null, note:'hits otomobil AND reels/instagram; inspect'},
];

const out=[];
const flags=[];
for(const b of briefs){
  // reset to a neutral-but-poisoned state to ensure decoder is authoritative
  Object.assign(S,{teachingMaterial:'blocks',visualWorld:'pixar_feature',world:'clay',reference:'arcane_texture',refMix:['arcane_texture'],palette:'deep_space_blue',hybridMode:false});
  S.briefRaw=b.raw;
  window.applyDecoder();
  const reg=REG();
  const rec=window.mamilasRecipeSuggest();
  const eff=window.mamilasEffectiveRefs();
  const supp=window.mamilasSuppressedRefs();
  const integ=sourceIntegrity();
  const rowPathOK=b.expectPath?S.productionPath===b.expectPath:null;
  const rowRegOK=b.expectReg?reg===b.expectReg:null;
  if(rowPathOK===false)flags.push(`[PATH] "${b.label}" decoded ${S.productionPath}, expected ${b.expectPath} — brief: ${b.raw}`);
  if(rowRegOK===false)flags.push(`[REG] "${b.label}" register ${reg}, expected ${b.expectReg}`);
  if(integ.coverage!==100)flags.push(`[INGEST] "${b.label}" source coverage ${integ.coverage}% (expected 100)`);
  out.push({
    cat:b.cat, label:b.label,
    decodedPath:S.productionPath, project:S.project, register:reg,
    decodeReason:S.lastDecode||'',
    pathOK:rowPathOK, regOK:rowRegOK,
    rec:{
      amac:rec.amac,
      visualPrimary:rec.visual?visTR(rec.visual):null,
      visualAlts:(rec.visuals||[]).slice(1).map(visTR),
      materials:(rec.materials||[]).map(visTR),
      refs:(rec.refs||[]).map(refTR)
    },
    refExport:{effective:eff.length, suppressed:supp.length,
               suppressedNames:supp.map(r=>r.name)},
    coverage:integ.coverage,
    note:b.note||''
  });
}

const report={
  tool:'v36_brief_validation',
  generatedAt:new Date().toISOString(),
  site:path.relative(process.cwd(),site),
  briefCount:briefs.length,
  flags,
  results:out
};
console.log(JSON.stringify(report,null,2));
process.exitCode=0; // diagnostic harness: flags are evidence, not hard failures
