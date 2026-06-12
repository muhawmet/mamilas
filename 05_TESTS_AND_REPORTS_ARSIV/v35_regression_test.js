const {spawnSync}=require('child_process');
const path=require('path');
const dump=path.join(__dirname,'v35_data_dump.js');
const source=process.argv[2]||'/Users/Muhammet/Desktop/mamişş/source_snapshot/files/mamilas.html';
const work=process.argv[3]||path.resolve(__dirname,'../01_SITE/mamilas.html');
function load(file){
  const r=spawnSync(process.execPath,[dump,file],{encoding:'utf8',maxBuffer:20*1024*1024});
  if(r.status!==0)throw new Error(r.stderr||('dump failed: '+file));
  return JSON.parse(r.stdout);
}
const a=load(source),b=load(work),failures=[];
for(const key of ['paths','projects','worlds','palettes','visuals','materials']){
  if(JSON.stringify(a[key])!==JSON.stringify(b[key]))failures.push('Canonical technical data changed: '+key);
}
// v36/FABLE5: refs are append-only — the original snapshot refs must stay byte-equivalent
// as an ordered prefix; new refs may only be appended after them (never inserted/edited).
if(b.refs.length<a.refs.length)failures.push('Refs shrank: '+a.refs.length+' -> '+b.refs.length);
if(JSON.stringify(a.refs)!==JSON.stringify(b.refs.slice(0,a.refs.length)))failures.push('Canonical technical data changed: refs (original prefix mutated)');
const result={generatedAt:new Date().toISOString(),source,work,counts:{refs:b.refs.length,visuals:b.visuals.length,materials:b.materials.length},failures};
console.log(JSON.stringify(result,null,2));
process.exitCode=failures.length?1:0;
