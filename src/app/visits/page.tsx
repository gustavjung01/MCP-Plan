import { PageHeader } from "@/ui/layout/PageHeader";
import { AppShell } from "@/ui/shell/AppShell";

export default function VisitsPage() {
  return (
    <AppShell activeHref="/visits">
      <PageHeader
        eyebrow="Module"
        title="Luot ghe tham"
        subtitle="Theo doi cham soc thi truong, check-in, ket qua visit va viec can xu ly sau moi luot ghe."
      />
      <div className="card">
        <h2 className="panel-title">Dang dung UI shell</h2>
        <p className="page-subtitle">Buoc tiep theo se tao visit timeline va bang visit bang mock data.</p>
      </div>
    </AppShell>
  );
}
