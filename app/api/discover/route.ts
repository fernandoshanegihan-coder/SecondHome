import { discover } from "../../../lib/discovery/agent.ts";
import { parseDiscoveryRequest } from "../../../lib/discovery/schema.ts";
import { readBody, apiError } from "../../../lib/discovery/http.ts";
import { takeQuota } from "../../../lib/discovery/quota.ts";
export async function POST(request: Request) {
  try {
    const input = parseDiscoveryRequest(await readBody(request));
    takeQuota(request);
    return Response.json(await discover(input), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return apiError(e);
  }
}
