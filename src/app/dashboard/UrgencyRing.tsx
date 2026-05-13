import type { UrgencyLevel } from "@/features/deadlines/format";

const RING_COLOR: Record<UrgencyLevel, string> = {
  overdue: "var(--u-overdue)",
  today: "var(--u-today)",
  soon: "var(--u-soon)",
  normal: "var(--u-normal)",
};

const R = 22;
const CIRC = 2 * Math.PI * R;

function countdownParts(iso: string): { num: string; unit: string } {
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs <= 0) return { num: "!", unit: "OVER" };
  const hours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return { num: String(days), unit: "DAY" };
  return { num: String(Math.ceil(hours)), unit: "HR" };
}

export function UrgencyRing({
  iso,
  urgency,
}: {
  iso: string;
  urgency: UrgencyLevel;
}) {
  const days = (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  const isOverdue = urgency === "overdue";
  const ratio = isOverdue
    ? 1
    : Math.min(1, Math.max(0.06, (14 - days) / 14));
  const offset = CIRC * (1 - ratio);
  const color = RING_COLOR[urgency];
  const { num, unit } = countdownParts(iso);

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
          style={
            {
              animation: "ring-fill 1s cubic-bezier(.2,.8,.2,1) both",
              "--ring-from": `${CIRC}`,
              "--ring-to": `${offset}`,
            } as React.CSSProperties
          }
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color }}
      >
        <span
          className="font-mono font-extrabold leading-none tabular-nums"
          style={{ fontSize: 18, letterSpacing: "-0.04em" }}
        >
          {num}
        </span>
        <span
          className="mt-0.5 font-semibold leading-none text-[var(--ink-3)]"
          style={{ fontSize: 9 }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}
