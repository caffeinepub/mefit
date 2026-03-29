import { useState } from "react";
import type { DietLog, FitnessLog, UserProfile } from "../types";

interface Props {
  user: UserProfile;
  dietLogs: DietLog[];
  fitnessLogs: FitnessLog[];
  onAddDiet: (log: Omit<DietLog, "id">) => void;
  onAddFitness: (log: Omit<FitnessLog, "id">) => void;
}

const mealColors: Record<string, string> = {
  breakfast: "bg-yellow-100 text-yellow-700",
  lunch: "bg-green-100 text-green-700",
  dinner: "bg-indigo-100 text-indigo-700",
  snack: "bg-pink-100 text-pink-700",
};

export default function Logs({
  user,
  dietLogs,
  fitnessLogs,
  onAddDiet,
  onAddFitness,
}: Props) {
  const [sub, setSub] = useState<"diet" | "fitness" | "summary">("diet");
  const today = new Date().toISOString().split("T")[0];
  const myDiet = dietLogs.filter(
    (d) => d.userId === user.id && d.date === today,
  );
  const myFitness = fitnessLogs.filter(
    (f) => f.userId === user.id && f.date === today,
  );

  const [dietForm, setDietForm] = useState({
    mealType: "breakfast",
    items: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [fitForm, setFitForm] = useState({
    steps: "",
    exerciseType: "",
    duration: "",
    notes: "",
  });
  const [showDietForm, setShowDietForm] = useState(false);
  const [showFitForm, setShowFitForm] = useState(false);

  const totalCal = myDiet.reduce((s, d) => s + d.calories, 0);
  const totalSteps = myFitness.reduce((s, f) => s + f.steps, 0);
  const totalProt = myDiet.reduce((s, d) => s + d.protein, 0);
  const totalCarbs = myDiet.reduce((s, d) => s + d.carbs, 0);
  const totalFat = myDiet.reduce((s, d) => s + d.fat, 0);

  function submitDiet(e: React.FormEvent) {
    e.preventDefault();
    onAddDiet({
      userId: user.id,
      date: today,
      mealType: dietForm.mealType as DietLog["mealType"],
      items: dietForm.items,
      calories: Number(dietForm.calories),
      protein: Number(dietForm.protein),
      carbs: Number(dietForm.carbs),
      fat: Number(dietForm.fat),
    });
    setDietForm({
      mealType: "breakfast",
      items: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    });
    setShowDietForm(false);
  }

  function submitFit(e: React.FormEvent) {
    e.preventDefault();
    onAddFitness({
      userId: user.id,
      date: today,
      steps: Number(fitForm.steps),
      exerciseType: fitForm.exerciseType,
      duration: Number(fitForm.duration),
      notes: fitForm.notes,
    });
    setFitForm({ steps: "", exerciseType: "", duration: "", notes: "" });
    setShowFitForm(false);
  }

  // Allow nutritionists to view all diet logs
  const visibleDiet =
    user.role === "nutritionist"
      ? dietLogs.filter((d) => d.date === today)
      : myDiet;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Diet & Fitness Logs</h2>

      {/* Sub-tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
        {(["diet", "fitness", "summary"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setSub(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              sub === t ? "bg-white shadow-sm text-[#B58AD6]" : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Diet tab */}
      {sub === "diet" && (
        <div className="space-y-4">
          {user.role !== "doctor" && (
            <button
              type="button"
              onClick={() => setShowDietForm(!showDietForm)}
              className="w-full py-3 bg-gradient-to-r from-[#F0C4C0] to-[#C7A1E3] text-white rounded-2xl font-semibold text-sm shadow-sm"
            >
              + Add Diet Entry
            </button>
          )}

          {showDietForm && (
            <form
              onSubmit={submitDiet}
              className="bg-white rounded-2xl shadow-md p-5 space-y-3"
            >
              <h3 className="font-bold text-gray-700">New Diet Entry</h3>
              <select
                value={dietForm.mealType}
                onChange={(e) =>
                  setDietForm({ ...dietForm, mealType: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              <input
                required
                placeholder="Food items..."
                value={dietForm.items}
                onChange={(e) =>
                  setDietForm({ ...dietForm, items: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Calories"
                  value={dietForm.calories}
                  onChange={(e) =>
                    setDietForm({ ...dietForm, calories: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={dietForm.protein}
                  onChange={(e) =>
                    setDietForm({ ...dietForm, protein: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={dietForm.carbs}
                  onChange={(e) =>
                    setDietForm({ ...dietForm, carbs: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={dietForm.fat}
                  onChange={(e) =>
                    setDietForm({ ...dietForm, fat: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#C7A1E3] text-white rounded-xl text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowDietForm(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {visibleDiet.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No diet entries today.
            </p>
          ) : (
            visibleDiet.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${mealColors[d.mealType]}`}
                  >
                    {d.mealType}
                  </span>
                  {user.role !== "user" && (
                    <span className="text-xs text-gray-400">
                      User: {d.userId}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700">{d.items}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>🔥 {d.calories} cal</span>
                  <span>P: {d.protein}g</span>
                  <span>C: {d.carbs}g</span>
                  <span>F: {d.fat}g</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Fitness tab */}
      {sub === "fitness" && (
        <div className="space-y-4">
          {user.role !== "doctor" && (
            <button
              type="button"
              onClick={() => setShowFitForm(!showFitForm)}
              className="w-full py-3 bg-gradient-to-r from-[#D8F2E9] to-[#BFEADB] text-green-800 rounded-2xl font-semibold text-sm shadow-sm"
            >
              + Add Fitness Entry
            </button>
          )}

          {showFitForm && (
            <form
              onSubmit={submitFit}
              className="bg-white rounded-2xl shadow-md p-5 space-y-3"
            >
              <h3 className="font-bold text-gray-700">New Fitness Entry</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Steps"
                  value={fitForm.steps}
                  onChange={(e) =>
                    setFitForm({ ...fitForm, steps: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  placeholder="Exercise type"
                  value={fitForm.exerciseType}
                  onChange={(e) =>
                    setFitForm({ ...fitForm, exerciseType: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={fitForm.duration}
                  onChange={(e) =>
                    setFitForm({ ...fitForm, duration: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <textarea
                placeholder="Notes..."
                value={fitForm.notes}
                onChange={(e) =>
                  setFitForm({ ...fitForm, notes: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-400 text-white rounded-xl text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowFitForm(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {myFitness.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No fitness entries today.
            </p>
          ) : (
            myFitness.map((f) => (
              <div key={f.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-700">{f.exerciseType}</p>
                  <span className="text-xs text-gray-500">
                    {f.duration} min
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>👟 {f.steps.toLocaleString()} steps</span>
                </div>
                {f.notes && (
                  <p className="text-xs text-gray-500 mt-1 italic">{f.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Summary tab */}
      {sub === "summary" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Total Calories",
                value: `${totalCal} kcal`,
                color: "from-pink-100 to-pink-50",
              },
              {
                label: "Total Steps",
                value: totalSteps.toLocaleString(),
                color: "from-purple-100 to-purple-50",
              },
              {
                label: "Exercise Time",
                value: `${myFitness.reduce((s, f) => s + f.duration, 0)} min`,
                color: "from-green-100 to-green-50",
              },
              {
                label: "Meals Logged",
                value: `${myDiet.length}`,
                color: "from-yellow-100 to-yellow-50",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-4`}
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-700 mb-3">Macros Breakdown</h3>
            {[
              {
                name: "Protein",
                val: totalProt,
                color: "bg-blue-400",
                max: 100,
              },
              {
                name: "Carbs",
                val: totalCarbs,
                color: "bg-yellow-400",
                max: 250,
              },
              { name: "Fat", val: totalFat, color: "bg-pink-400", max: 80 },
            ].map((m) => (
              <div key={m.name} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{m.name}</span>
                  <span className="font-medium">{m.val}g</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full`}
                    style={{
                      width: `${Math.min((m.val / m.max) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-700 mb-3">Today's Timeline</h3>
            <div className="space-y-2">
              {[
                ...myDiet.map((d) => ({
                  time: "08:00",
                  type: "diet",
                  label: `${d.mealType}: ${d.items}`,
                  sub: `${d.calories} cal`,
                })),
                ...myFitness.map((f) => ({
                  time: "10:00",
                  type: "fitness",
                  label: f.exerciseType,
                  sub: `${f.steps} steps · ${f.duration} min`,
                })),
              ].map((e) => (
                <div key={e.label + e.sub} className="flex gap-3 items-start">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${e.type === "diet" ? "bg-pink-400" : "bg-green-400"}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {e.label}
                    </p>
                    <p className="text-xs text-gray-500">{e.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
