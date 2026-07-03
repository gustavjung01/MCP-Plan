type SourceBadgeProps = {
  source: "api" | "mock";
};

export function SourceBadge({ source }: SourceBadgeProps) {
  return <span className="badge">{source === "api" ? "API that" : "Mock"}</span>;
}
