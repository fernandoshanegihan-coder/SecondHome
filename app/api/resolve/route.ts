import {resolveTaste,resolveCity} from '../../../lib/qloo/resolve.ts';
import {InputError} from '../../../lib/discovery/schema.ts';
import {readBody,apiError} from '../../../lib/discovery/http.ts';
import {takeQuota} from '../../../lib/discovery/quota.ts';
export async function POST(request:Request){try{const body=await readBody(request) as {kind:string;text:string};if(!body||!['city','taste'].includes(body.kind)||typeof body.text!=='string'||body.text.trim().length<2||body.text.length>150)throw new InputError('Enter between 2 and 150 characters to search.');takeQuota(request);return Response.json({choices:await (body.kind==='city'?resolveCity:resolveTaste)(body.text.trim())},{headers:{'Cache-Control':'no-store'}});}catch(e){return apiError(e);}}
