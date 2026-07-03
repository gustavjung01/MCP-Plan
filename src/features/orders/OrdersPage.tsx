import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import { ordersMock } from "./orders.mock";
import type { OrderItem, OrderStatus } from "./orders.types";

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

function getStatusLabel(status: OrderStatus) {
  if (status === "draft") return "Nhap";
  if (status === "confirmed") return "Da chot";
  if (status === "delivered") return "Da giao";
  return "Huy";
}

const columns: DataTableColumn<OrderItem>[] = [
  { key: "code", header: "Ma don", render: (row) => row.code },
  { key: "date", header: "Ngay", render: (row) => row.date },
  { key: "accountName", header: "Diem ban", render: (row) => row.accountName },
  { key: "routeName", header: "Tuyen", render: (row) => row.routeName },
  { key: "owner", header: "Sale", render: (row) => row.owner },
  { key: "source", header: "Nguon", render: (row) => row.source },
  { key: "skuCount", header: "SKU", render: (row) => row.skuCount, align: "right" },
  { key: "quantity", header: "SL", render: (row) => row.quantity, align: "right" },
  { key: "totalAmount", header: "Gia tri", render: (row) => money.format(row.totalAmount), align: "right" },
  { key: "status", header: "Trang thai", render: (row) => <span className="badge">{getStatusLabel(row.status)}</span> }
];

export function OrdersPage() {
  return (
    <AppShell activeHref="/orders">
      <PageHeader
        eyebrow="Orders"
        title="Don hang"
        subtitle="Theo doi don hang phat sinh tu MCP session, visit result, field check hoac kenh khac. UI hien dang dung mock data."
      >
        <span className="badge">Mock data</span>
      </PageHeader>

      <FilterBar
        filters={[
          { label: "Ngay", value: "Gan nhat" },
          { label: "Tuyen", value: "Tat ca" },
          { label: "Trang thai", value: "Tat ca" }
        ]}
      />

      <section className="grid cards">
        {ordersMock.kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="hero-panel" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="panel-title">Danh sach don hang</h2>
          <DataTable columns={columns} rows={ordersMock.orders} getRowKey={(row) => row.id} />
        </div>

        <div className="card">
          <h2 className="panel-title">Dung vai tro don hang</h2>
          <div className="grid">
            <div className="metric-row"><span>Session</span><strong>Nguon phat sinh</strong></div>
            <div className="metric-row"><span>Order</span><strong>Gia tri ban</strong></div>
            <div className="metric-row"><span>SKU</span><strong>Mat hang</strong></div>
            <div className="metric-row"><span>Plan</span><strong>Theo doi sau ban</strong></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
