import { Camera, Droplets, Flame, Mic, Plus, Wheat, Zap } from "lucide-react";
import { useState } from "react";
import type { MeFitUser } from "../../types";
import { getMealLogs } from "../../utils/userDataStore";
import FoodSnap from "./FoodSnap";
import PureCaneBlissCard from "./PureCaneBlissCard";
import VoiceFoodLogger from "./VoiceFoodLogger";

interface Props {
  goal: MeFitUser["goal"];
  lifestyle: MeFitUser["lifestyle"];
}

export default function DietScreen({
  goal: _goal,
  lifestyle: _lifestyle,
}: Props) {
  const [activeInput, setActiveInput] = useState<"snap" | "voice" | null>(null);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const mealLogs = getMealLogs();
  const hasLogs = mealLogs.length > 0;

  // Compute totals from real logs (today only)
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLogs = mealLogs.filter((m) => m.timestamp.startsWith(todayStr));
  const totals = todayLogs.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + (m.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const macros = hasLogs
    ? [
        {
          label: "Calories",
          value: totals.calories,
          unit: "kcal",
          icon: Flame,
          color: "#F97316",
          pct: Math.min(100, Math.round((totals.calories / 2000) * 100)),
        },
        {
          label: "Protein",
          value: totals.protein,
          unit: "g",
          icon: Zap,
          color: "#3B82F6",
          pct: Math.min(100, Math.round((totals.protein / 75) * 100)),
        },
        {
          label: "Carbs",
          value: totals.carbs,
          unit: "g",
          icon: Wheat,
          color: "#10B981",
          pct: Math.min(100, Math.round((totals.carbs / 250) * 100)),
        },
        {
          label: "Fat",
          value: totals.fat,
          unit: "g",
          icon: Droplets,
          color: "#8B5CF6",
          pct: Math.min(100, Math.round((totals.fat / 65) * 100)),
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Today's Diet</h1>
        <p className="text-gray-500 text-sm">{today}</p>
      </div>

      {/* Input action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          data-ocid="diet.upload_button"
          onClick={() => setActiveInput(activeInput === "snap" ? null : "snap")}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white transition-all"
          style={{
            background:
              activeInput === "snap"
                ? "linear-gradient(135deg, #F97316, #EF4444)"
                : "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.3)",
            color: activeInput === "snap" ? "#fff" : "#F97316",
          }}
        >
          <Camera size={16} />
          Meal Photo
        </button>
        <button
          type="button"
          data-ocid="diet.toggle"
          onClick={() =>
            setActiveInput(activeInput === "voice" ? null : "voice")
          }
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all"
          style={{
            background:
              activeInput === "voice"
                ? "linear-gradient(135deg, #EC4899, #8B5CF6)"
                : "rgba(236,72,153,0.12)",
            border: "1px solid rgba(236,72,153,0.3)",
            color: activeInput === "voice" ? "#fff" : "#EC4899",
          }}
        >
          <Mic size={16} />
          Voice Log
        </button>
      </div>

      {/* Input panels */}
      {activeInput === "snap" && (
        <div
          className="rounded-3xl p-5"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}
        >
          <FoodSnap onSaved={() => setActiveInput(null)} />
        </div>
      )}

      {activeInput === "voice" && (
        <div
          className="rounded-3xl p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(236,72,153,0.15)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          <VoiceFoodLogger onSaved={() => setActiveInput(null)} />
        </div>
      )}

      {/* Macros summary — only if data exists */}
      {hasLogs && macros.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {macros.map(({ label, value, unit, icon: Icon, color, pct }) => (
            <div
              key={label}
              className="rounded-2xl p-4 relative overflow-hidden bg-white"
              style={{ border: `1px solid ${color}30` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-xs font-medium">
                  {label}
                </span>
                <Icon size={14} style={{ color }} />
              </div>
              <p className="text-gray-800 font-bold text-xl">
                {value}
                <span className="text-xs text-gray-400 font-normal ml-1">
                  {unit}
                </span>
              </p>
              <div
                className="h-1.5 rounded-full mt-2"
                style={{ background: `${color}20` }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <p className="text-gray-400 text-[10px] mt-1">{pct}% of goal</p>
            </div>
          ))}
        </div>
      )}

      {/* Diet log list */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-700">Diet Log</h2>

        {!hasLogs ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center text-center gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))",
              border: "1px solid rgba(139,92,246,0.12)",
            }}
            data-ocid="diet.empty_state"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              }}
            >
              <Plus size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-700">No data yet</p>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Start by adding your meals, health data, or reports.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                data-ocid="diet.upload_button"
                onClick={() => setActiveInput("snap")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg, #F97316, #EF4444)",
                }}
              >
                <Camera size={16} /> Upload Meal Photo
              </button>
              <button
                type="button"
                data-ocid="diet.toggle"
                onClick={() => setActiveInput("voice")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                }}
              >
                <Mic size={16} /> Voice Food Log
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {mealLogs.slice(0, 10).map((m, i) => (
              <div
                key={m.id}
                data-ocid={`diet.item.${i + 1}`}
                className="rounded-2xl p-4 bg-white flex items-center justify-between"
                style={{ border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {m.foodName}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(m.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {m.source}
                  </p>
                </div>
                <div className="flex gap-3 text-xs">
                  <span style={{ color: "#F97316" }}>{m.calories} kcal</span>
                  <span style={{ color: "#3B82F6" }}>{m.protein}g P</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PureCaneBlissCard className="bg-slate-800" />
    </div>
  );
}
