import { createApiClient } from "@/lib/api/api-client";
import type { OrderDto } from "@/lib/api/api.types";
import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

function getStatusLabel(status: string) {
  if (status === "draft") return "Nhap";
  if (status === "confirmed") return "Da chot";
  if (status === "delivered") return "Da giao";
  return "Huy";
}

const columns: DataTableColumn<OrderDto>[] = [
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

function buildOrderKpis(orders: OrderDto[]) {
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const skuCount = orders.reduce((sum, order) => sum + order.skuCount, 0);
  const openOrders = orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled").length;

  return [
    { label: "Don hang", value: orders.length, hint: "Tu API client" },
    { label: "Doanh so", value: money.format(totalAmount), hint: "Tong gia tri" },
    { label: "SKU", value: skuCount, hint: "Mat hang ban" },
    { label: "Cho xu ly", value: openOrders, hint: "Chua giao/huy" }
  ];
}

export async function OrdersPage() {
  const api = createApiClient();
  const ordersResult = await api.listOrders();
  const kpis = buildOrderKpis(ordersResult.data);

  return (
    <AppShell activeHref="/orders">
      <PageHeader
        eyebrow="Orders"
        title="Don hang"
        subtitle="Theo doi don hang qua API client contract. Sau nay doi backend ma khong sua UI table."
      >
        <span className="badge">{ordersResult.source}</span>
      </PageHeader>

      <FilterBar
        filters={[
          { label: "Ngay", value: "Gan nhat" },
          { label: "Tuyen", value: "Tat ca" },
          { label: "Trang thai", value: "Tat ca" }
        ]}
      />

      <section className="grid cards">
        {kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="hero-panel" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="panel-title">Danh sach don hang</h2>
          <DataTable columns={columns} rows={ordersResult.data} getRowKey={(row) => row.id} />
        </div>

        <div className="card">
          <h2 className="panel-title">Boundary</h2>
          <div className="grid">
            <div className="metric-row"><span>Feature</span><strong>Khong doc mock</strong></div>
            <div className="metric-row"><span>API client</span><strong>Nguon data</strong></div>
            <div className="metric-row"><span>DTO</span><strong>Hop dong</strong></div>
            <div className="metric-row"><span>Backend</span><strong>Doi sau</strong></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
