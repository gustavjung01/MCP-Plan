"use client";

import { useMemo, useState } from "react";
import { CompactKpiStrip } from "@/ui/cards/CompactKpiStrip";
import { TodaySummaryCard } from "@/ui/cards/TodaySummaryCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { StatusChipBar } from "@/ui/layout/StatusChipBar";
import { BottomSheet } from "@/ui/overlay/BottomSheet";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import type { DayLineSource, DayLineStatus, McpDayData, McpDayLine, McpDayResult } from "./mcp-day.types";

function getSourceLabel(source: DayLineSource) {
  if (source === "planned") return "Tuyen goc";
  if (source === "added") return "Phat sinh";
  return "Dong bo";
}

function getStatusLabel(status: DayLineStatus) {
  if (status === "pending") return "Cho ghe";
  if (status === "visited") return "Da ghe";
  if (status === "skipped") return "Bo qua";
  return "Huy";
}

function getStatusClass(status: DayLineStatus) {
  if (status === "visited") return "mcp-line-status visited";
  if (status === "pending") return "mcp-line-status pending";
  if (status === "skipped") return "mcp-line-status skipped";
  return "mcp-line-status cancelled";
}

const resultColumns: DataTableColumn<McpDayResult>[] = [
  { key: "accountName", header: "Diem ban", render: (row) => row.accountName },
  { key: "startTime", header: "Bat dau", render: (row) => row.startTime },
  { key: "endTime", header: "Ket thuc", render: (row) => row.endTime },
  { key: "result", header: "Ket qua", render: (row) => row.result },
  { key: "hasOrder", header: "Don", render: (row) => (row.hasOrder ? "Co" : "Khong"), align: "center" },
  { key: "nextAction", header: "Viec tiep", render: (row) => row.nextAction }
];

function McpCustomerCard({ line, onSelect }: { line: McpDayLine; onSelect: (line: McpDayLine) => void }) {
  return (
    <article className="mcp-line-card">
      <div className="mcp-line-order">#{line.sortOrder}</div>

      <div className="mcp-line-main">
        <div className="mcp-line-head">
          <div>
            <h3>{line.accountName}</h3>
            <small>{line.area} - {getSourceLabel(line.source)}</small>
          </div>
          <span className={getStatusClass(line.status)}>{getStatusLabel(line.status)}</span>
        </div>

        <div className="mcp-line-meta">
          <span>{line.hasOrder ? "Co don" : "Chua co don"}</span>
          <span>{line.result ?? "Chua ghi ket qua"}</span>
        </div>
      </div>

      <div className="mcp-line-actions" aria-label={`Thao tac ${line.accountName}`}>
        <button className="button primary" type="button" onClick={() => onSelect(line)}>Xu ly</button>
        <button className="button" type="button">Don</button>
        <button className="button" type="button">Test</button>
        <button className="button" type="button">BC</button>
        <button className="button" type="button">Viec</button>
      </div>
    </article>
  );
}

function VisitSheet({ line, onClose }: { line: McpDayLine | null; onClose: () => void }) {
  return (
    <BottomSheet
      open={Boolean(line)}
      onClose={onClose}
      title={line ? line.accountName : "Xu ly diem ban"}
      description={line ? `${line.area} - ${getSourceLabel(line.source)}` : undefined}
      footer={
        <div className="sheet-action-grid">
          <button className="button primary" type="button">Bat dau check-in</button>
          <button className="button" type="button">Ghi ket qua ghe</button>
          <button className="button" type="button">Bo qua co ly do</button>
          <button className="button" type="button" onClick={onClose}>Dong</button>
        </div>
      }
    >
      {line ? (
        <div className="visit-sheet-content">
          <div className="visit-focus-card">
            <span>Trang thai</span>
            <strong>{getStatusLabel(line.status)}</strong>
            <small>{line.hasOrder ? "Da co don" : "Chua co don"}</small>
          </div>

          <div className="grid">
            <div className="metric-row"><span>Thu tu ghe</span><strong>{line.sortOrder}</strong></div>
            <div className="metric-row"><span>Nguon</span><strong>{getSourceLabel(line.source)}</strong></div>
            <div className="metric-row"><span>Ket qua</span><strong>{line.result ?? "Chua ghi"}</strong></div>
            <div className="metric-row"><span>Ghi chu</span><strong>{line.note}</strong></div>
          </div>

          <div className="sheet-note-card">
            <h3>Logic MCP</h3>
            <p>Popup nay xu ly snapshot khach trong phien ngay. Thay doi o day khong tu dong sua tuyen goc neu chua co buoc dong bo rieng.</p>
          </div>
        </div>
      ) : null}
    </BottomSheet>
  );
}

export function McpDayClientPage({ data }: { data: McpDayData }) {
  const [selectedLine, setSelectedLine] = useState<McpDayLine | null>(null);
  const run = data.run;
  const statusFilters = useMemo(() => {
    const counts = data.lines.reduce(
      (acc, line) => {
        acc.all += 1;
        acc[line.status] += 1;
        return acc;
      },
      { all: 0, pending: 0, visited: 0, skipped: 0, cancelled: 0 } as Record<DayLineStatus | "all", number>
    );

    return [
      { label: "Tat ca", value: counts.all },
      { label: "Cho ghe", value: counts.pending },
      { label: "Da ghe", value: counts.visited },
      { label: "Bo qua", value: counts.skipped },
      { label: "Huy", value: counts.cancelled }
    ];
  }, [data.lines]);

  return (
    <AppShell activeHref="/visits">
      <PageHeader
        eyebrow="MCP Daily Session"
        title="Phien MCP ngay"
        subtitle="Xu ly nhanh khach trong phien: ghe, don, test, bao cao va viec tiep theo."
      >
        <span className="badge">{run.status}</span>
      </PageHeader>

      <TodaySummaryCard
        eyebrow="Phien dang mo"
        value={run.routeName}
        description={`${run.date} - ${run.owner} - Mo luc ${run.openedAt}`}
        pills={[{ label: "khach", value: data.lines.length }]}
        tone="teal"
      />

      <FilterBar
        filters={[
          { label: "Ngay", value: run.date },
          { label: "Tuyen", value: run.routeName },
          { label: "Sale", value: run.owner }
        ]}
      />

      <CompactKpiStrip className="mcp-day-kpis" items={data.kpis.map((item) => ({ label: item.label, value: item.value, hint: item.hint }))} />

      <section className="mcp-lines-section">
        <div className="dashboard-section-head">
          <h2>Khach trong tuyen</h2>
          <span>{data.lines.length} diem ban</span>
        </div>

        <StatusChipBar ariaLabel="Loc trang thai khach" chips={statusFilters} />

        <div className="mcp-line-list">
          {data.lines.map((line) => (
            <McpCustomerCard key={line.id} line={line} onSelect={setSelectedLine} />
          ))}
        </div>
      </section>

      <section className="card mcp-results-card">
        <h2 className="panel-title">Ket qua da ghe</h2>
        <DataTable columns={resultColumns} rows={data.results} getRowKey={(row) => row.id} />
      </section>

      <VisitSheet line={selectedLine} onClose={() => setSelectedLine(null)} />
    </AppShell>
  );
}
