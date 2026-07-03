"use client";

import { useState } from "react";
import { CompactKpiStrip } from "@/ui/cards/CompactKpiStrip";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { BottomSheet } from "@/ui/overlay/BottomSheet";
import { AppShell } from "@/ui/shell/AppShell";
import type { MarketReportItem, MarketReportKpi, MarketReportStatus, MarketReportType } from "./market-reports.types";
import styles from "./MarketReportsClientPage.module.css";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

function getStatusLabel(status: MarketReportStatus) {
  if (status === "opportunity") return "Co hoi";
  if (status === "risk") return "Rui ro";
  return "Binh thuong";
}

function getTypeLabel(type: MarketReportType) {
  if (type === "price") return "Gia";
  if (type === "competitor") return "Doi thu";
  if (type === "display") return "Trung bay";
  return "Ton kho";
}

function getStatusClass(status: MarketReportStatus) {
  if (status === "opportunity") return `${styles.status} ${styles.opportunity}`;
  if (status === "risk") return `${styles.status} ${styles.risk}`;
  return `${styles.status} ${styles.normal}`;
}

function ReportCard({ report, onSelect }: { report: MarketReportItem; onSelect: (report: MarketReportItem) => void }) {
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <div>
          <span>{getTypeLabel(report.reportType)} - {report.date}</span>
          <h3>{report.subject}</h3>
        </div>
        <strong className={getStatusClass(report.status)}>{getStatusLabel(report.status)}</strong>
      </div>

      <div className={styles.context}>
        <b>{report.accountName}</b>
        <small>{report.routeName} - {report.note}</small>
      </div>

      <div className={styles.metrics}>
        <span><b>{report.price ? money.format(report.price) : "-"}</b><small>Gia</small></span>
        <span><b>{report.competitorName || "-"}</b><small>Doi thu</small></span>
        <span><b>{report.nextAction}</b><small>Viec tiep</small></span>
      </div>

      <div className={styles.actions}>
        <button className="button primary" type="button" onClick={() => onSelect(report)}>Xem</button>
        <button className="button" type="button">Anh</button>
        <button className="button" type="button">Viec</button>
      </div>
    </article>
  );
}

function ReportSheet({ report, onClose }: { report: MarketReportItem | null; onClose: () => void }) {
  return (
    <BottomSheet
      open={Boolean(report)}
      onClose={onClose}
      title={report ? report.subject : "Chi tiet bao cao"}
      description={report ? `${report.accountName} - ${report.routeName}` : undefined}
      footer={<div className="sheet-action-grid"><button className="button primary" type="button">Tao viec xu ly</button><button className="button" type="button" onClick={onClose}>Dong</button></div>}
    >
      {report ? (
        <div className="field-sheet-content">
          <div className="field-focus-card"><span>Danh gia</span><strong>{getStatusLabel(report.status)}</strong><small>{report.note}</small></div>
          <div className="grid">
            <div className="metric-row"><span>Loai</span><strong>{getTypeLabel(report.reportType)}</strong></div>
            <div className="metric-row"><span>Doi thu</span><strong>{report.competitorName || "-"}</strong></div>
            <div className="metric-row"><span>Gia</span><strong>{report.price ? money.format(report.price) : "-"}</strong></div>
            <div className="metric-row"><span>Ngay</span><strong>{report.date}</strong></div>
          </div>
          <div className="sheet-note-card"><h3>Huong xu ly</h3><p>{report.nextAction}</p></div>
        </div>
      ) : null}
    </BottomSheet>
  );
}

export function MarketReportsClientPage({ kpis, reports }: { kpis: MarketReportKpi[]; reports: MarketReportItem[] }) {
  const [selectedReport, setSelectedReport] = useState<MarketReportItem | null>(null);
  const needAction = reports.filter((report) => report.status !== "normal").length;

  return (
    <AppShell activeHref="/reports">
      <PageHeader eyebrow="Market Reports" title="Bao cao thi truong" subtitle="Ghi nhan gia, doi thu, trung bay, ton kho va viec can xu ly ngoai thi truong."><span className="badge">{needAction} can xu ly</span></PageHeader>
      <FilterBar filters={[{ label: "Ngay", value: "Gan nhat" }, { label: "Tuyen", value: "Tat ca" }, { label: "Loai", value: "Tat ca" }]} />
      <CompactKpiStrip items={kpis} />

      <div className={styles.templateGrid}>
        <span>Gia</span>
        <span>Doi thu</span>
        <span>Trung bay</span>
        <span>Ton kho</span>
      </div>

      <section className={styles.section}>
        <div className="dashboard-section-head"><h2>Bao cao moi</h2><span>{reports.length} dong</span></div>
        <div className={styles.list}>{reports.map((report) => <ReportCard key={report.id} report={report} onSelect={setSelectedReport} />)}</div>
      </section>

      <ReportSheet report={selectedReport} onClose={() => setSelectedReport(null)} />
    </AppShell>
  );
}
