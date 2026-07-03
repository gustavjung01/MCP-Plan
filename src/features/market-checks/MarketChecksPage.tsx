import { createApiClient } from "@/lib/api/api-client";
import { MarketChecksClientPage } from "./MarketChecksClientPage";

export async function MarketChecksPage() {
  const api = createApiClient();
  const result = await api.getMarketChecksData();

  return <MarketChecksClientPage kpis={result.data.kpis} checks={result.data.checks} />;
}
