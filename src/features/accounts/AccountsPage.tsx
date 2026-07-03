import { accountsMock } from "./accounts.mock";
import { OutletsClientPage } from "./OutletsClientPage";

export function AccountsPage() {
  return <OutletsClientPage kpis={accountsMock.kpis} items={accountsMock.accounts} />;
}
