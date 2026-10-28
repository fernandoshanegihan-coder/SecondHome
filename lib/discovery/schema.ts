import type {DiscoveryRequest,ReplacementRequest} from './types.ts';
export class InputError extends Error{}
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function text(v:unknown,max=200):v is string{return typeof v==='string' && v.trim().length>0 && v.length<=max;}
export function parseDiscoveryRequest(value:unknown):DiscoveryRequest {
 const v=value as DiscoveryRequest;
 if(!v || !v.city || !uuid.test(v.city.id) || !text(v.city.label,300) || !Number.isFinite(v.city.lat)||Math.abs(v.city.lat)>90||!Number.isFinite(v.city.lon)||Math.abs(v.city.lon)>180)throw new InputError('Choose a city from the search results.');
 if(!Array.isArray(v.tastes)||v.tastes.length<3||v.tastes.length>5||new Set(v.tastes.map(t=>t?.id)).size!==v.tastes.length||v.tastes.some(t=>!t||!uuid.test(t.id)||!text(t.name)||!['artist','movie','book','brand','place'].includes(t.kind)))throw new InputError('Choose three to five different favourites from the search results.');
 const p=v.preferences ?? {};
 for(const k of ['budget','atmosphere','area'] as const){if(p[k]!==undefined && (typeof p[k]!=='string'||p[k]!.length>150))throw new InputError('Keep each preference under 150 characters.');}
 return {city:v.city,tastes:v.tastes,preferences:p};
}
export function parseReplacementRequest(value:unknown):ReplacementRequest {
 const v=value as ReplacementRequest;
 const context=parseDiscoveryRequest(v?.context);
 if(!Array.isArray(v.current)||v.current.length<1||v.current.length>3||!text(v.feedback,200)||!text(v.replaceId,100)||!v.current.some(c=>c?.place?.id===v.replaceId))throw new InputError('Choose a discovery to replace and describe the change.');
 for(const c of v.current){if(!c?.place||!uuid.test(c.place.id)||!text(c.place.name)||!Array.isArray(c.place.tags)||!Array.isArray(c.place.evidence)||!text(c.reason,2000)||!text(c.mapUrl,3000))throw new InputError('These discoveries could not be read. Please discover again.');}
 if(v.excludedIds && (!Array.isArray(v.excludedIds)||v.excludedIds.length>50||v.excludedIds.some(id=>!uuid.test(id))))throw new InputError('Start a fresh discovery to continue exploring.');
 return {context,current:v.current,replaceId:v.replaceId,feedback:v.feedback,excludedIds:v.excludedIds};
}
