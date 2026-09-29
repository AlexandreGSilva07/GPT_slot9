import Explorer from "@/components/Explorer";
import { getCatalog, getSourceMarkdown } from "@/lib/catalog";

export const dynamic = "force-static";

export default function Home() {
  const catalog = getCatalog();
  const source = getSourceMarkdown();

  return <Explorer initialCatalog={catalog} sourceMarkdown={source} />;
}
