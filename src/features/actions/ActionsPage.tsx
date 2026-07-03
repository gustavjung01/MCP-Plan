import { actionsMock } from "./actions.mock";
import { ActionsClientPage } from "./ActionsClientPage";

export function ActionsPage() {
  return <ActionsClientPage kpis={actionsMock.kpis} items={actionsMock.items} />;
}
