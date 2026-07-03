import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";
import { InstallAppCard } from "./InstallAppCard";

export function SettingsPage() {
  return (
    <AppShell activeHref="/settings">
      <PageHeader
        eyebrow="Settings"
        title="Cai dat app"
        subtitle="Quan ly cai dat ung dung, cai app len thiet bi va lam moi phien ban khi can."
      >
        <span className="badge">PWA</span>
      </PageHeader>

      <section className="settings-grid">
        <InstallAppCard />

        <div className="card settings-card">
          <div>
            <span className="badge">He thong</span>
            <h2 className="panel-title">Thong tin phien ban</h2>
            <p className="page-subtitle">MCP-Plan dang san sang cho quy trinh tuyen ban hang, cham soc diem ban va theo doi cong viec hang ngay.</p>
          </div>

          <div className="grid">
            <div className="metric-row"><span>Che do</span><strong>San sang su dung</strong></div>
            <div className="metric-row"><span>Mobile</span><strong>Ho tro PWA</strong></div>
            <div className="metric-row"><span>Cap nhat</span><strong>Lam moi nhanh</strong></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
