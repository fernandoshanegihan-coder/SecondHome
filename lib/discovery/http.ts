import { InputError } from "./schema.ts";
import { QlooError } from "../qloo/client.ts";
export async function readBody(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json")
    throw new InputError("Send a JSON request.");
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new InputError("Open Second Home directly to make this request.");
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("The request is empty.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 20000) {
      await reader.cancel();
      throw new InputError("The request is too large.");
    }
    chunks.push(value);
  }
  try {
    const data = new Uint8Array(bytes);
    let offset = 0;
    for (const c of chunks) {
      data.set(c, offset);
      offset += c.length;
    }
    return JSON.parse(new TextDecoder().decode(data));
  } catch {
    throw new InputError("The request could not be read.");
  }
}
export function apiError(error: unknown) {
  const status =
    error instanceof InputError
      ? 400
      : error instanceof QlooError
        ? error.code === "RATE_LIMIT"
          ? 429
          : 503
        : 500;
  return Response.json(
    {
      error: {
        code:
          error instanceof QlooError
            ? error.code
            : status === 400
              ? "INPUT"
              : "INTERNAL",
        message:
          error instanceof InputError || error instanceof QlooError
            ? error.message
            : "Something went wrong. Please try again.",
      },
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
