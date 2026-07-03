import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import { accountsMock } from "./accounts.mock";
import type { AccountItem, AccountStatus } from "./accounts.types";

function formatMoney(value: number) {
  if (value === 0) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
}

function getStatusLabel(status: AccountStatus) {
  if (status === "active") return "Dang cham soc";
  if (status === "need_visit") return "Can ghe lai";
  return "Chua du lieu";
}

const accountColumns: DataTableColumn<AccountItem>[] = [
  { key: "name", header: "Diem ban", render: (row) => row.name },
  { key: "contactName", header: "Lien he", render: (row) => row.contactName },
  { key: "area", header: "Khu vuc", render: (row) => row.area },
  { key: "routeName", header: "Tuyen", render: (row) => row.routeName },
  { key: "tier", header: "Hang", render: (row) => <span className="badge">Tier {row.tier}</span> },
  { key: "lastVisitDate", header: "Ghe gan nhat", render: (row) => row.lastVisitDate },
  { key: "lastOrderDate", header: "Don gan nhat", render: (row) => row.lastOrderDate },
  { key: "monthlyRevenue", header: "Doanh so", render: (row) => formatMoney(row.monthlyRevenue), align: "right" },
  { key: "status", header: "Trang thai", render: (row) => <span className="badge">{getStatusLabel(row.status)}</span> }
];

export function AccountsPage() {
  return (
    <AppShell activeHref="/customers">
      <PageHeader
        eyebrow="Customers"
        title="Khach hang / diem ban"
        subtitle="Quan ly diem ban bang mock data truoc. Sau nay API/backend VPS tra dung contract la man hinh nay co the dung data that."
      >
        <span className="badge">Mock data</span>
      </PageHeader>

      <FilterBar
        filters={[
          { label: "Khu vuc", value: "Tat ca" },
          { label: "Hang diem ban", value: "A/B/C" },
          { label: "Trang thai", value: "Dang cham soc + Can ghe lai" }
        ]}
      />

      <section className="grid cards">
        {accountsMock.kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="hero-panel" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="panel-title">Danh sach diem ban</h2>
          <DataTable
            columns={accountColumns}
            rows={accountsMock.accounts}
            getRowKey={(row) => row.id}
            emptyMessage="Chua co diem ban"
          />
        </div>

        <div className="card">
          <h2 className="panel-title">Can chuan hoa</h2>
          <div className="grid">
            <div className="metric-row">
              <span>Can ghe lai</span>
              <strong>2</strong>
            </div>
            <div className="metric-row">
              <span>Thieu thong tin</span>
              <strong>1</strong>
            </div>
            <div className="metric-row">
              <span>Chua co don</span>
              <strong>3</strong>
            </div>
            <div className="metric-row">
              <span>Tier A</span>
              <strong>2</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="panel-title">Goi y cho module khach hang</h2>
        <div className="grid">
          <article className="action-card">
            <div>
              <span className="badge">Uu tien</span>
              <h3>Tap trung diem ban co tier cao nhung chua co don moi</h3>
              <p className="page-subtitle">
                Nhom nay nen duoc ghe lai truoc de kiem tra ton kho, doi thu va nhu cau dat them hang.
              </p>
            </div>
            <strong>Sale</strong>
          </article>
          <article className="action-card">
            <div>
              <span className="badge">Du lieu</span>
              <h3>Chuan hoa diem ban thieu thong tin</h3>
              <p className="page-subtitle">
                Day la buoc quan trong truoc khi lam route optimization, PWA check-in va mobile app.
              </p>
            </div>
            <strong>Admin</strong>
          </article>
        </div>
      </section>
    </AppShell>
  );
}
