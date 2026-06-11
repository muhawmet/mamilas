// MAMILAST cleanup — golden-master dump & compare
// Captures deterministic output fingerprints of the live site logic. Run before and
// after every cleanup step; any unintended diff = the step broke something.
// Dump:    node golden_dump.js ../01_SITE/mamilas.html > golden_baseline.json
// Compare: node golden_dump.js ../01_SITE/mamilas.html golden_baseline.json
//          → prints CHANGED/MISSING keys, exit 1 on any diff.
// NOTE: intentionally non-strict (same DOM-shim contract as the v35/v36 harnesses).
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');

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
const H=s=>crypto.createHash('sha256').update(String(s)).digest('hex').slice(0,16);
const G={};

// --- data surface ---
G['data.refs.count']=D.refs.length;
G['data.refs.fields']=H(D.refs.map(r=>[r.id,r.cat,r.use,r.dna,r.avoid,(r.bestPaths||[]).join('+')].join('|')).join('\n'));
G['data.palettes']=H(D.palettes.map(p=>p.id+(p.colors||[]).join('')).join('|'));
G['data.paths']=H(D.paths.map(p=>p.id+p.name+p.forbidden).join('|'));

// --- decoder + brief chain (3 canonical briefs) ---
const BRIEFS=[
 'İlkokul çocukları için kesirleri anlatan eğitim videosu. Kesir pizzaya bölünerek anlatılsın. Aras ile Defne izlesin.',
 'Belediyemizin 100. yıl kurumsal tanıtım filmi, gerçek mekan, güven veren. Finalde 100. yıl amblemi belirginleşsin.',
 'Premium telefon kılıfı için ultrareal ürün reklamı, macro yüzey, logo stabil.'
];
BRIEFS.forEach((b,i)=>{
  window.S.briefRaw=b; window.applyDecoder();
  G['brief'+i+'.path']=window.S.productionPath;
  G['brief'+i+'.world']=window.S.world;
  G['brief'+i+'.buildBrief']=H(window.buildBrief());
  ['idea','master','image','motion','suno','proof','client'].forEach(a=>{
    G['brief'+i+'.packet.'+a]=H(window.agentPacket(a));
  });
});

// --- page renderers (EDU state from last brief? reset to brief0 state) ---
window.S.briefRaw=BRIEFS[0]; window.applyDecoder();
window.S.refFam='ALL'; window.S.refSearch=''; window.S.refAffectChip='';
const pages=['dashboard','decoder','project','path','world','reference','palette','ingest','scenes','rhythm','qa','golden','repair','quantum','audit','final','agents','academy'];
G['page.recipe']=H(window.pageRecipe());
pages.forEach(p=>{
  try{
    const fn=window['page'+p.charAt(0).toUpperCase()+p.slice(1)];
    if(typeof fn==='function')G['page.'+p]=H(fn());
  }catch(e){G['page.'+p]='THREW:'+String(e).slice(0,60);}
});
try{G['render.side']=H(window.renderSide());}catch(e){G['render.side']='THREW:'+e;}
try{G['render.right']=H(window.renderRight());}catch(e){G['render.right']='THREW:'+e;}

// --- FABLE preview engine: every ref under two palettes ---
D.refs.forEach(r=>{
  try{
    G['fable.'+r.id]=H((window.fableRender(r.id,'vibrant_clean_education')||'')+'§'+(window.fableRender(r.id,'rembrandt_amber')||''));
  }catch(e){G['fable.'+r.id]='THREW:'+String(e).slice(0,60);}
});

// --- search authority ---
G['search.luffy']=D.refs.filter(r=>window.refSearchMatch(r,'luffy')).map(r=>r.id).sort().join(',');
G['search.altinsaat.count']=D.refs.filter(r=>window.refSearchMatch(r,'altın saat')).length;
G['search.urun.count']=D.refs.filter(r=>window.refSearchMatch(r,'ürün')).length;

// --- output / compare ---
const baselinePath=process.argv[3];
if(!baselinePath){
  console.log(JSON.stringify(G,null,1));
}else{
  const base=JSON.parse(fs.readFileSync(path.resolve(process.cwd(),baselinePath),'utf8'));
  const keys=new Set([...Object.keys(base),...Object.keys(G)]);
  const diffs=[];
  keys.forEach(k=>{
    if(!(k in G))diffs.push('MISSING now: '+k);
    else if(!(k in base))diffs.push('NEW: '+k);
    else if(String(base[k])!==String(G[k]))diffs.push('CHANGED: '+k+'  '+base[k]+' → '+G[k]);
  });
  if(diffs.length){console.log(diffs.join('\n'));console.log('\nDIFF COUNT: '+diffs.length);process.exitCode=1;}
  else console.log('GOLDEN MATCH: '+keys.size+' keys identical');
}
