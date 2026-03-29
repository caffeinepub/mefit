import { useEffect, useState } from "react";

interface RadialProgressProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  gradient?: [string, string];
  icon: React.ReactNode;
  size?: number;
  animated?: boolean;
}

export default function RadialProgress({
  value,
  max,
  label,
  unit,
  color,
  gradient,
  icon,
  size = 80,
  animated = true,
}: RadialProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!animated) {
      setAnimatedValue(value);
      return;
    }
    const timeout = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timeout);
  }, [value, animated]);

  const pct = Math.min(animatedValue / max, 1);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const cx = size / 2;
  const cy = size / 2;
  const gradientId = `radial-grad-${label.replace(/\s/g, "-")}`;

  const displayValue =
    value >= 1000
      ? `${(value / 1000).toFixed(1)}k`
      : value % 1 !== 0
        ? value.toFixed(1)
        : String(value);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`${label}: ${value} ${unit}`}
        >
          <title>{label} progress</title>
          {gradient && (
            <defs>
              <linearGradient
                id={gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={gradient[0]} />
                <stop offset="100%" stopColor={gradient[1]} />
              </linearGradient>
            </defs>
          )}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={`${color}20`}
            strokeWidth="8"
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={gradient ? `url(#${gradientId})` : color}
            strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: animated ? "stroke-dasharray 0.8s ease" : "none",
            }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize: size < 70 ? "10px" : "13px" }}
        >
          <span className="font-bold" style={{ color, lineHeight: 1.1 }}>
            {displayValue}
          </span>
          <span
            className="text-gray-400"
            style={{ fontSize: size < 70 ? "8px" : "10px" }}
          >
            {unit}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span style={{ color, fontSize: size < 70 ? "14px" : "16px" }}>
          {icon}
        </span>
        <span className="text-xs text-gray-600 font-medium text-center leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
}
