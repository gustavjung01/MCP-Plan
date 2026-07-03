export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", description: "Tong quan NPP" },
  { label: "Tuyen ban hang", href: "/routes", description: "Route va diem ban" },
  { label: "Khach hang", href: "/customers", description: "Ho so diem ban" },
  { label: "Luot ghe tham", href: "/visits", description: "Cham soc thi truong" },
  { label: "Kiem tra thi truong", href: "/field-checks", description: "San pham va doi thu" },
  { label: "Don hang", href: "/orders", description: "Doanh so va SKU" },
  { label: "MCP-Plan", href: "/plans", description: "Ke hoach hanh dong" }
];
