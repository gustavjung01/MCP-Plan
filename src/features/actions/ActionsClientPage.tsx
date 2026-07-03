"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { BottomSheet } from "@/ui/overlay/BottomSheet";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import type { ActionItem, ActionKpi, ActionPriority, ActionSource, ActionStatus } from "./actions.types";

function priorityLabel(priority: ActionPriority) {
  if (priority === "high") return "Cao";
  if (priority === "medium") return "Vua";
  return "Thap";
}

function statusLabel(status: ActionStatus) {
  if (status === "todo") return "Can lam";
  if (status === "doing") return "Dang lam";
  if (status === "done") return "Da xong";
  return "Bi chan";
}

function sourceLabel(source: ActionSource) {
  if (source === "session") return "MCP session";
  if (source === "field_check") return "Field check";
  if (source === "order") return "Order";
  return "Thu cong";
}

function buildColumns(onSelect: (item: ActionItem) => void): DataTableColumn<ActionItem>[] {
  return [
    { key: "title", header: "Viec can lam", render: (row) => row.title },
    { key: "accountName", header: "Diem ban", render: (row) => row.accountName },
    { key: "routeName", header: "Tuyen", render: (row) => row.routeName },
    { key: "owner", header: "Phu trach", render: (row) => row.owner },
    { key: "source", header: "Nguon", render: (row) => <span className="badge">{sourceLabel(row.source)}</span> },
    { key: "priority", header: "Uu tien", render: (row) => <span className="badge">{priorityLabel(row.priority)}</span> },
    { key: "status", header: "Trang thai", render: (row) => <span className="badge">{statusLabel(row.status)}</span> },
    { key: "dueDate", header: "Han", render: (row) => row.dueDate },
    { key: "detail", header: "", render: (row) => <button className="button compact" type="button" onClick={() => onSelect(row)}>Xem</button> }
  ];
}

function ActionDetailSheet({ item, onClose }: { item: ActionItem | null; onClose: () => void }) {
  return (
    <BottomSheet
      open={Boolean(item)}
      onClose={onClose}
      title={item ? item.title : "Chi tiet viec"}
      description={item ? `${item.accountName} · ${item.routeName}` : undefined}
      footer={
        <div className="sheet-action-grid">
          <button className="button primary" type="button">Danh dau dang lam</button>
          <button className="button" type="button">Doi han / giao lai</button>
          <button className="button" type="button" onClick={onClose}>Dong</button>
        </div>
      }
    >
      {item ? (
        <div className="plan-sheet-content">
          <div className="plan-focus-card">
            <span>Trang thai</span>
            <strong>{statusLabel(item.status)}</strong>
            <small>{sourceLabel(item.source)} · Uu tien {priorityLabel(item.priority)}</small>
          </div>

          <div className="grid">
            <div className="metric-row"><span>Phu trach</span><strong>{item.owner}</strong></div>
            <div className="metric-row"><span>Han xu ly</span><strong>{item.dueDate}</strong></div>
            <div className="metric-row"><span>Diem ban</span><strong>{item.accountName}</strong></div>
            <div className="metric-row"><span>Tuyen</span><strong>{item.routeName}</strong></div>
          </div>

          <div className="sheet-note-card">
            <h3>Ghi chu xu ly</h3>
            <p>{item.note}</p>
          </div>
        </div>
      ) : null}
    </BottomSheet>
  );
}

export function ActionsClientPage({ kpis, items }: { kpis: ActionKpi[]; items: ActionItem[] }) {
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const columns = useMemo(() => buildColumns(setSelectedItem), []);

  return (
    <AppShell activeHref="/plans">
      <PageHeader
        eyebrow="MCP-Plan"
        title="Ke hoach hanh dong"
        subtitle="Moi viec co owner, uu tien, han xu ly va popup cap nhat nhanh nhu app mobile."
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
        {kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="hero-panel" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="panel-title">Danh sach viec uu tien</h2>
          <DataTable columns={columns} rows={items} getRowKey={(row) => row.id} />
        </div>

        <div className="card">
          <h2 className="panel-title">Lien ket workflow</h2>
          <div className="grid">
            <div className="metric-row"><span>Order</span><strong>Theo doi</strong></div>
            <div className="metric-row"><span>Check</span><strong>Xu ly</strong></div>
            <div className="metric-row"><span>Owner</span><strong>Chiu trach nhiem</strong></div>
          </div>
        </div>
      </section>

      <ActionDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
    </AppShell>
  );
}
