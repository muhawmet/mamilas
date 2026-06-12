const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const files=[
 ...fs.readdirSync(path.join(root,'02_GPT_AGENTS')).filter(x=>x.endsWith('.md')).map(x=>'02_GPT_AGENTS/'+x),
 ...fs.readdirSync(path.join(root,'03_CLAUDE_AGENTS')).filter(x=>x.endsWith('.md')).map(x=>'03_CLAUDE_AGENTS/'+x),
 ...fs.readdirSync(path.join(root,'04_AGENT_KNOWLEDGE')).filter(x=>x.endsWith('.md')).map(x=>'04_AGENT_KNOWLEDGE/'+x)
];
const failures=[],results=[];
for(const file of files){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  const isKnowledge=file.includes('KNOWLEDGE');
  const required=isKnowledge?[/V35/i,/effective|canonical/i,/Turkish|Türkçe|visible-text/i]:[/V35/i,/canonical/i,/Turkish|Türkçe|visible-text/i];
  const missing=required.filter(r=>!r.test(text)).map(String);
  if(Buffer.byteLength(text)>8000)failures.push(file+' exceeds 8000 bytes');
  if(missing.length)failures.push(file+' missing '+missing.join(', '));
  results.push({file,bytes:Buffer.byteLength(text),under8000:Buffer.byteLength(text)<=8000,missing});
}
const site=fs.readFileSync(path.join(root,'01_SITE/mamilas.html'),'utf8');
for(const token of ['MAMILAS PRIME v35','v35ApplyProject','mamilasEffectiveRefs','TURKISH VISIBLE-TEXT LOCK','Adaptif Reçete']){
  if(!site.includes(token))failures.push('Site missing '+token);
}
const install=fs.readFileSync(path.join(root,'00_INSTALL.md'),'utf8');
if(!/v35 repaired runtime/.test(install))failures.push('Install guide does not identify v35 repaired runtime');
if(/01_SITE\/mamilas\.html` remains unchanged/.test(install))failures.push('Install guide incorrectly says site remains unchanged');
for(const file of ['05_TESTS_AND_REPORTS/v35_runtime_test.js','05_TESTS_AND_REPORTS/v35_static_test.js','05_TESTS_AND_REPORTS/v35_data_dump.js','05_TESTS_AND_REPORTS/v35_regression_test.js','05_TESTS_AND_REPORTS/V35_MANUAL_VISUAL_QA.md']){
  if(!fs.existsSync(path.join(root,file)))failures.push('Missing v35 verifier: '+file);
}
console.log(JSON.stringify({generatedAt:new Date().toISOString(),failures,results},null,2));
process.exitCode=failures.length?1:0;
