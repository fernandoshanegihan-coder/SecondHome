// Outputs only public entity metadata and status; never credentials.
import { writeFileSync, mkdirSync } from 'node:fs';
const key = process.env.QLOO_API_KEY;
if (!key) { console.log('Qloo key is missing'); process.exit(2); }
const base = process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com';
async function query(path, params) {
  const url = new URL(path, base);
  url.search = new URLSearchParams(params).toString();
  const r = await fetch(url, { headers: { 'X-Api-Key': key }, signal: AbortSignal.timeout(60000) });
  if (!r.ok) { console.log(JSON.stringify({path,status:r.status})); return null; }
  return r.json();
}
const profiles = [['Radiohead','Spirited Away','Murakami'],['Beyonce','Barbie','Nike']];
const evidence = [];
for (const names of profiles) {
  const seeds = [];
  for (const name of names) {
    const data = await query('/search', { query:name,types:'urn:entity:artist,urn:entity:movie,urn:entity:book,urn:entity:brand,urn:entity:place',take:'3' });
    const entities = data?.results?.entities || data?.results || [];
    console.log(JSON.stringify({search:name,shape:data?Object.keys(data):[],matches:Array.isArray(entities)?entities.map(e=>({id:e.entity_id,name:e.name,subtype:e.subtype})):Object.keys(entities)}));
    if (Array.isArray(entities) && entities[0]?.entity_id) seeds.push(entities[0].entity_id);
  }
  if (!seeds.length) continue;
  for (const city of ['London','New York']) {
    const data = await query('/v2/insights', {'filter.type':'urn:entity:place','signal.interests.entities':seeds.join(','),'filter.location.query':city,'feature.explainability':'true',take:'6'});
    const entities = data?.results?.entities || [];
    const row = {city,profile:names,seeds,entities,query:data?.query};
    evidence.push(row);
    mkdirSync('.sites-runtime', {recursive:true});
    writeFileSync('.sites-runtime/qloo-validation.json',JSON.stringify(evidence,null,2));
    console.log(JSON.stringify({city,count:entities.length,names:entities.map(e=>e.name),explanation:entities[0]?.query,query:data?.query}).slice(0,3500));
  }
}
mkdirSync('.sites-runtime', {recursive:true});
writeFileSync('.sites-runtime/qloo-validation.json',JSON.stringify(evidence,null,2));
