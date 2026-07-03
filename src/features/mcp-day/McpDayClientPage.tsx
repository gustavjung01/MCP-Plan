"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/ui/cards/KpiCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { BottomSheet } from "@/ui/overlay/BottomSheet";
import { AppShell } from "@/ui/shell/AppShell";
import { DataTable, type DataTableColumn } from "@/ui/table/DataTable";
import type { DayLineSource, DayLineStatus, McpDayData, McpDayLine, McpDayResult } from "./mcp-day.types";

function getSourceLabel(source: DayLineSource) {
  if (source === "planned") return "Tuyến gốc";
  if (source === "added") return "Phát sinh";
  return "Đồng bộ";
}

function getStatusLabel(status: DayLineStatus) {
  if (status === "pending") return "Chờ ghé";
  if (status === "visited") return "Đã ghé";
  if (status === "skipped") return "Bỏ qua";
  return "Hủy";
}

function getStatusClass(status: DayLineStatus) {
  if (status === "visited") return "mcp-line-status visited";
  if (status === "pending") return "mcp-line-status pending";
  if (status === "skipped") return "mcp-line-status skipped";
  return "mcp-line-status cancelled";
}

const resultColumns: DataTableColumn<McpDayResult>[] = [
  { key: "accountName", header: "Điểm bán", render: (row) => row.accountName },
  { key: "startTime", header: "Bắt đầu", render: (row) => row.startTime },
  { key: "endTime", header: "Kết thúc", render: (row) => row.endTime },
  { key: "result", header: "Kết quả", render: (row) => row.result },
  { key: "hasOrder", header: "Đơn", render: (row) => (row.hasOrder ? "Có" : "Không"), align: "center" },
  { key: "nextAction", header: "Việc tiếp", render: (row) => row.nextAction }
];

function McpCustomerCard({ line, onSelect }: { line: McpDayLine; onSelect: (line: McpDayLine) => void }) {
  return (
    <article className="mcp-line-card">
      <div className="mcp-line-order">#{line.sortOrder}</div>

      <div className="mcp-line-main">
        <div className="mcp-line-head">
          <div>
            <h3>{line.accountName}</h3>
            <small>{line.area} · {getSourceLabel(line.source)}</small>
          </div>
          <span className={getStatusClass(line.status)}>{getStatusLabel(line.status)}</span>
        </div>

        <div className="mcp-line-meta">
          <span>{line.hasOrder ? "Có đơn" : "Chưa có đơn"}</span>
          <span>{line.result ?? "Chưa ghi kết quả"}</span>
        </div>
      </div>

      <div className="mcp-line-actions" aria-label={`Thao tác ${line.accountName}`}>
        <button className="button primary" type="button" onClick={() => onSelect(line)}>Xử lý</button>
        <button className="button" type="button">Đơn</button>
        <button className="button" type="button">Test</button>
        <button className="button" type="button">BC</button>
        <button className="button" type="button">Việc</button>
      </div>
    </article>
  );
}

function VisitSheet({ line, onClose }: { line: McpDayLine | null; onClose: () => void }) {
  return (
    <BottomSheet
      open={Boolean(line)}
      onClose={onClose}
      title={line ? line.accountName : "Xử lý điểm bán"}
      description={line ? `${line.area} · ${getSourceLabel(line.source)}` : undefined}
      footer={
        <div className="sheet-action-grid">
          <button className="button primary" type="button">Bắt đầu check-in</button>
          <button className="button" type="button">Ghi kết quả ghé</button>
          <button className="button" type="button">Bỏ qua có lý do</button>
          <button className="button" type="button" onClick={onClose}>Đóng</button>
        </div>
      }
    >
      {line ? (
        <div className="visit-sheet-content">
          <div className="visit-focus-card">
            <span>Trạng thái</span>
            <strong>{getStatusLabel(line.status)}</strong>
            <small>{line.hasOrder ? "Đã có đơn" : "Chưa có đơn"}</small>
          </div>

          <div className="grid">
            <div className="metric-row"><span>Thứ tự ghé</span><strong>{line.sortOrder}</strong></div>
            <div className="metric-row"><span>Nguồn</span><strong>{getSourceLabel(line.source)}</strong></div>
            <div className="metric-row"><span>Kết quả</span><strong>{line.result ?? "Chưa ghi"}</strong></div>
            <div className="metric-row"><span>Ghi chú</span><strong>{line.note}</strong></div>
          </div>

          <div className="sheet-note-card">
            <h3>Logic MCP</h3>
            <p>Popup này xử lý snapshot khách trong phiên ngày. Thay đổi ở đây không tự động sửa tuyến gốc nếu chưa có bước đồng bộ riêng.</p>
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
      { label: "Tất cả", value: counts.all },
      { label: "Chờ ghé", value: counts.pending },
      { label: "Đã ghé", value: counts.visited },
      { label: "Bỏ qua", value: counts.skipped },
      { label: "Hủy", value: counts.cancelled }
    ];
  }, [data.lines]);

  return (
    <AppShell activeHref="/visits">
      <PageHeader
        eyebrow="MCP Daily Session"
        title="Phiên MCP ngày"
        subtitle="Xử lý nhanh khách trong phiên: ghé, đơn, test, báo cáo và việc tiếp theo."
      >
        <span className="badge">{run.status}</span>
      </PageHeader>

      <section className="mcp-session-hero">
        <div>
          <span>Phiên đang mở</span>
          <h2>{run.routeName}</h2>
          <p>{run.date} · {run.owner} · Mở lúc {run.openedAt}</p>
        </div>
        <strong>{data.lines.length} khách</strong>
      </section>

      <FilterBar
        filters={[
          { label: "Ngày", value: run.date },
          { label: "Tuyến", value: run.routeName },
          { label: "Sale", value: run.owner }
        ]}
      />

      <section className="grid cards mcp-day-kpis">
        {data.kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="mcp-lines-section">
        <div className="dashboard-section-head">
          <h2>Khách trong tuyến</h2>
          <span>{data.lines.length} điểm bán</span>
        </div>

        <div className="mcp-status-chips" aria-label="Lọc trạng thái khách">
          {statusFilters.map((item, index) => (
            <button className={index === 0 ? "active" : undefined} key={item.label} type="button">
              {item.label} <b>{item.value}</b>
            </button>
          ))}
        </div>

        <div className="mcp-line-list">
          {data.lines.map((line) => (
            <McpCustomerCard key={line.id} line={line} onSelect={setSelectedLine} />
          ))}
        </div>
      </section>

      <section className="card mcp-results-card">
        <h2 className="panel-title">Kết quả đã ghé</h2>
        <DataTable columns={resultColumns} rows={data.results} getRowKey={(row) => row.id} />
      </section>

      <VisitSheet line={selectedLine} onClose={() => setSelectedLine(null)} />
    </AppShell>
  );
}
