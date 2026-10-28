import {resolveCity,resolveTaste} from '../lib/qloo/resolve.ts';
import {discover,replace} from '../lib/discovery/agent.ts';
const cities=await resolveCity('London');
const city=cities.find(c=>c.label.includes('United Kingdom'));
if(!city)throw new Error('London city match missing');
const tastes=[];
for(const [text,kind] of [['Radiohead','artist'],['Spirited Away','movie'],['Nike','brand']]){
 const choices=await resolveTaste(text);const choice=choices.find(c=>c.kind===kind);if(!choice)throw new Error('Missing taste match');tastes.push(choice);
}
const context={city,tastes,preferences:{}};
const result=await discover(context);
console.log(JSON.stringify({city:city.label,tastes:tastes.map(t=>t.name),places:result.items.map(i=>({name:i.place.name,evidence:i.place.evidence})),warnings:result.warnings}));
if(result.items.length!==3)throw new Error('Expected three live discoveries');
const rejected=result.items[0].place.id;
const changed=await replace({context,current:result.items,replaceId:rejected,feedback:'Something different'});
console.log(JSON.stringify({replacement:changed.items[0].place.name,changed:changed.items[0].place.id!==rejected,othersPreserved:changed.items[1].place.id===result.items[1].place.id&&changed.items[2].place.id===result.items[2].place.id}));
if(changed.items[0].place.id===rejected)throw new Error('Expected a live replacement');
