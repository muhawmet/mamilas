const fs=require('fs');
function el(){return new Proxy(function(){},{get:(t,k)=>{
  if(k==='style')return {};
  if(k==='classList')return {add(){},remove(){},toggle(){},contains(){return false}};
  if(['appendChild','setAttribute','addEventListener','removeChild','insertBefore','remove','focus','click','select'].includes(k))return ()=>el();
  if(k==='querySelector')return ()=>el();
  if(k==='querySelectorAll'||k==='children')return [];
  if(['innerHTML','textContent','value','className','id'].includes(k))return '';
  if(k==='parentNode'||k==='firstChild')return el();
  return el();
},set:()=>true,apply:()=>el()});}
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

const site=process.argv[2];
if(!site)throw new Error('Usage: node v35_data_dump.js /path/to/mamilas.html');
const html=fs.readFileSync(site,'utf8'),src=html.match(/<script>([\s\S]*)<\/script>/)[1];
(0,eval)(src+';window.__DATA=DATA;');
const pick=(obj,keys)=>Object.fromEntries(keys.map(k=>[k,obj[k]]));
const refKeys=['id','name','cat','use','dna','avoid','bestPaths','bestPalettes','preview','anchor','cinedna'];
const visualKeys=['id','group','label','tag','shell','grain','best','avoid','preview','colors'];
const materialKeys=['id','group','label','phrase','truth','teaches','method','best','avoid','preview','colors'];
console.log(JSON.stringify({
  paths:window.__DATA.paths,projects:window.__DATA.projects,worlds:window.__DATA.worlds,palettes:window.__DATA.palettes,
  refs:window.__DATA.refs.map(x=>pick(x,refKeys)),
  visuals:(window.V32_VISUALS||[]).map(x=>pick(x,visualKeys)),
  materials:(window.V32_MATERIALS||[]).map(x=>pick(x,materialKeys))
}));
