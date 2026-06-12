// MAMILAST cleanup regression test
// Guards the cleanup round: dead code stays dead, loud error path exists,
// visible labels follow the unified FAZ / REÇETE n-6 / ARAÇ scheme, v36 shell label.
// Usage: node mamilast_cleanup_test.js ../01_SITE/mamilas.html
// NOTE: intentionally non-strict (same DOM-shim contract as the other harnesses).
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
const html=fs.readFileSync(site,'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
(0,eval)(src);
const failures=[];
function check(ok,msg){if(!ok)failures.push(msg);}

// 1) dead code stays dead
['clearRefSearch','clearSeriesLock','saveSeriesLock','copyDnaMix','mamilasHealSceneNotes',
 'mamilasAgentBrief','runMamilasSimulation','primeRefQ','refDnaAffects','pageRelease']
 .forEach(n=>check(typeof window[n]==='undefined','dead function resurrected: '+n));
check((html.match(/window\.pageRecipe=function/g)||[]).length===1,'pageRecipe must have exactly one definition');
check(!/releaseChecklist|releaseText/.test(src.replace(/\/\*[^*]*\*\//g,'')),'pageRelease island left references');

// 2) loud error path
check(typeof window.mamiPageError==='function','mamiPageError missing');
const _ce=console.error; console.error=()=>{};
const eb=window.mamiPageError('testroute',new Error('boom'));
console.error=_ce;
check(/Ekran hatası/.test(eb)&&/testroute/.test(eb),'mamiPageError must render a visible Turkish error box');
check(/catch\(e\)\{return window\.mamiPageError\('recipe',e\);\}/.test(src),'recipe route not wired to loud error');
check(/mamiPageError\('reference',e\)/.test(src),'reference route not wired to loud error');
check(!/S\.route==='reference'\)\{ try\{[^}]*\}catch\(e\)\{\} \}/.test(src),'silent reference fallback came back');

// 3) unified visible labels (live, through renderMain)
const expect={decoder:'FAZ 1',ingest:'FAZ 1',recipe:'FAZ 2',scenes:'FAZ 3',lab:'FAZ 4',final:'FAZ 5',agents:'FAZ 5',
 project:'REÇETE 1/6',path:'REÇETE 1/6',world:'REÇETE 2/6',teaching:'REÇETE 3/6',reference:'REÇETE 4/6',
 palette:'REÇETE 5/6',mood:'REÇETE 6/6',qa:'ARAÇ',golden:'GOLDEN STANDARD',repair:'ARAÇ',rhythm:'ARAÇ',
 quantum:'ARAÇ',audit:'ARAÇ',academy:'ARAÇ',dashboard:'PANEL'};
Object.keys(expect).forEach(r=>{
  window.S.route=r;
  let h='';try{h=window.renderMain();}catch(e){failures.push('route '+r+' threw: '+e);return;}
  const m=String(h).match(/class="eyebrow"[^>]*>([^<]{1,40})</);
  const got=m?m[1]:'(yok)';
  check(got.indexOf(expect[r])===0,'route '+r+': eyebrow "'+got+'" beklenen "'+expect[r]+'"');
});
check(!/STEP \d\d/.test((()=>{let all='';Object.keys(expect).forEach(r=>{window.S.route=r;try{all+=window.renderMain();}catch(e){}});return all;})()),'a live page still shows old STEP numbering');

// 4) v36 shell label, no runtime label patch
check(/Prime Studio OS · v36/.test(window.renderSide()),'sidebar must say v36');
check(!/replace\('Prime Studio OS · v34'/.test(src),'v34→v35 label patch hack came back');

// 5) categoryAudit checks live markers (not stale strings)
window.S.route='audit';
const audit=window.renderMain();
check(!/SOURCE INTEGRITY LAW/.test(src.match(/let finalScore=[^\n]+/)[0]),'categoryAudit finalScore still checks stale brief strings');
check(/MAMILAS PROOF DIRECTOR/.test(src.match(/let agentScore=[^\n]+/)[0]),'categoryAudit agentScore not updated to live packet markers');
check(/auditCard/.test(audit),'audit page broke');

// 6) Proje Kasası
['kasaList','kasaSave','kasaLoad','kasaDelete','kasaBoxHTML'].forEach(n=>check(typeof window[n]==='function','Proje Kasası API eksik: '+n));
check(Array.isArray(window.kasaList()),'kasaList dizi döndürmeli');
const kb=window.kasaBoxHTML();
check(/Proje Kasası/.test(kb)&&/kasaSave\(\)/.test(kb),'kasa kutusu markup bozuk');
window.S.route='dashboard';
check(/Proje Kasası/.test(window.renderMain()),'kasa kutusu dashboard akışında görünmüyor');
// kayıt/yükleme döngüsü (harness storage no-op olabilir; yazılabilirse doğrula)
if(window.kasaWrite([{ad:'__t',t:0,s:{client:'x'}}])){
  check(window.kasaList().length===1&&window.kasaList()[0].ad==='__t','kasa yaz/oku döngüsü bozuk');
  window.kasaWrite([]);
}

const report={tool:'mamilast_cleanup_test',generatedAt:new Date().toISOString(),site,failures};
console.log(JSON.stringify(report,null,2));
if(failures.length){process.exitCode=1;}
