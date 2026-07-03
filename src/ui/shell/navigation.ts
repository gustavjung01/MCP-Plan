export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Tuyen ban hang", href: "/routes" },
  { label: "Luot ghe tham", href: "/visits" },
  { label: "Kiem tra thi truong", href: "/field-checks" },
  { label: "Don hang", href: "/orders" },
  { label: "MCP-Plan", href: "/plans" }
];
