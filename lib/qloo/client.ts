export class QlooError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
export type QlooClient = (
  path: string,
  params: Record<string, string>,
) => Promise<any>;
export function createQlooClient(
  options: { key?: string; base?: string; fetcher?: typeof fetch } = {},
): QlooClient {
  return async (path, params) => {
    if (typeof window !== "undefined")
      throw new QlooError("CONFIG", "Qloo is available only on the server.");
    const key = options.key ?? process.env.QLOO_API_KEY;
    if (!key)
      throw new QlooError(
        "CONFIG",
        "Add your Qloo key to the server settings to enable live discoveries.",
      );
    const base =
      options.base ??
      process.env.QLOO_API_URL ??
      "https://hackathon.api.qloo.com";
    const origin = new URL(base);
    if (
      origin.protocol !== "https:" ||
      !["api.qloo.com", "hackathon.api.qloo.com"].includes(origin.hostname)
    )
      throw new QlooError(
        "CONFIG",
        "The Qloo server address is not supported.",
      );
    const url = new URL(path, origin);
    url.search = new URLSearchParams(params).toString();
    let response: Response;
    try {
      response = await (options.fetcher ?? fetch)(url, {
        headers: { "X-Api-Key": key, accept: "application/json" },
        signal: AbortSignal.timeout(60000),
      });
    } catch {
      throw new QlooError(
        "UPSTREAM",
        "Qloo could not be reached. Your preferences are safe; please try again.",
      );
    }
    if (response.status === 401 || response.status === 403)
      throw new QlooError(
        "AUTH",
        "The Qloo key was not accepted. Check the server key and Qloo API address.",
      );
    if (response.status === 404 && path === "/search") return { results: [] };
    if (response.status === 429)
      throw new QlooError(
        "RATE_LIMIT",
        "Qloo is busy. Please wait a moment before trying again.",
      );
    if (!response.ok)
      throw new QlooError(
        "UPSTREAM",
        "Qloo could not complete this search. Try different tastes or a different city.",
      );
    try {
      const data = (await response.json()) as { success?: boolean };
      if (data?.success === false) throw new Error();
      return data;
    } catch {
      throw new QlooError(
        "UPSTREAM",
        "Qloo returned an unreadable result. Please try again.",
      );
    }
  };
}
