import { NextResponse } from "next/server";
import { getCatalog, getCatalogStats } from "@/lib/catalog";

export const dynamic = "force-static";

export function GET() {
  const entries = getCatalog();
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    source: "data/apis_publicas_prefeitura_cuiaba_mt.md",
    stats: getCatalogStats(entries),
    entries,
  });
}
