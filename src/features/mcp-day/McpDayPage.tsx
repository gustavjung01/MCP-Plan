import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import { mcpDayMock } from "./mcp-day.mock";
import type { DayLineSource, DayLineStatus, McpDayLine, McpDayResult } from "./mcp-day.types";

function getSourceLabel(source: DayLineSource) {
  if (source === "planned") return "Ke hoach";
  if (source === "added") return "Phat sinh";
  return "Dong bo";
}

function getStatusLabel(status: DayLineStatus) {
  if (status === "pending") return "Cho ghe";
  if (status === "visited") return "Da ghe";
  if (status === "skipped") return "Bo qua";
  return "Huy";
}

const lineColumns: DataTableColumn<McpDayLine>[] = [
  { key: "sortOrder", header: "STT", render: (row) => row.sortOrder, align: "right" },
  { key: "accountName", header: "Diem ban", render: (row) => row.accountName },
  { key: "area", header: "Khu vuc", render: (row) => row.area },
  { key: "source", header: "Nguon", render: (row) => <span className="badge">{getSourceLabel(row.source)}</span> },
  { key: "status", header: "Trang thai", render: (row) => <span className="badge">{getStatusLabel(row.status)}</span> },
  { key: "hasOrder", header: "Don", render: (row) => (row.hasOrder ? "Co" : "Khong"), align: "center" },
  { key: "note", header: "Ghi chu", render: (row) => row.result ?? row.note }
];

const resultColumns: DataTableColumn<McpDayResult>[] = [
  { key: "accountName", header: "Diem ban", render: (row) => row.accountName },
  { key: "startTime", header: "Bat dau", render: (row) => row.startTime },
  { key: "endTime", header: "Ket thuc", render: (row) => row.endTime },
  { key: "result", header: "Ket qua", render: (row) => row.result },
  { key: "hasOrder", header: "Don", render: (row) => (row.hasOrder ? "Co" : "Khong"), align: "center" },
  { key: "nextAction", header: "Viec tiep", render: (row) => row.nextAction }
];

export function McpDayPage() {
  const run = mcpDayMock.run;

  return (
    <AppShell activeHref="/visits">
      <PageHeader
        eyebrow="MCP Daily Session"
        title="Phien MCP ngay"
        subtitle="Man hinh nay the hien session ngay va snapshot khach trong phien, khong tron voi tuyen goc hay ket qua ghe."
      >
        <span className="badge">{run.status}</span>
      </PageHeader>

      <FilterBar
        filters={[
          { label: "Ngay", value: run.date },
          { label: "Tuyen", value: run.routeName },
          { label: "Sale", value: run.owner },
          { label: "Mo luc", value: run.openedAt }
        ]}
      />

      <section className="grid cards">
        {mcpDayMock.kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="hero-panel" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="panel-title">Snapshot khach trong phien</h2>
          <DataTable columns={lineColumns} rows={mcpDayMock.lines} getRowKey={(row) => row.id} />
        </div>

        <div className="card">
          <h2 className="panel-title">Dung logic MCP</h2>
          <div className="grid">
            <div className="metric-row"><span>Tuyen goc</span><strong>Ke hoach</strong></div>
            <div className="metric-row"><span>Phien ngay</span><strong>Thuc te</strong></div>
            <div className="metric-row"><span>Snapshot</span><strong>Khach phai xu ly</strong></div>
            <div className="metric-row"><span>Ket qua</span><strong>Sau khi ghe</strong></div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="panel-title">Ket qua da ghe</h2>
        <DataTable columns={resultColumns} rows={mcpDayMock.results} getRowKey={(row) => row.id} />
      </section>
    </AppShell>
  );
}
