import type { UrgencyLevel } from "@/features/deadlines/format";

const RING_COLOR: Record<UrgencyLevel, string> = {
  overdue: "var(--u-overdue)",
  today: "var(--u-today)",
  soon: "var(--u-soon)",
  normal: "var(--u-normal)",
};

const R = 22;
const CIRC = 2 * Math.PI * R;

function daysLeft(iso: string): number {
  return (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
}

export function UrgencyRing({
  iso,
  urgency,
}: {
  iso: string;
  urgency: UrgencyLevel;
}) {
  const days = daysLeft(iso);
  const isOverdue = urgency === "overdue";

  const ratio = isOverdue ? 1 : Math.min(1, Math.max(0, (14 - days) / 14));
  const offset = CIRC * (1 - ratio);

  const label = isOverdue ? "!" : String(Math.ceil(Math.max(0, days)));
  const color = RING_COLOR[urgency];

  return (
    <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center">
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke="rgba(15,13,26,0.06)"
          strokeWidth="4"
        />
        <circle
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ animation: "ring-fill 1s ease both" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color }}
      >
        <span className="font-mono text-sm font-bold leading-none tabular-nums">
          {label}
        </span>
        {!isOverdue && (
          <span className="text-[9px] leading-none opacity-70">日</span>
        )}
      </div>
    </div>
  );
}
