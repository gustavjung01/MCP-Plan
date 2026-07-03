type SourceBadgeProps = {
  source: "api" | "mock";
};

export function SourceBadge({ source }: SourceBadgeProps) {
  return <span className={`source-badge source-${source}`}>{source === "api" ? "API thật" : "Mock"}</span>;
}
