interface DataPoint {
  label: string;
  value: number;
}

const W = 700;
const H = 220;
const PAD_B = 28;
const PAD_T = 12;

export default function SalesChart({
  data,
  unit = "€",
}: {
  data: DataPoint[];
  unit?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
        Son 30 günde satış yok.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const innerH = H - PAD_T - PAD_B;
  const n = data.length;
  const barW = W / n;
  const barGap = Math.max(1, Math.min(4, barW * 0.2));
  const tickY = (v: number) => PAD_T + innerH - (v / max) * innerH;

  const labelIdx = (i: number) => {
    if (n <= 8) return true;
    const step = Math.ceil(n / 8);
    return i % step === 0 || i === n - 1;
  };

  return (
    <div className="border border-on-surface p-stack-md">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Son 30 günlük günlük ciro grafiği"
      >
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1={0}
              x2={W}
              y1={tickY(max * f)}
              y2={tickY(max * f)}
              stroke="currentColor"
              strokeWidth={1}
              className="text-on-surface/20"
              strokeDasharray={f === 0 ? "" : "4 4"}
            />
            <text
              x={W - 4}
              y={tickY(max * f) - 4}
              textAnchor="end"
              className="fill-current text-on-surface-variant"
              fontSize={10}
              fontFamily="monospace"
            >
              {unit}
              {f === 0
                ? "0"
                : (max * f).toLocaleString("tr-TR", {
                    maximumFractionDigits: 0,
                  })}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const h = d.value === 0 ? 2 : Math.max(2, (d.value / max) * innerH);
          return (
            <g key={i}>
              <rect
                x={i * barW + barGap / 2}
                y={H - PAD_B - h}
                width={barW - barGap}
                height={h}
                className="fill-current text-on-surface hover:fill-primary"
              >
                <title>{`${d.label}: ${unit}${d.value.toLocaleString("tr-TR", {
                  maximumFractionDigits: 2,
                })}`}</title>
              </rect>
              {labelIdx(i) && (
                <text
                  x={i * barW + barW / 2}
                  y={H - PAD_B + 16}
                  textAnchor="middle"
                  className="fill-current text-on-surface-variant"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
