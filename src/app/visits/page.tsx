import { MCPPage } from "@/features/mcp/MCPPage";
import { createApiClient } from "@/lib/api/api-client";

export default async function Page() {
  const api = createApiClient();
  const [routesResult, dayResult, routeCustomersResult] = await Promise.all([
    api.getRoutesData(),
    api.getMcpDayData(),
    api.getRouteCustomersData()
  ]);

  return (
    <MCPPage
      activeHref="/visits"
      routesData={routesResult.data}
      mcpDayData={dayResult.data}
      routeCustomersData={routeCustomersResult.data}
    />
  );
}
