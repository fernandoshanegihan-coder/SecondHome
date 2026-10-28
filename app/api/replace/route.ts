import {replace} from '../../../lib/discovery/agent.ts';
import {parseReplacementRequest} from '../../../lib/discovery/schema.ts';
import {readBody,apiError} from '../../../lib/discovery/http.ts';
import {takeQuota} from '../../../lib/discovery/quota.ts';
export async function POST(request:Request){try{const input=parseReplacementRequest(await readBody(request));takeQuota(request);return Response.json(await replace(input),{headers:{'Cache-Control':'no-store'}});}catch(e){return apiError(e);}}
