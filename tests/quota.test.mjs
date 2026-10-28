import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createQuotaGuard} from '../lib/discovery/quota.ts';
test('quota rejects bursts and resets after the window',()=>{let now=0;const guard=createQuotaGuard({perClient:2,total:3,windowMs:1000,now:()=>now});guard('A');guard('A');assert.throws(()=>guard('A'),/wait/i);guard('B');assert.throws(()=>guard('C'),/wait/i);now=1001;assert.doesNotThrow(()=>guard('A'));});
