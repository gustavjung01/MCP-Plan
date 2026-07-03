export type NavItem = {
  label: string;
  shortLabel: string;
  href: string;
  description: string;
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", shortLabel: "Tong quan", href: "/", description: "Tong quan NPP", icon: "⌂" },
  { label: "Tuyen ban hang", shortLabel: "Tuyen", href: "/routes", description: "Route va diem ban", icon: "◎" },
  { label: "Khach hang", shortLabel: "Khach", href: "/customers", description: "Ho so diem ban", icon: "□" },
  { label: "Luot ghe tham", shortLabel: "MCP", href: "/visits", description: "Cham soc thi truong", icon: "◇" },
  { label: "Kiem tra thi truong", shortLabel: "Check", href: "/field-checks", description: "San pham va doi thu", icon: "◌" },
  { label: "Don hang", shortLabel: "Don", href: "/orders", description: "Doanh so va SKU", icon: "＋" },
  { label: "MCP-Plan", shortLabel: "Plan", href: "/plans", description: "Ke hoach hanh dong", icon: "✓" }
];
