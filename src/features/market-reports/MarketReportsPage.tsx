import { marketReportsMock } from "./market-reports.mock";
import { MarketReportsClientPage } from "./MarketReportsClientPage";

export function MarketReportsPage() {
  return <MarketReportsClientPage kpis={marketReportsMock.kpis} reports={marketReportsMock.reports} />;
}
