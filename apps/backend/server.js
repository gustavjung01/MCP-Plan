import http from "node:http";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3001);
const SERVICE = "mcp-plan-backend";

const routes = [
  { id: "route-cho-gao-center", name: "Tuyen Cho Gao trung tam", area: "Cho Gao", salesOwner: "Sale A", plannedCustomers: 18, visitedCustomers: 17, orderCount: 2, lastVisitDate: "2026-06-30", status: "active" },
  { id: "route-my-tho-east", name: "Tuyen My Tho phia Dong", area: "My Tho", salesOwner: "Sale B", plannedCustomers: 14, visitedCustomers: 11, orderCount: 0, lastVisitDate: "2026-06-30", status: "watch" },
  { id: "route-go-cong-river", name: "Tuyen Go Cong ven song", area: "Go Cong", salesOwner: "Sale C", plannedCustomers: 12, visitedCustomers: 7, orderCount: 0, lastVisitDate: "2026-06-29", status: "watch" },
  { id: "route-cai-be-new-agent", name: "Tuyen Cai Be dai ly moi", area: "Cai Be", salesOwner: "Sale A", plannedCustomers: 9, visitedCustomers: 9, orderCount: 1, lastVisitDate: "2026-06-30", status: "active" },
  { id: "route-maintenance", name: "Tuyen bao tri du lieu", area: "Tong hop", salesOwner: "Admin NPP", plannedCustomers: 0, visitedCustomers: 0, orderCount: 0, lastVisitDate: "-", status: "paused" }
];

const routeCustomers = [
  { id: "rc-001", routeId: "route-cho-gao-center", routeName: "Tuyen Cho Gao trung tam", accountId: "acc-cho-gao-001", accountName: "Tap hoa Minh Chau", contactName: "Chi Chau", area: "Cho Gao", sortOrder: 1, status: "active", gps: { lat: 10.35431, lng: 106.46412, accuracyMeters: 18, updatedAt: "2026-06-30" }, note: "Diem ban tier A, uu tien ghe dau tuyen." },
  { id: "rc-002", routeId: "route-cho-gao-center", routeName: "Tuyen Cho Gao trung tam", accountId: "acc-cho-gao-002", accountName: "Dai ly Thanh Phat", contactName: "Anh Phat", area: "Cho Gao", sortOrder: 2, status: "active", gps: { lat: 10.35911, lng: 106.47042, accuracyMeters: 22, updatedAt: "2026-06-30" }, note: "Co don thuong xuyen." },
  { id: "rc-003", routeId: "route-my-tho-east", routeName: "Tuyen My Tho phia Dong", accountId: "acc-my-tho-001", accountName: "Cua hang Huong Que", contactName: "Chi Huong", area: "My Tho", sortOrder: 3, status: "needs_gps", note: "Can cap nhat GPS khi ghe lai." },
  { id: "rc-004", routeId: "route-go-cong-river", routeName: "Tuyen Go Cong ven song", accountId: "acc-go-cong-001", accountName: "Tap hoa Ven Song", contactName: "Anh Nam", area: "Go Cong", sortOrder: 4, status: "active", gps: { lat: 10.36982, lng: 106.59877, accuracyMeters: 35, updatedAt: "2026-06-25" }, note: "Duong ven song, can mo Maps truoc khi di." },
  { id: "rc-005", routeId: "route-cai-be-new-agent", routeName: "Tuyen Cai Be dai ly moi", accountId: "acc-cai-be-001", accountName: "Dai ly Tan Loi", contactName: "Chi Loi", area: "Cai Be", sortOrder: 5, status: "active", gps: { lat: 10.33542, lng: 106.03252, accuracyMeters: 24, updatedAt: "2026-06-30" }, note: "Khach moi co tiem nang." },
  { id: "rc-006", routeId: "route-maintenance", routeName: "Tuyen bao tri du lieu", accountId: "acc-data-001", accountName: "Diem ban thieu thong tin", contactName: "Chua cap nhat", area: "Tong hop", sortOrder: 99, status: "hidden", note: "Tam an khoi tuyen ngay, khong hard delete." }
];

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": process.env.CORS_ORIGINS || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept"
  });
  res.end(body);
}

function wrap(data) {
  return {
    data,
    receivedAt: new Date().toISOString()
  };
}

function healthPayload() {
  return {
    ok: true,
    project: "MCP-Plan",
    service: SERVICE,
    server: "backend-DO-02",
    time: new Date().toISOString(),
    message: "MCP-Plan backend VPS is ready"
  };
}

function getDashboardSummary() {
  return {
    routeCount: 8,
    accountCount: 51,
    visitCount: 73,
    orderAmount: 403000,
    actionCount: 9
  };
}

function getDashboardOverview() {
  return {
    kpis: [
      { label: "Doanh so hom nay", value: "403K", hint: "Backend API", trend: "+12%" },
      { label: "Tuyen active", value: 8, hint: "Dang mo", trend: "On dinh" },
      { label: "Diem ban", value: 51, hint: "Trong tuyen", trend: "+4 can cham soc" },
      { label: "Luot ghe", value: 73, hint: "Da ghi nhan", trend: "72 hoan thanh" }
    ],
    routeHealth: [
      { routeName: "Tuyen trung tam", area: "Cho Gao", planned: 18, visited: 17, orders: 2, status: "good" },
      { routeName: "Tuyen phia Dong", area: "My Tho", planned: 14, visited: 11, orders: 0, status: "watch" },
      { routeName: "Tuyen ven song", area: "Go Cong", planned: 12, visited: 7, orders: 0, status: "risk" }
    ],
    actions: [
      { title: "Ghe lai nhom khach chua co don", description: "Uu tien diem ban da ghe nhung chua co order.", priority: "high", owner: "Sale" },
      { title: "Kiem tra tuyen ven song", description: "Ty le ghe thap hon ke hoach.", priority: "medium", owner: "Giam sat" }
    ],
    insights: [
      { label: "Ty le ghe tham", value: "88%" },
      { label: "Ty le co don", value: "2.7%" },
      { label: "SKU dang test", value: "33" },
      { label: "Nguon", value: "Backend API" }
    ]
  };
}

function getRoutesList() {
  return routes.map((route) => ({
    id: route.id,
    name: route.name,
    area: route.area,
    owner: route.salesOwner,
    active: route.status !== "paused"
  }));
}

function getRoutesData() {
  const totalCustomers = routes.reduce((sum, route) => sum + route.plannedCustomers, 0);
  const totalVisited = routes.reduce((sum, route) => sum + route.visitedCustomers, 0);
  const watchRoutes = routes.filter((route) => route.status === "watch").length;

  return {
    kpis: [
      { label: "Tuyen active", value: routes.filter((route) => route.status === "active").length, hint: "Backend API" },
      { label: "Tong diem ban", value: totalCustomers, hint: "Route master" },
      { label: "Da ghe", value: `${totalVisited}/${totalCustomers}`, hint: "Theo visit hien co" },
      { label: "Tuyen can theo doi", value: watchRoutes, hint: "Can xem lai lich ghe" }
    ],
    routes
  };
}

function getRouteCustomersData(url) {
  const routeId = url.searchParams.get("routeId");
  const customers = routeId ? routeCustomers.filter((customer) => customer.routeId === routeId) : routeCustomers;
  const withGps = customers.filter((customer) => Boolean(customer.gps)).length;
  const needsGps = customers.filter((customer) => customer.status === "needs_gps").length;
  const hidden = customers.filter((customer) => customer.status === "hidden").length;

  return {
    kpis: [
      { label: "Khach trong tuyen", value: customers.length, hint: routeId || "Tat ca tuyen" },
      { label: "Da co GPS", value: withGps, hint: "Mo duoc ban do" },
      { label: "Can GPS", value: needsGps, hint: "Can sale cap nhat" },
      { label: "Dang an", value: hidden, hint: "Khong hard delete" }
    ],
    customers
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  if (req.method !== "GET") {
    json(res, 405, {
      ok: false,
      service: SERVICE,
      error: "method_not_allowed",
      path: url.pathname
    });
    return;
  }

  if (url.pathname === "/" || url.pathname === "/health" || url.pathname === "/api/health") {
    json(res, 200, healthPayload());
    return;
  }

  if (url.pathname === "/api/dashboard/summary") {
    json(res, 200, wrap(getDashboardSummary()));
    return;
  }

  if (url.pathname === "/api/dashboard/overview") {
    json(res, 200, wrap(getDashboardOverview()));
    return;
  }

  if (url.pathname === "/api/routes") {
    json(res, 200, wrap(getRoutesList()));
    return;
  }

  if (url.pathname === "/api/routes/data") {
    json(res, 200, wrap(getRoutesData()));
    return;
  }

  if (url.pathname === "/api/routes/customers/data") {
    json(res, 200, wrap(getRouteCustomersData(url)));
    return;
  }

  json(res, 404, {
    ok: false,
    service: SERVICE,
    error: "not_found",
    path: url.pathname
  });
});

server.listen(PORT, HOST, () => {
  console.log(`${SERVICE} listening on http://${HOST}:${PORT}`);
});
