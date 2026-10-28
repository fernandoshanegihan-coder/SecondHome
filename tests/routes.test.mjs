import {test} from 'node:test';
import assert from 'node:assert/strict';
import {POST as discover} from '../app/api/discover/route.ts';
import {POST as resolve} from '../app/api/resolve/route.ts';
import {readBody} from '../lib/discovery/http.ts';
test('invalid discovery is rejected before any upstream call',async()=>{
 const r=await discover(new Request('https://secondhome.test/api/discover',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}));assert.equal(r.status,400);assert.equal((await r.json()).error.code,'INPUT');
});
test('cross-origin calls cannot spend the Qloo key',async()=>{
 const r=await resolve(new Request('https://secondhome.test/api/resolve',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://other.test'},body:JSON.stringify({kind:'taste',text:'Radiohead'})}));assert.equal(r.status,400);
});
test('oversized request is rejected without JSON parsing',async()=>{
 await assert.rejects(()=>readBody(new Request('https://secondhome.test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({long:'x'.repeat(21000)})})),/too large/);
});
