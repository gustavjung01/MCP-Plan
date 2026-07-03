import { createApiClient } from "@/lib/api/api-client";
import type { DashboardActionDto, DashboardRouteHealthDto } from "@/lib/api/api.types";
import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";

function getStatusLabel(status: "good" | "watch" | "risk") {
  if (status === "good") return "Ổn";
  if (status === "watch") return "Theo dõi";
  return "Rủi ro";
}

function getPriorityLabel(priority: "high" | "medium" | "low") {
  if (priority === "high") return "Cao";
  if (priority === "medium") return "Vừa";
  return "Thấp";
}

function getStatusClass(status: "good" | "watch" | "risk") {
  if (status === "good") return "status-good";
  if (status === "watch") return "status-watch";
  return "status-risk";
}

function renderRouteCard(route: DashboardRouteHealthDto) {
  const visitRate = route.planned > 0 ? Math.round((route.visited / route.planned) * 100) : 0;

  return (
    <article className="dashboard-route-card" key={route.routeName}>
      <div className="dashboard-route-head">
        <div>
          <h3>{route.routeName}</h3>
          <small>{route.area}</small>
        </div>
        <span className={`dashboard-status ${getStatusClass(route.status)}`}>{getStatusLabel(route.status)}</span>
      </div>
      <div className="dashboard-route-progress" aria-label={`Tiến độ ghé ${visitRate}%`}>
        <span style={{ width: `${Math.min(visitRate, 100)}%` }} />
      </div>
      <div className="dashboard-route-metrics">
        <span>
          <b>{route.visited}/{route.planned}</b>
          <small>Đã ghé</small>
        </span>
        <span>
          <b>{visitRate}%</b>
          <small>Tiến độ</small>
        </span>
        <span>
          <b>{route.orders}</b>
          <small>Đơn</small>
        </span>
      </div>
    </article>
  );
}

function renderAction(action: DashboardActionDto) {
  return (
    <article className="action-card dashboard-action-card" key={action.title}>
      <div>
        <span className={`dashboard-priority priority-${action.priority}`}>Ưu tiên {getPriorityLabel(action.priority)}</span>
        <h3>{action.title}</h3>
        <p>{action.description}</p>
      </div>
      <strong>{action.owner}</strong>
    </article>
  );
}

export async function DashboardPage() {
  const api = createApiClient();
  const dashboardResult = await api.getDashboardOverview();
  const dashboard = dashboardResult.data;
  const primaryKpi = dashboard.kpis[0];
  const totalRoutes = dashboard.routeHealth.length;
  const riskRoutes = dashboard.routeHealth.filter((route) => route.status === "risk").length;
  const watchRoutes = dashboard.routeHealth.filter((route) => route.status === "watch").length;
  const totalOrders = dashboard.routeHealth.reduce((sum, route) => sum + route.orders, 0);

  return (
    <AppShell activeHref="/">
      <PageHeader
        eyebrow="Dashboard"
        title="Hôm nay"
        subtitle="Tuyến, đơn, điểm cần xử lý và tình trạng vận hành trong ngày."
      >
        <span className="badge">{dashboardResult.source === "api" ? "API thật" : "Mock"}</span>
      </PageHeader>

      <section className="dashboard-today-card">
        <div className="dashboard-today-main">
          <span>Tổng quan nhanh</span>
          <h2>{primaryKpi?.value ?? "-"}</h2>
          <p>{primaryKpi ? `${primaryKpi.label} · ${primaryKpi.hint}` : "Đang chờ dữ liệu"}</p>
        </div>
        <div className="dashboard-today-pills" aria-label="Tóm tắt vận hành">
          <strong>{totalRoutes} tuyến</strong>
          <strong>{totalOrders} đơn</strong>
          <strong>{riskRoutes + watchRoutes} cần xem</strong>
        </div>
      </section>

      <FilterBar
        title="Lọc nhanh"
        filters={[
          { label: "Kỳ", value: "Hôm nay" },
          { label: "Tuyến", value: "Tất cả" },
          { label: "Trạng thái", value: "Đang theo dõi" }
        ]}
      />

      <section className="dashboard-kpi-strip" aria-label="Chỉ số nhanh">
        {dashboard.kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.trend} />
        ))}
      </section>

      <section className="dashboard-section dashboard-actions-section">
        <div className="dashboard-section-head">
          <h2>Cần xử lý</h2>
          <span>{dashboard.actions.length} việc</span>
        </div>
        <div className="dashboard-action-list">{dashboard.actions.map(renderAction)}</div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <h2>Sức khỏe tuyến</h2>
          <span>{riskRoutes} rủi ro · {watchRoutes} theo dõi</span>
        </div>
        <div className="dashboard-route-list">{dashboard.routeHealth.map(renderRouteCard)}</div>
      </section>

      <section className="dashboard-insight-strip" aria-label="Chỉ số phụ">
        {dashboard.insights.map((item) => (
          <div className="metric-row" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
