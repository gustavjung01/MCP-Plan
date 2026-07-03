"use client";

import { useMemo, useState } from "react";
import { CompactKpiStrip } from "@/ui/cards/CompactKpiStrip";
import { OperationalListCard } from "@/ui/cards/OperationalListCard";
import { FilterBar } from "@/ui/layout/FilterBar";
import { PageHeader } from "@/ui/layout/PageHeader";
import { BottomSheet } from "@/ui/overlay/BottomSheet";
import { AppShell } from "@/ui/shell/AppShell";
import type { MarketCheckItem, MarketCheckKpi, MarketCheckStatus } from "./market-checks.types";
import styles from "./MarketChecksClientPage.module.css";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

function getStatusLabel(status: MarketCheckStatus) {
  if (status === "opportunity") return "Cơ hội";
  if (status === "risk") return "Rủi ro";
  return "Bình thường";
}

function getStatusClass(status: MarketCheckStatus) {
  if (status === "opportunity") return `${styles.status} ${styles.opportunity}`;
  if (status === "risk") return `${styles.status} ${styles.risk}`;
  return `${styles.status} ${styles.normal}`;
}

function buildSetupMetrics(checks: MarketCheckItem[]) {
  const products = new Set(checks.map((check) => check.productName)).size;
  const accounts = new Set(checks.map((check) => check.accountName)).size;
  const pending = checks.filter((check) => check.status === "normal").length;
  return { products, accounts, pending };
}

function TestResultCard({ check, onSelect }: { check: MarketCheckItem; onSelect: (check: MarketCheckItem) => void }) {
  return (
    <OperationalListCard
      leading={<span>{check.stockStatus.slice(0, 2).toUpperCase()}</span>}
      eyebrow={`${check.date} · ${check.routeName}`}
      title={check.productName}
      description={check.accountName}
      badge={<strong className={getStatusClass(check.status)}>{getStatusLabel(check.status)}</strong>}
      meta={[money.format(check.shelfPrice), check.competitorName, check.note]}
      actions={[
        { label: "Nhập", tone: "primary", onClick: () => onSelect(check) },
        { label: "Việc" }
      ]}
    />
  );
}

function FieldCheckSheet({ check, onClose }: { check: MarketCheckItem | null; onClose: () => void }) {
  return (
    <BottomSheet
      open={Boolean(check)}
      onClose={onClose}
      title={check ? check.productName : "Chi tiết kiểm tra"}
      description={check ? `${check.accountName} · ${check.routeName}` : undefined}
      footer={<div className="sheet-action-grid"><button className="button primary" type="button">Tạo việc xử lý</button><button className="button" type="button" onClick={onClose}>Đóng</button></div>}
    >
      {check ? (
        <div className="field-sheet-content">
          <div className="field-focus-card"><span>Đánh giá</span><strong>{getStatusLabel(check.status)}</strong><small>{check.note}</small></div>
          <div className="grid">
            <div className="metric-row"><span>Giá kệ</span><strong>{money.format(check.shelfPrice)}</strong></div>
            <div className="metric-row"><span>Đối thủ</span><strong>{check.competitorName}</strong></div>
            <div className="metric-row"><span>Tồn kho</span><strong>{check.stockStatus}</strong></div>
            <div className="metric-row"><span>Ngày</span><strong>{check.date}</strong></div>
          </div>
          <div className="sheet-note-card"><h3>Nhập kết quả</h3><p>Cập nhật giá kệ, tồn kho, đối thủ và tạo việc nếu phát hiện cơ hội hoặc rủi ro.</p></div>
        </div>
      ) : null}
    </BottomSheet>
  );
}

export function MarketChecksClientPage({ kpis, checks }: { kpis: MarketCheckKpi[]; checks: MarketCheckItem[] }) {
  const [selectedCheck, setSelectedCheck] = useState<MarketCheckItem | null>(null);
  const setup = useMemo(() => buildSetupMetrics(checks), [checks]);
  const needAction = checks.filter((check) => check.status !== "normal").length;

  return (
    <AppShell activeHref="/field-checks">
      <PageHeader eyebrow="Product Test" title="Test sản phẩm" subtitle="Tách riêng file test, điểm bán cần nhập kết quả và việc cần xử lý."><span className="badge">Đang theo dõi</span></PageHeader>
      <FilterBar filters={[{ label: "Ngày", value: "Gần nhất" }, { label: "Tuyến", value: "Tất cả" }, { label: "Đánh giá", value: "Tất cả" }]} />

      <section className={styles.setupGrid}>
        <div className={styles.setupCard}>
          <span>File setup</span>
          <h2>Đợt test sản phẩm</h2>
          <p>Quản lý sản phẩm test, điểm bán được gán và trạng thái nhập kết quả.</p>
          <div className={styles.setupMetrics}>
            <strong><b>{setup.products}</b><small>Sản phẩm</small></strong>
            <strong><b>{setup.accounts}</b><small>Điểm bán</small></strong>
            <strong><b>{setup.pending}</b><small>Chờ nhập</small></strong>
          </div>
        </div>

        <div className={styles.setupCard}>
          <span>Nhập kết quả</span>
          <h2>{needAction} cần xử lý</h2>
          <p>Ưu tiên các kết quả có cơ hội hoặc rủi ro để tạo việc cho sale/giám sát.</p>
        </div>
      </section>

      <CompactKpiStrip items={kpis} />

      <section className={styles.section}>
        <div className="dashboard-section-head"><h2>Kết quả theo điểm bán</h2><span>{checks.length} dòng</span></div>
        <div className={styles.list}>{checks.map((check) => <TestResultCard key={check.id} check={check} onSelect={setSelectedCheck} />)}</div>
      </section>

      <section className={`card ${styles.nextCard}`}><h2 className="panel-title">Điểm cần theo dõi</h2><div className="grid"><div className="metric-row"><span>Giá</span><strong>Cập nhật</strong></div><div className="metric-row"><span>Đối thủ</span><strong>Theo dõi</strong></div><div className="metric-row"><span>Việc cần làm</span><strong>Xử lý</strong></div></div></section>

      <FieldCheckSheet check={selectedCheck} onClose={() => setSelectedCheck(null)} />
    </AppShell>
  );
}
