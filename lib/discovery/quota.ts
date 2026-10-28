import {QlooError} from '../qloo/client.ts';
export function createQuotaGuard({perClient=20,total=60,windowMs=60000,now=Date.now}:{perClient?:number;total?:number;windowMs?:number;now?:()=>number}={}){
 let windowStart=now();let totalUsed=0;const clients=new Map<string,number>();
 return (client:string)=>{const time=now();if(time-windowStart>=windowMs){windowStart=time;totalUsed=0;clients.clear();}const used=clients.get(client)||0;if(used>=perClient||totalUsed>=total||clients.size>=1000&&!clients.has(client))throw new QlooError('RATE_LIMIT','Please wait a minute before searching again.');clients.set(client,used+1);totalUsed++;};
}
const guard=createQuotaGuard();
export function takeQuota(request:Request){guard(request.headers.get('oai-authenticated-user-id')||request.headers.get('cf-connecting-ip')||'local');}
