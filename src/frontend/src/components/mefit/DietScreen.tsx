import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Flame,
  Wheat,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { MeFitUser } from "../../types";
import FoodSnap from "./FoodSnap";
import PureCaneBlissCard from "./PureCaneBlissCard";
import VoiceFoodLogger from "./VoiceFoodLogger";

interface Props {
  goal: MeFitUser["goal"];
  lifestyle: MeFitUser["lifestyle"];
}

const meals = [
  {
    id: "breakfast",
    label: "Breakfast",
    time: "8:00 AM",
    items: "Oats & Banana",
    kcal: 380,
    p: 12,
    c: 68,
    f: 6,
    emoji: "\uD83E\uDD63",
  },
  {
    id: "lunch",
    label: "Lunch",
    time: "1:00 PM",
    items: "Dal Rice & Salad",
    kcal: 520,
    p: 18,
    c: 82,
    f: 9,
    emoji: "\uD83C\uDF5B",
  },
  {
    id: "dinner",
    label: "Dinner",
    time: "8:00 PM",
    items: "Grilled Paneer & Veggies",
    kcal: 460,
    p: 35,
    c: 28,
    f: 12,
    emoji: "\uD83E\uDD57",
  },
  {
    id: "snack",
    label: "Snack",
    time: "4:30 PM",
    items: "Nuts & Seasonal Fruit",
    kcal: 220,
    p: 6,
    c: 30,
    f: 10,
    emoji: "\uD83E\uDD5C",
  },
];

const macros = [
  {
    label: "Calories",
    value: 1580,
    unit: "kcal",
    icon: Flame,
    color: "#F97316",
    pct: 79,
  },
  {
    label: "Protein",
    value: 71,
    unit: "g",
    icon: Zap,
    color: "#3B82F6",
    pct: 71,
  },
  {
    label: "Carbs",
    value: 208,
    unit: "g",
    icon: Wheat,
    color: "#10B981",
    pct: 83,
  },
  {
    label: "Fat",
    value: 37,
    unit: "g",
    icon: Droplets,
    color: "#8B5CF6",
    pct: 62,
  },
];

export default function DietScreen({
  goal: _goal,
  lifestyle: _lifestyle,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>("breakfast");
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const sugarG = 42;
  const sugarLimit = 50;

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Today's Diet</h1>
        <p className="text-gray-500 text-sm">{today}</p>
      </div>

      {/* Voice Food Logger */}
      <div
        className="rounded-3xl p-5"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(236,72,153,0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        <VoiceFoodLogger />
      </div>

      {/* AI Food Snap — first section */}
      <div
        className="rounded-3xl p-5"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <FoodSnap />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {macros.map(({ label, value, unit, icon: Icon, color, pct }) => (
          <div
            key={label}
            className="rounded-2xl p-4 relative overflow-hidden bg-white"
            style={{ border: `1px solid ${color}30` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs font-medium">{label}</span>
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

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-700">Meals Today</h2>
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="rounded-2xl overflow-hidden bg-white"
            style={{ border: "1px solid rgba(0,0,0,0.07)" }}
          >
            <button
              type="button"
              data-ocid="diet.toggle"
              onClick={() => setExpanded(expanded === meal.id ? null : meal.id)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{meal.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {meal.label}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {meal.time} · {meal.kcal} kcal
                  </p>
                </div>
              </div>
              {expanded === meal.id ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </button>
            {expanded === meal.id && (
              <div className="px-4 pb-4">
                <p className="text-gray-600 text-sm mb-3">{meal.items}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Protein",
                      val: meal.p,
                      unit: "g",
                      color: "#3B82F6",
                    },
                    {
                      label: "Carbs",
                      val: meal.c,
                      unit: "g",
                      color: "#10B981",
                    },
                    { label: "Fat", val: meal.f, unit: "g", color: "#F97316" },
                  ].map(({ label, val, unit, color }) => (
                    <div
                      key={label}
                      className="rounded-xl p-2 text-center"
                      style={{ background: `${color}12` }}
                    >
                      <p className="font-bold text-sm" style={{ color }}>
                        {val}
                        {unit}
                      </p>
                      <p className="text-gray-400 text-[10px]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <PureCaneBlissCard className="bg-slate-800" />

      <div
        className="rounded-2xl p-4 bg-white"
        style={{ border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Daily Sugar Intake
          </h3>
          <span className="text-xs font-bold text-red-500">
            {sugarG}g / {sugarLimit}g
          </span>
        </div>
        <div
          className="h-2.5 rounded-full"
          style={{ background: "rgba(239,68,68,0.1)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${(sugarG / sugarLimit) * 100}%`,
              background: "linear-gradient(90deg, #F97316, #EF4444)",
            }}
          />
        </div>
        <p className="text-red-400 text-xs mt-2">
          ⚠ Approaching daily sugar limit. Consider reducing sugary snacks.
        </p>
      </div>
    </div>
  );
}
