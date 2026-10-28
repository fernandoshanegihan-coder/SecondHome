const base=process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com';
for(const [query,types] of [['London','urn:entity:locality'],['London','urn:entity:destination'],['Radiohead','urn:entity:artist']]){
 const u=new URL('/search',base);u.search=new URLSearchParams({query,types,take:'3'}).toString();
 const r=await fetch(u,{headers:{'X-Api-Key':process.env.QLOO_API_KEY},signal:AbortSignal.timeout(20000)});
 const d=await r.json();const a=Array.isArray(d.results)?d.results:d.results?.entities;
 console.log(JSON.stringify({query,types,status:r.status,results:a?.map(e=>({...e,properties:e.properties?{geocode:e.properties.geocode,description:e.properties.description?.slice(0,100)}:null}))}).slice(0,7000));
}
