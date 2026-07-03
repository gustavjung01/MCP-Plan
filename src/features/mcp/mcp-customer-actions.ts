export type McpCustomerAction = "order" | "test" | "market_report" | "follow_up";

export function mcpCustomerActionLabel(action: McpCustomerAction) {
  if (action === "order") return "Co don";
  if (action === "test") return "Co test";
  if (action === "market_report") return "Bao cao";
  return "Tao viec";
}

export function mcpCustomerActionDescription(action: McpCustomerAction) {
  if (action === "order") return "Tao don hang gan voi khach trong phien MCP.";
  if (action === "test") return "Ghi ket qua test san pham tai diem ban trong phien.";
  if (action === "market_report") return "Ghi doi thu, gia thi truong, nhu cau, co hoi hoac rui ro.";
  return "Tao viec theo doi gan voi session customer snapshot.";
}

export const MCP_CUSTOMER_ACTIONS: McpCustomerAction[] = ["order", "test", "market_report", "follow_up"];
