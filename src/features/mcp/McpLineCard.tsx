import type { McpDayLine } from "@/features/mcp-day/mcp-day.types";
import { OperationalListCard } from "@/ui/cards/OperationalListCard";
import { type McpCustomerAction } from "./mcp-customer-actions";

function sourceLabel(source: McpDayLine["source"]) {
  if (source === "planned") return "Tuyến gốc";
  if (source === "added") return "Phát sinh";
  return "Đồng bộ";
}

function statusLabel(status: McpDayLine["status"]) {
  if (status === "pending") return "Chờ ghé";
  if (status === "visited") return "Đã ghé";
  if (status === "skipped") return "Bỏ qua";
  return "Hủy";
}

function statusClass(status: McpDayLine["status"]) {
  if (status === "visited") return "mcp-line-status visited";
  if (status === "pending") return "mcp-line-status pending";
  if (status === "skipped") return "mcp-line-status skipped";
  return "mcp-line-status cancelled";
}

export function McpLineCard({
  line,
  onOpen,
  onAction
}: {
  line: McpDayLine;
  onOpen: (line: McpDayLine) => void;
  onAction: (line: McpDayLine, action: McpCustomerAction) => void;
}) {
  return (
    <OperationalListCard
      leading={<span>#{line.sortOrder}</span>}
      eyebrow={`${line.area} · ${sourceLabel(line.source)}`}
      title={line.accountName}
      description={line.note}
      badge={<span className={statusClass(line.status)}>{statusLabel(line.status)}</span>}
      meta={[line.hasOrder ? "Có đơn" : "Chưa có đơn", line.result ?? "Chưa ghi kết quả"]}
      actions={[
        { label: "Xử lý", tone: "primary", onClick: () => onOpen(line) },
        { label: "Đơn", onClick: () => onAction(line, "order") },
        { label: "Test", onClick: () => onAction(line, "test") },
        { label: "Việc", onClick: () => onAction(line, "follow_up") }
      ]}
    />
  );
}
