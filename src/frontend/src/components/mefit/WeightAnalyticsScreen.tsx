import { Scale, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { MeFitUser } from "../../types";

interface Props {
  user: MeFitUser | null;
}

interface WeightData {
  current: number;
  goal: number;
  height: number;
  bodyFat: number;
  muscleMass: number;
  hydration: number;
}

const DEFAULTS: WeightData = {
  current: 72,
  goal: 65,
  height: 165,
  bodyFat: 24,
  muscleMass: 42,
  hydration: 58,
};

function getBMIIdeal(height: number) {
  const hm = height / 100;
  return Math.round(22 * hm * hm * 10) / 10;
}

function getBMI(weight: number, height: number) {
  const hm = height / 100;
  return Math.round((weight / (hm * hm)) * 10) / 10;
}

function getBodyType(bmi: number) {
  if (bmi < 18.5)
    return {
      type: "Ectomorph",
      emoji: "🦴",
      desc: "Lean & long, naturally thin frame",
      color: "#60A5FA",
    };
  if (bmi <= 25)
    return {
      type: "Mesomorph",
      emoji: "💪",
      desc: "Athletic & well-proportioned frame",
      color: "#10B981",
    };
  return {
    type: "Endomorph",
    emoji: "🏋️",
    desc: "Solid & larger frame, higher strength",
    color: "#F97316",
  };
}

function Ring({
  pct,
  color,
  label,
  value,
  r,
  cx,
  cy,
  size,
}: {
  pct: number;
  color: string;
  label: string;
  value: string;
  r: number;
  cx: number;
  cy: number;
  size: number;
}) {
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={size}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={size}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill="white"
        fontSize={r > 40 ? 14 : 10}
        fontWeight="bold"
      >
        {value}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="rgba(255,255,255,0.6)"
        fontSize={8}
      >
        {label}
      </text>
    </g>
  );
}

export default function WeightAnalyticsScreen({ user }: Props) {
  const [data, setData] = useState<WeightData>(() => {
    try {
      const raw = localStorage.getItem("mefit_weight_data");
      if (raw) return JSON.parse(raw) as WeightData;
    } catch {
      /* empty */
    }
    return {
      ...DEFAULTS,
      current: user?.weight ?? DEFAULTS.current,
      goal: DEFAULTS.goal,
      height: user?.height ?? DEFAULTS.height,
    };
  });

  useEffect(() => {
    localStorage.setItem("mefit_weight_data", JSON.stringify(data));
  }, [data]);

  function update(key: keyof WeightData, val: number) {
    setData((d) => ({ ...d, [key]: val }));
  }

  const bmiIdeal = getBMIIdeal(data.height);
  const bmi = getBMI(data.current, data.height);
  const bodyType = getBodyType(bmi);
  const minW = Math.min(data.current, data.goal, bmiIdeal) - 5;
  const maxW = Math.max(data.current, data.goal, bmiIdeal) + 5;
  const range = maxW - minW;
  const pctCurrent = ((data.current - minW) / range) * 100;
  const pctGoal = ((data.goal - minW) / range) * 100;
  const pctIdeal = ((bmiIdeal - minW) / range) * 100;

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Weight Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            BMI {bmi} · {bodyType.type}
          </p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: "linear-gradient(90deg, #10B981, #3B82F6)" }}
        >
          Analytics
        </span>
      </div>

      {/* Weight Fields */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={16} className="text-blue-500" />
          <h2 className="font-semibold text-gray-800">Weight Data</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              key: "current" as const,
              label: "Current",
              color: "#3B82F6",
              unit: "kg",
            },
            {
              key: "goal" as const,
              label: "Goal",
              color: "#10B981",
              unit: "kg",
            },
            {
              key: "height" as const,
              label: "Height",
              color: "#F97316",
              unit: "cm",
            },
          ].map(({ key, label, color, unit }) => (
            <div key={key} className="flex flex-col items-center">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <input
                type="number"
                value={data[key]}
                onChange={(e) => update(key, Number(e.target.value))}
                className="w-full text-center font-bold text-lg rounded-xl p-2 border-0 focus:outline-none focus:ring-2"
                style={{
                  background: `${color}15`,
                  color,
                }}
                data-ocid="weight.input"
              />
              <p className="text-xs text-gray-400 mt-1">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Bridge */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={16} className="text-emerald-500" />
          <h2 className="font-semibold text-gray-800">Weight Bridge</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          {Math.abs(data.current - data.goal).toFixed(1)} kg to goal
        </p>
        <div className="relative h-3 bg-gray-100 rounded-full mb-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, #3B82F620, #10B98120)",
            }}
          />
          <div
            className="absolute top-0 bottom-0 rounded-full"
            style={{
              left: `${Math.min(pctCurrent, pctGoal)}%`,
              width: `${Math.abs(pctCurrent - pctGoal)}%`,
              background: "linear-gradient(90deg, #3B82F6, #10B981)",
            }}
          />
          {[
            {
              pct: pctCurrent,
              color: "#3B82F6",
              label: `${data.current}kg`,
              top: -28,
            },
            {
              pct: pctGoal,
              color: "#10B981",
              label: `${data.goal}kg`,
              top: -28,
            },
            {
              pct: pctIdeal,
              color: "#F97316",
              label: `${bmiIdeal}kg`,
              top: 18,
              diamond: true,
            },
          ].map(({ pct, color, label, top, diamond }) => (
            <div
              key={label}
              className="absolute"
              style={{
                left: `${pct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {diamond ? (
                <div
                  className="w-4 h-4 rotate-45"
                  style={{ background: color, border: "2px solid white" }}
                />
              ) : (
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ background: color }}
                />
              )}
              <span
                className="absolute text-[9px] font-bold whitespace-nowrap"
                style={{
                  color,
                  top,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Current
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Goal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rotate-45 bg-orange-400 inline-block" />{" "}
            BMI-Ideal
          </span>
        </div>
      </div>

      {/* Body Type */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: `${bodyType.color}15`,
          border: `1px solid ${bodyType.color}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">{bodyType.emoji}</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Body Type
            </p>
            <p
              className="font-black text-2xl"
              style={{ color: bodyType.color }}
            >
              {bodyType.type}
            </p>
            <p className="text-sm text-gray-600">{bodyType.desc}</p>
          </div>
        </div>
      </div>

      {/* Vitality Rings */}
      <div
        className="rounded-2xl p-5 flex flex-col items-center"
        style={{
          background: "linear-gradient(135deg, #0F172A, #1E293B)",
          boxShadow: "0 8px 32px rgba(15,23,42,0.3)",
        }}
      >
        <p className="text-white/60 text-xs uppercase tracking-widest mb-4">
          Vitality Rings
        </p>
        <svg
          viewBox="0 0 200 200"
          className="w-48 h-48"
          role="img"
          aria-label="Vitality rings showing body fat, muscle mass, and hydration percentages"
        >
          <title>Vitality Rings</title>
          <Ring
            pct={data.bodyFat}
            color="#F87171"
            label="Body Fat"
            value={`${data.bodyFat}%`}
            r={80}
            cx={100}
            cy={100}
            size={10}
          />
          <Ring
            pct={data.muscleMass}
            color="#34D399"
            label="Muscle"
            value={`${data.muscleMass}%`}
            r={60}
            cx={100}
            cy={100}
            size={10}
          />
          <Ring
            pct={data.hydration}
            color="#60A5FA"
            label="Hydration"
            value={`${data.hydration}%`}
            r={40}
            cx={100}
            cy={100}
            size={10}
          />
        </svg>
        <div className="flex gap-4 mt-3">
          {[
            { label: "Body Fat %", key: "bodyFat" as const, color: "#F87171" },
            { label: "Muscle %", key: "muscleMass" as const, color: "#34D399" },
            {
              label: "Hydration %",
              key: "hydration" as const,
              color: "#60A5FA",
            },
          ].map(({ label, key, color }) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <p className="text-xs" style={{ color }}>
                {label}
              </p>
              <input
                type="number"
                value={data[key]}
                min={0}
                max={100}
                onChange={(e) =>
                  update(
                    key,
                    Math.min(100, Math.max(0, Number(e.target.value))),
                  )
                }
                className="w-14 text-center text-xs font-bold rounded-lg p-1 border-0 bg-white/10 text-white focus:outline-none"
                data-ocid="weight.input"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
