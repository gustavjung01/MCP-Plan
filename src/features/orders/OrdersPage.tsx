import { createApiClient } from "@/lib/api/api-client";
import { OrdersClientPage } from "./OrdersClientPage";

export async function OrdersPage() {
  const api = createApiClient();
  const ordersResult = await api.listOrders();

  return <OrdersClientPage ordersResult={ordersResult} />;
}
