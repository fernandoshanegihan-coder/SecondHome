import {createQlooClient,type QlooClient,QlooError} from './client.ts';
import type {DiscoveryRequest,PlaceCandidate} from '../discovery/types.ts';
const safeImage=(value:unknown)=>{try{const u=new URL(String(value));return u.protocol==='https:' && (u.hostname==='images.qloo.com'||u.hostname.endsWith('.images.qloo.com'))?u.href:undefined;}catch{return undefined;}};
export async function findPlaces(request:DiscoveryRequest,excludeIds:string[]=[],client:QlooClient=createQlooClient()):Promise<PlaceCandidate[]> {
 const params:Record<string,string>={'filter.type':'urn:entity:place','filter.location':request.city.id,'signal.interests.entities':request.tastes.map(t=>t.id).join(','),'feature.explainability':'true',take:'20'};
 if(excludeIds.length)params['filter.exclude.entities']=excludeIds.join(',');
 const data=await client('/v2/insights',params);
 if(!Array.isArray(data?.results?.entities))throw new QlooError('UPSTREAM','Qloo returned an unreadable place result.');
 return data.results.entities.flatMap((e:any)=>{
  if(!e.entity_id || !e.name || e.subtype!=='urn:entity:place' || e.properties?.is_closed===true)return [];
  const p=e.properties ?? {};
  const explain=JSON.stringify(e.query?.explainability ?? {}).toUpperCase();
  const evidence=request.tastes.filter(t=>explain.includes(t.id.toUpperCase())).map(t=>t.name);
  return [{id:e.entity_id,name:e.name,address:typeof p.address==='string'?p.address:undefined,lat:e.location?.lat,lon:e.location?.lon,description:p.short_description || p.description,image:safeImage(p.image?.url || p.images?.[0]?.url),category:p.primary_genre?.name || e.tags?.find((t:any)=>t.type?.includes('category')||t.type?.includes('genre'))?.name,tags:(e.tags || []).map((t:any)=>t.name).filter((t:unknown)=>typeof t==='string'),evidence,affinity:e.query?.affinity,price:typeof p.price_level==='number'?p.price_level:undefined,ambience:p.ambience_description}];
 });
}
