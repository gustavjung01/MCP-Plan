import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import { marketChecksMock } from "./market-checks.mock";
import type { MarketCheckItem, MarketCheckStatus } from "./market-checks.types";

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

function getStatusLabel(status: MarketCheckStatus) {
  if (status === "opportunity") return "Co hoi";
  if (status === "risk") return "Rui ro";
  return "Binh thuong";
}

const columns: DataTableColumn<MarketCheckItem>[] = [
  { key: "date", header: "Ngay", render: (row) => row.date },
  { key: "routeName", header: "Tuyen", render: (row) => row.routeName },
  { key: "accountName", header: "Diem ban", render: (row) => row.accountName },
  { key: "productName", header: "San pham", render: (row) => row.productName },
  { key: "competitorName", header: "Doi thu", render: (row) => row.competitorName },
  { key: "shelfPrice", header: "Gia ke", render: (row) => money.format(row.shelfPrice), align: "right" },
  { key: "stockStatus", header: "Ton kho", render: (row) => row.stockStatus },
  { key: "status", header: "Danh gia", render: (row) => <span className="badge">{getStatusLabel(row.status)}</span> },
  { key: "note", header: "Ghi chu", render: (row) => row.note }
];

export function MarketChecksPage() {
  return (
    <AppShell activeHref="/field-checks">
      <PageHeader
        eyebrow="Field Checks"
        title="Kiem tra thi truong"
        subtitle="Ghi nhan san pham, gia ke, doi thu, ton kho va co hoi/rui ro tai diem ban. Day la ket qua quan sat, khong tron voi MCP session."
      >
        <span className="badge">Mock data</span>
      </PageHeader>

      <FilterBar
        filters={[
          { label: "Ngay", value: "Gan nhat" },
          { label: "Tuyen", value: "Tat ca" },
          { label: "Danh gia", value: "Tat ca" }
        ]}
      />

      <section className="grid cards">
        {marketChecksMock.kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="hero-panel" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="panel-title">Bang kiem tra thi truong</h2>
          <DataTable columns={columns} rows={marketChecksMock.checks} getRowKey={(row) => row.id} />
        </div>

        <div className="card">
          <h2 className="panel-title">Dung vai tro du lieu</h2>
          <div className="grid">
            <div className="metric-row"><span>MCP session</span><strong>Ai phai ghe</strong></div>
            <div className="metric-row"><span>Visit result</span><strong>Da ghe ra sao</strong></div>
            <div className="metric-row"><span>Field check</span><strong>Thay gi tai diem ban</strong></div>
            <div className="metric-row"><span>Plan</span><strong>Can lam gi tiep</strong></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
