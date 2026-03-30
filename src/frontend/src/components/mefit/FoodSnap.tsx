import {
  AlertTriangle,
  Camera,
  ChevronDown,
  ChevronUp,
  Loader2,
  PencilLine,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  type FoodDetectionResult,
  analyzeFoodImage,
} from "../../services/foodAI";
import { addMealLog } from "../../utils/userDataStore";

type Step = "idle" | "loading" | "confirm";

interface EditableFood {
  original: FoodDetectionResult;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  expanded: boolean;
}

interface Props {
  onSaved?: () => void;
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  if (value >= 0.8)
    return (
      <span
        className="text-xs px-2 py-0.5 rounded-full font-semibold"
        style={{ background: "rgba(34,197,94,0.18)", color: "#4ADE80" }}
      >
        {pct}% confident
      </span>
    );
  if (value >= 0.6)
    return (
      <span
        className="text-xs px-2 py-0.5 rounded-full font-semibold"
        style={{ background: "rgba(245,158,11,0.18)", color: "#FCD34D" }}
      >
        {pct}% — check result
      </span>
    );
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-semibold"
      style={{ background: "rgba(239,68,68,0.18)", color: "#F87171" }}
    >
      {pct}% — low confidence
    </span>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "white",
  padding: "6px 10px",
  fontSize: 13,
  width: "100%",
  outline: "none",
};

export default function FoodSnap({ onSaved }: Props) {
  const [step, setStep] = useState<Step>("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [foods, setFoods] = useState<EditableFood[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setStep("loading");
    setAnalysisError(null);
    try {
      const apiKey = localStorage.getItem("clarifai_api_key") ?? undefined;
      const result = await analyzeFoodImage(file, apiKey);
      setAnalysisError(result.error ?? null);
      const editableFoods: EditableFood[] = result.foods.map((f, i) => ({
        original: f,
        name: f.name,
        calories: f.nutrition.calories,
        protein: f.nutrition.protein,
        carbs: f.nutrition.carbs,
        fat: f.nutrition.fat,
        sugar: f.nutrition.sugar,
        expanded: i === 0,
      }));
      setFoods(editableFoods);
      setStep("confirm");
    } catch {
      setAnalysisError("Analysis failed. Please retry or add food manually.");
      setFoods([]);
      setStep("confirm");
    }
  }

  function updateFood(idx: number, field: string, value: string | number) {
    setFoods((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f)),
    );
  }

  function toggleExpand(idx: number) {
    setFoods((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, expanded: !f.expanded } : f)),
    );
  }

  function handleSaveAll() {
    const validFoods = foods.filter((f) => f.name.trim());
    if (validFoods.length === 0 && !manualName.trim()) {
      toast.error("Please confirm or enter at least one food item");
      return;
    }
    for (const food of validFoods) {
      addMealLog({
        foodName: food.name,
        calories: Number(food.calories),
        protein: Number(food.protein),
        carbs: Number(food.carbs),
        sugar: Number(food.sugar),
        fat: Number(food.fat),
        source: "photo",
      });
    }
    if (showManual && manualName.trim()) {
      addMealLog({
        foodName: manualName.trim(),
        calories: 200,
        protein: 8,
        carbs: 30,
        sugar: 5,
        fat: 5,
        source: "manual",
      });
    }
    toast.success("Meal logged successfully! 🎉");
    onSaved?.();
    setStep("idle");
    setImagePreview(null);
    setFoods([]);
    setManualName("");
    setShowManual(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleRetry() {
    setStep("idle");
    setImagePreview(null);
    setFoods([]);
    setAnalysisError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
  };

  if (step === "idle") {
    return (
      <div className="space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          data-ocid="foodsnap.upload_button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-2xl transition-opacity hover:opacity-80"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "2px dashed rgba(99,102,241,0.4)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}
          >
            <Camera size={24} color="white" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Snap Your Meal</p>
            <p className="text-slate-400 text-xs mt-1">
              Upload a food photo for instant AI analysis
            </p>
          </div>
        </button>
        <p className="text-center text-xs" style={{ color: "#F59E0B" }}>
          💡 Get accurate results — add your Clarifai API key in Settings
        </p>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="space-y-4">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Meal preview"
            className="w-full rounded-2xl object-cover"
            style={{ maxHeight: 200 }}
          />
        )}
        <div
          className="flex flex-col items-center gap-3 py-6 rounded-2xl"
          style={cardStyle}
          data-ocid="foodsnap.loading_state"
        >
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: "#818CF8" }}
          />
          <div className="text-center">
            <p className="text-white font-semibold text-sm">
              Analyzing your meal...
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Running AI food detection
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Meal preview"
          className="w-full rounded-2xl object-cover"
          style={{ maxHeight: 180 }}
        />
      )}

      {analysisError && (
        <div
          className="flex items-start gap-2 rounded-xl p-3"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
          data-ocid="foodsnap.error_state"
        >
          <AlertTriangle
            size={14}
            style={{ color: "#F59E0B", flexShrink: 0, marginTop: 2 }}
          />
          <p className="text-xs" style={{ color: "#FCD34D" }}>
            {analysisError}
          </p>
        </div>
      )}

      {foods.length === 0 && (
        <div
          className="flex items-start gap-2 rounded-xl p-3"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <AlertTriangle
            size={14}
            style={{ color: "#EF4444", flexShrink: 0, marginTop: 2 }}
          />
          <p className="text-xs" style={{ color: "#F87171" }}>
            No foods detected. Add manually below.
          </p>
        </div>
      )}

      {foods.map((food, i) => (
        <div key={`food-${food.original.name}-${i}`} style={cardStyle}>
          <button
            type="button"
            className="w-full flex items-center justify-between"
            onClick={() => toggleExpand(i)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-white font-semibold text-sm truncate">
                {food.name || "Unknown food"}
              </span>
              <ConfidenceBadge value={food.original.confidence} />
            </div>
            {food.expanded ? (
              <ChevronUp
                size={16}
                style={{ color: "#64748B", flexShrink: 0 }}
              />
            ) : (
              <ChevronDown
                size={16}
                style={{ color: "#64748B", flexShrink: 0 }}
              />
            )}
          </button>

          {food.original.confidence < 0.8 && (
            <div
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 mt-2"
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <AlertTriangle size={12} style={{ color: "#F59E0B" }} />
              <span className="text-xs" style={{ color: "#FCD34D" }}>
                Not confident — please confirm food item
              </span>
            </div>
          )}

          {food.expanded && (
            <div className="mt-3 space-y-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Food Name</span>
                <input
                  style={inputStyle}
                  value={food.name}
                  onChange={(e) => updateFood(i, "name", e.target.value)}
                  data-ocid="foodsnap.input"
                />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["calories", "protein", "carbs"] as const).map((field) => (
                  <label key={field} className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400 capitalize">
                      {field === "calories" ? "Kcal" : `${field} (g)`}
                    </span>
                    <input
                      style={inputStyle}
                      type="number"
                      min={0}
                      value={food[field]}
                      onChange={(e) =>
                        updateFood(i, field, Number(e.target.value))
                      }
                      data-ocid="foodsnap.input"
                    />
                  </label>
                ))}
                {(["fat", "sugar"] as const).map((field) => (
                  <label key={field} className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400 capitalize">
                      {field} (g)
                    </span>
                    <input
                      style={inputStyle}
                      type="number"
                      min={0}
                      value={food[field]}
                      onChange={(e) =>
                        updateFood(i, field, Number(e.target.value))
                      }
                      data-ocid="foodsnap.input"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        data-ocid="foodsnap.secondary_button"
        onClick={() => setShowManual((v) => !v)}
        className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
        style={{ color: "#818CF8" }}
      >
        <PencilLine size={13} />
        Add a different food manually
      </button>

      {showManual && (
        <div style={cardStyle}>
          <p className="text-white text-sm font-semibold mb-2">Manual Entry</p>
          <input
            style={inputStyle}
            placeholder="e.g. Chicken Biryani"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            data-ocid="foodsnap.input"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          data-ocid="foodsnap.cancel_button"
          onClick={handleRetry}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#94A3B8",
          }}
        >
          <RefreshCw size={14} /> Retry
        </button>
        <button
          type="button"
          data-ocid="foodsnap.primary_button"
          onClick={handleSaveAll}
          className="flex items-center justify-center gap-1.5 py-3 px-6 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "linear-gradient(135deg,#10B981,#059669)",
            color: "white",
            flex: 2,
          }}
        >
          <Sparkles size={14} /> Confirm & Save All
        </button>
      </div>
    </div>
  );
}
