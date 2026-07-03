import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";

export default function FieldChecksPage() {
  return (
    <AppShell activeHref="/field-checks">
      <PageHeader
        eyebrow="Module"
        title="Kiem tra thi truong"
        subtitle="Theo doi san pham test, doi thu, gia, nhu cau, co hoi va rui ro theo khu vuc."
      />
      <div className="card">
        <h2 className="panel-title">Dang dung UI shell</h2>
        <p className="page-subtitle">Buoc tiep theo se tao man hinh field check bang mock data.</p>
      </div>
    </AppShell>
  );
}
