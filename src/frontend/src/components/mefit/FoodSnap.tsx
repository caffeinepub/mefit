import { Camera, Check, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SnapResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  items: { name: string; grams: number; emoji: string }[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const DEMO_MEAL_SEEDS: SnapResult[] = [
  {
    id: "s1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    imageUrl: "",
    items: [
      { name: "Rice", grams: 200, emoji: "🍚" },
      { name: "Chicken breast", grams: 150, emoji: "🍗" },
      { name: "Broccoli", grams: 80, emoji: "🥦" },
    ],
    calories: 320,
    protein: 38,
    carbs: 42,
    fat: 8,
  },
  {
    id: "s2",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    imageUrl: "",
    items: [
      { name: "Oats", grams: 80, emoji: "🥣" },
      { name: "Banana", grams: 120, emoji: "🍌" },
      { name: "Milk", grams: 200, emoji: "🥛" },
    ],
    calories: 380,
    protein: 12,
    carbs: 68,
    fat: 6,
  },
];

const INSPIRATION_MEALS = [
  {
    label: "Breakfast",
    items: "Avocado toast + eggs",
    cal: 420,
    gradient: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    emoji: "🌅",
  },
  {
    label: "Lunch",
    items: "Dal rice + salad",
    cal: 520,
    gradient: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    emoji: "☀️",
  },
  {
    label: "Dinner",
    items: "Grilled paneer + veggies",
    cal: 460,
    gradient: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    emoji: "🌙",
  },
];

function randomAnalysis(
  filename: string,
): Omit<SnapResult, "id" | "timestamp" | "imageUrl"> {
  const seed = filename.length % 3;
  return [
    DEMO_MEAL_SEEDS[0],
    DEMO_MEAL_SEEDS[1],
    {
      ...DEMO_MEAL_SEEDS[0],
      items: [
        { name: "Dal", grams: 180, emoji: "🍲" },
        { name: "Roti", grams: 120, emoji: "🫓" },
        { name: "Cucumber salad", grams: 60, emoji: "🥒" },
      ],
      calories: 440,
      protein: 22,
      carbs: 74,
      fat: 10,
    },
  ][seed];
}

export default function FoodSnap() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<SnapResult | null>(null);
  const [added, setAdded] = useState(false);
  const [logged, setLogged] = useState<SnapResult[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mefit_diet_log_snap");
      if (raw) setLogged(JSON.parse(raw) as SnapResult[]);
    } catch {
      setLogged([]);
    }
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setResult(null);
    setAdded(false);
    setAnalyzing(true);
    setAnalysisProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 30;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setAnalysisProgress(100);
        setTimeout(() => {
          setAnalyzing(false);
          const analysis = randomAnalysis(file.name);
          setResult({
            id: String(Date.now()),
            timestamp: new Date().toISOString(),
            imageUrl: url,
            ...analysis,
          });
        }, 300);
      } else {
        setAnalysisProgress(Math.round(p));
      }
    }, 200);
  }

  function addToLog() {
    if (!result) return;
    const updated = [result, ...logged];
    setLogged(updated);
    localStorage.setItem("mefit_diet_log_snap", JSON.stringify(updated));
    setAdded(true);
  }

  const macros = result
    ? [
        {
          label: "Cal",
          value: `${result.calories}`,
          unit: "kcal",
          color: "#F97316",
        },
        {
          label: "Protein",
          value: `${result.protein}g`,
          unit: "",
          color: "#3B82F6",
        },
        {
          label: "Carbs",
          value: `${result.carbs}g`,
          unit: "",
          color: "#10B981",
        },
        { label: "Fat", value: `${result.fat}g`, unit: "", color: "#8B5CF6" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #F97316, #EF4444)" }}
        >
          <Camera size={16} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Snap Your Meal</h2>
          <p className="text-xs text-gray-400">
            AI analyzes your food instantly
          </p>
        </div>
      </div>

      {/* Upload zone - use button for accessibility */}
      <button
        type="button"
        className="rounded-2xl border-2 border-dashed p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors w-full text-left"
        style={{
          borderColor: imagePreview ? "#10B981" : "#D1D5DB",
          background: imagePreview
            ? "rgba(16,185,129,0.04)"
            : "rgba(249,250,251,0.8)",
        }}
        onClick={() => fileRef.current?.click()}
        data-ocid="food.upload_button"
        aria-label="Upload meal photo for AI analysis"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          data-ocid="food.dropzone"
        />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Meal preview"
            className="w-full max-h-48 object-cover rounded-xl"
          />
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Camera size={24} className="text-orange-400" />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Take a photo or upload your meal
              <br />
              <span className="text-xs text-gray-400">JPG, PNG supported</span>
            </p>
          </>
        )}
      </button>

      {/* Analyzing */}
      {analyzing && (
        <div
          className="rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles
              size={16}
              className="text-indigo-500"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p className="text-sm font-semibold text-indigo-700">
              AI Analyzing your meal...
            </p>
          </div>
          <div className="h-2.5 rounded-full bg-indigo-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${analysisProgress}%`,
                background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              }}
            />
          </div>
          <p className="text-xs text-indigo-400 mt-1 text-right">
            {analysisProgress}%
          </p>
        </div>
      )}

      {/* AI Results */}
      {result && !analyzing && (
        <div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(16,185,129,0.25)",
            boxShadow: "0 4px 20px rgba(16,185,129,0.1)",
          }}
          data-ocid="food.success_state"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-green-500" />
            <p className="font-bold text-gray-800 text-sm">
              AI Analysis Complete
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 font-medium">Detected items:</p>
            {result.items.map((item) => (
              <p key={item.name} className="text-sm text-gray-700">
                {item.emoji} {item.name} ({item.grams}g)
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {macros.map(({ label, value, unit, color }) => (
              <span
                key={label}
                className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: color }}
              >
                {label}: {value}
                {unit}
              </span>
            ))}
          </div>

          {added ? (
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <Check size={16} />
              Added to today's log!
            </div>
          ) : (
            <button
              type="button"
              onClick={addToLog}
              data-ocid="food.primary_button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
              }}
            >
              <Plus size={16} />
              Add to Diet Log ✓
            </button>
          )}
        </div>
      )}

      {/* Inspiration Meals */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">
          Meal Inspiration
        </p>
        <div
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {INSPIRATION_MEALS.map((m) => (
            <div
              key={m.label}
              className="flex-shrink-0 rounded-2xl p-4 w-36"
              style={{ background: m.gradient }}
            >
              <p className="text-xl mb-1">{m.emoji}</p>
              <p className="font-bold text-gray-800 text-sm">{m.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{m.items}</p>
              <p className="text-xs font-bold text-gray-700 mt-1">
                {m.cal} kcal
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Snapped Meals */}
      {logged.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">
            Today's Snapped Meals
          </p>
          <div className="flex flex-col gap-2">
            {logged.slice(0, 5).map((entry, i) => (
              <div
                key={entry.id}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
                data-ocid={`food.item.${i + 1}`}
              >
                <Camera size={14} className="text-gray-300 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700">
                    {entry.items.map((it) => it.emoji).join(" ")}{" "}
                    {entry.calories} kcal
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-500">
                  {entry.protein}g P
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
