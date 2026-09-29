import { NextRequest, NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const runtime = "nodejs";

const MAX_TEXT_BYTES = 1_000_000;

function patternToRegex(pattern: string) {
  const escaped = pattern.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  const withParams = escaped.replace(/\\\{[^}]+\\\}/g, "[^/?&#]+");
  return new RegExp("^" + withParams + "$", "i");
}

function findAllowed(url: string, requestedMethod: string) {
  const method = requestedMethod.toUpperCase();
  return getCatalog().find((entry) => {
    if (!entry.canExecute || !entry.url) return false;
    const entryMethod = entry.method.toUpperCase();
    const methodOk =
      entryMethod === method ||
      (method === "GET" && entryMethod.startsWith("GET"));
    if (!methodOk) return false;

    try {
      return patternToRegex(entry.url).test(url);
    } catch {
      return false;
    }
  });
}

async function handle(req: NextRequest) {
  let input: { url?: string; method?: string; body?: unknown };

  try {
    input = req.method === "GET"
      ? {
          url: req.nextUrl.searchParams.get("url") ?? undefined,
          method: req.nextUrl.searchParams.get("method") ?? "GET",
        }
      : await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const target = input.url?.trim();
  const method = (input.method || "GET").toUpperCase();

  if (!target || !/^https?:\/\//i.test(target)) {
    return NextResponse.json({ error: "Informe uma URL HTTP(S) válida." }, { status: 400 });
  }

  const entry = findAllowed(target, method);
  if (!entry) {
    return NextResponse.json(
      {
        error: "Rota não executável ou fora do catálogo permitido.",
        hint: "Somente rotas explicitamente mapeadas como leitura segura no MD podem passar pelo proxy.",
      },
      { status: 403 }
    );
  }

  const init: RequestInit = {
    method,
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: {
      "accept": "application/json,text/plain,text/html,application/pdf,*/*",
      "user-agent": "Cuiaba-API-Atlas/1.0",
    },
  };

  if (method === "POST") {
    init.headers = {
      ...init.headers,
      "content-type": "application/json",
    };
    init.body = JSON.stringify(input.body ?? {});
  }

  const started = Date.now();

  try {
    const response = await fetch(target, init);
    const contentType = response.headers.get("content-type") || "";
    const contentLength = Number(response.headers.get("content-length") || 0);

    if (
      contentType.includes("application/pdf") ||
      contentType.includes("application/octet-stream") ||
      (contentLength && contentLength > MAX_TEXT_BYTES)
    ) {
      return NextResponse.json({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType,
        contentLength: contentLength || null,
        durationMs: Date.now() - started,
        binary: true,
        url: response.url,
        note: "Resposta binária/grande. Use o botão Abrir original para visualizar ou baixar diretamente.",
      });
    }

    const text = (await response.text()).slice(0, MAX_TEXT_BYTES);
    let data: unknown = text;

    if (contentType.includes("json")) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      contentType,
      durationMs: Date.now() - started,
      url: response.url,
      data,
      truncated: text.length >= MAX_TEXT_BYTES,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha desconhecida na consulta.",
        target,
      },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
