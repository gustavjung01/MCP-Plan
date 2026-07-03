import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import { actionsMock } from "./actions.mock";
import type { ActionItem } from "./actions.types";

const columns: DataTableColumn<ActionItem>[] = [
  { key: "title", header: "Viec can lam", render: (row) => row.title },
  { key: "accountName", header: "Diem ban", render: (row) => row.accountName },
  { key: "routeName", header: "Tuyen", render: (row) => row.routeName },
  { key: "owner", header: "Phu trach", render: (row) => row.owner },
  { key: "source", header: "Nguon", render: (row) => <span className="badge">{row.source}</span> },
  { key: "priority", header: "Uu tien", render: (row) => <span className="badge">{row.priority}</span> },
  { key: "status", header: "Trang thai", render: (row) => <span className="badge">{row.status}</span> },
  { key: "dueDate", header: "Han", render: (row) => row.dueDate },
  { key: "note", header: "Ghi chu", render: (row) => row.note }
];

export function ActionsPage() {
  return (
    <AppShell activeHref="/plans">
      <PageHeader
        eyebrow="MCP-Plan"
        title="Ke hoach hanh dong"
        subtitle="Danh sach viec sau MCP session, field check va don hang. Moi viec can co owner, uu tien va han xu ly."
      >
        <span className="badge">Mock data</span>
      </PageHeader>

      <FilterBar
        filters={[
          { label: "Nguon", value: "Tat ca" },
          { label: "Uu tien", value: "Tat ca" },
          { label: "Trang thai", value: "Dang mo" }
        ]}
      />

      <section className="grid cards">
        {actionsMock.kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="hero-panel" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="panel-title">Danh sach viec uu tien</h2>
          <DataTable columns={columns} rows={actionsMock.items} getRowKey={(row) => row.id} />
        </div>

        <div className="card">
          <h2 className="panel-title">Logic</h2>
          <div className="grid">
            <div className="metric-row"><span>Session</span><strong>Phat hien</strong></div>
            <div className="metric-row"><span>Check</span><strong>Co hoi/rui ro</strong></div>
            <div className="metric-row"><span>Order</span><strong>Theo ban</strong></div>
            <div className="metric-row"><span>Action</span><strong>Owner + han</strong></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
