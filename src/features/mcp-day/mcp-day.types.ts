export type DayRunStatus = "opened" | "completed" | "cancelled";

export type DayLineSource = "planned" | "added" | "synced";

export type DayLineStatus = "pending" | "visited" | "skipped" | "cancelled";

export type McpDayRun = {
  id: string;
  routeName: string;
  date: string;
  owner: string;
  status: DayRunStatus;
  openedAt: string;
};

export type McpDayLine = {
  id: string;
  sortOrder: number;
  accountName: string;
  area: string;
  source: DayLineSource;
  status: DayLineStatus;
  note: string;
  result?: string;
  hasOrder: boolean;
};

export type McpDayResult = {
  id: string;
  lineId: string;
  accountName: string;
  startTime: string;
  endTime: string;
  result: string;
  hasOrder: boolean;
  nextAction: string;
};

export type McpDayKpi = {
  label: string;
  value: string | number;
  hint: string;
};

export type McpDayData = {
  run: McpDayRun;
  kpis: McpDayKpi[];
  lines: McpDayLine[];
  results: McpDayResult[];
};
