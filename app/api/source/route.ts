import { getSourceMarkdown } from "@/lib/catalog";

export const dynamic = "force-static";

export function GET() {
  return new Response(getSourceMarkdown(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": "inline; filename=\"apis_publicas_prefeitura_cuiaba_mt.md\"",
    },
  });
}
