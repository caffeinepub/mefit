import { Check, Loader2, Mic, MicOff, Plus, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface FoodItem {
  name: string;
  cal: number;
  protein: number;
  carbs: number;
  emoji: string;
}

const FOOD_MAP: { keywords: string[]; food: FoodItem }[] = [
  {
    keywords: ["roti", "chapati", "chapatti", "paratha"],
    food: { name: "Roti", cal: 120, protein: 3, carbs: 25, emoji: "🫓" },
  },
  {
    keywords: ["sabzi", "sabji", "vegetables", "veggie", "sabzee"],
    food: { name: "Mixed Sabzi", cal: 80, protein: 3, carbs: 15, emoji: "🥦" },
  },
  {
    keywords: ["doodh", "milk"],
    food: {
      name: "Milk (1 glass)",
      cal: 150,
      protein: 8,
      carbs: 12,
      emoji: "🥛",
    },
  },
  {
    keywords: ["rice", "chawal", "bhaat"],
    food: {
      name: "Rice (1 bowl)",
      cal: 200,
      protein: 4,
      carbs: 45,
      emoji: "🍚",
    },
  },
  {
    keywords: ["dal", "daal", "lentil"],
    food: { name: "Dal", cal: 150, protein: 9, carbs: 27, emoji: "🥣" },
  },
  {
    keywords: ["egg", "anda", "ande", "omelette", "omelet"],
    food: { name: "Egg", cal: 78, protein: 6, carbs: 1, emoji: "🥚" },
  },
  {
    keywords: ["banana", "kela", "kelaa"],
    food: { name: "Banana", cal: 90, protein: 1, carbs: 23, emoji: "🍌" },
  },
  {
    keywords: ["bread", "toast"],
    food: {
      name: "Bread (2 slices)",
      cal: 160,
      protein: 5,
      carbs: 30,
      emoji: "🍞",
    },
  },
  {
    keywords: ["apple", "seb", "saib"],
    food: { name: "Apple", cal: 80, protein: 1, carbs: 21, emoji: "🍎" },
  },
  {
    keywords: ["chicken", "murgi", "murgh"],
    food: { name: "Chicken", cal: 220, protein: 27, carbs: 0, emoji: "🍗" },
  },
  {
    keywords: ["paneer", "paner"],
    food: { name: "Paneer", cal: 265, protein: 18, carbs: 4, emoji: "🧀" },
  },
  {
    keywords: ["salad"],
    food: { name: "Salad", cal: 50, protein: 2, carbs: 10, emoji: "🥗" },
  },
  {
    keywords: ["chai", "tea", "chay"],
    food: { name: "Chai (1 cup)", cal: 45, protein: 1, carbs: 8, emoji: "☕" },
  },
  {
    keywords: ["samosa"],
    food: { name: "Samosa", cal: 262, protein: 4, carbs: 28, emoji: "🥟" },
  },
  {
    keywords: ["poha", "pohe"],
    food: { name: "Poha", cal: 180, protein: 3, carbs: 36, emoji: "🍱" },
  },
  {
    keywords: ["idli", "idly"],
    food: {
      name: "Idli (2 pcs)",
      cal: 140,
      protein: 4,
      carbs: 28,
      emoji: "🍚",
    },
  },
  {
    keywords: ["dosa", "dose"],
    food: { name: "Dosa", cal: 175, protein: 5, carbs: 32, emoji: "🫔" },
  },
  {
    keywords: ["yogurt", "curd", "dahi"],
    food: { name: "Curd/Dahi", cal: 100, protein: 5, carbs: 8, emoji: "🥛" },
  },
];

function parseFood(text: string): FoodItem[] {
  const lower = text.toLowerCase();
  const detected: FoodItem[] = [];
  const seen = new Set<string>();
  for (const { keywords, food } of FOOD_MAP) {
    for (const kw of keywords) {
      if (lower.includes(kw) && !seen.has(food.name)) {
        detected.push(food);
        seen.add(food.name);
        break;
      }
    }
  }
  return detected;
}

function getMealAssessment(
  protein: number,
  calories: number,
): { label: string; color: string; emoji: string } {
  if (protein < 10)
    return { label: "Low Protein", color: "#F59E0B", emoji: "⚠️" };
  if (calories > 600)
    return { label: "High Calories", color: "#F97316", emoji: "⚡" };
  if (protein >= 20 && calories <= 500)
    return { label: "High Protein", color: "#3B82F6", emoji: "💪" };
  return { label: "Balanced Meal", color: "#10B981", emoji: "🌟" };
}

function speakText(message: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "hi-IN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

interface DietLogEntry {
  id: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  rawText: string;
  timestamp: string;
}

function loadLog(): DietLogEntry[] {
  try {
    return JSON.parse(
      localStorage.getItem("mefit_diet_log") ?? "[]",
    ) as DietLogEntry[];
  } catch {
    return [];
  }
}

const VOICE_KEYFRAMES = `
  @keyframes micPulse {
    0%   { transform: scale(1);   opacity: 0.7; }
    50%  { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(1);   opacity: 0; }
  }
  @keyframes micRecording {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    50%     { box-shadow: 0 0 0 16px rgba(239,68,68,0); }
  }
`;

let voiceStylesInjected = false;
function injectVoiceStyles() {
  if (voiceStylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = VOICE_KEYFRAMES;
  document.head.appendChild(style);
  voiceStylesInjected = true;
}

type RecState = "idle" | "recording" | "processing";

export default function VoiceFoodLogger() {
  injectVoiceStyles();

  const [recState, setRecState] = useState<RecState>("idle");
  const [transcript, setTranscript] = useState("");
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [voiceReply, setVoiceReply] = useState("");
  const [log, setLog] = useState<DietLogEntry[]>(loadLog);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  function startListening() {
    if (!isSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setRecState("processing");
      setTimeout(() => analyzeText(text), 400);
    };

    rec.onerror = () => {
      setRecState("idle");
      toast.error("Could not hear clearly. Please try again.");
    };

    rec.onend = () => {
      if (recState === "recording") setRecState("idle");
    };

    recognitionRef.current = rec;
    rec.start();
    setRecState("recording");
    setTranscript("");
    setDetectedFoods([]);
    setVoiceReply("");
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setRecState("idle");
  }

  function analyzeText(text: string) {
    const foods = parseFood(text);
    setDetectedFoods(foods);
    setRecState("idle");

    const totalProtein = foods.reduce((s, f) => s + f.protein, 0);
    const totalCal = foods.reduce((s, f) => s + f.cal, 0);

    let reply: string;
    if (foods.length === 0) {
      reply =
        "Koi food item detect nahi hua. Please phir se bolein jaise 'maine dal chawal khaya'";
    } else if (totalProtein < 10) {
      reply = "Aapke meal mein protein thoda kam hai. Dal ya egg add karein.";
    } else if (totalCal > 600) {
      reply = "Aapne kaafi calories li hain. Thoda walk karein.";
    } else {
      reply = "Aapne balanced meal liya hai. Bahut achha!";
    }

    setVoiceReply(reply);
    setTimeout(() => speakText(reply), 300);
  }

  function handleAddToLog() {
    if (detectedFoods.length === 0) return;
    const entry: DietLogEntry = {
      id: String(Date.now()),
      foods: detectedFoods.map((f) => f.name),
      calories: detectedFoods.reduce((s, f) => s + f.cal, 0),
      protein: detectedFoods.reduce((s, f) => s + f.protein, 0),
      carbs: detectedFoods.reduce((s, f) => s + f.carbs, 0),
      rawText: transcript,
      timestamp: new Date().toISOString(),
    };
    const updated = [entry, ...log].slice(0, 20);
    setLog(updated);
    localStorage.setItem("mefit_diet_log", JSON.stringify(updated));
    setDetectedFoods([]);
    setTranscript("");
    setVoiceReply("");
    toast.success("Added to your diet log ✓");
  }

  function replayVoice() {
    if (voiceReply) speakText(voiceReply);
  }

  const totalCal = detectedFoods.reduce((s, f) => s + f.cal, 0);
  const totalProtein = detectedFoods.reduce((s, f) => s + f.protein, 0);
  const totalCarbs = detectedFoods.reduce((s, f) => s + f.carbs, 0);
  const assessment =
    detectedFoods.length > 0 ? getMealAssessment(totalProtein, totalCal) : null;

  const glass = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Mic size={16} color="#EC4899" />
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#EC4899" }}
        >
          Voice Food Logger
        </span>
        <span
          className="flex-1 h-px"
          style={{ background: "rgba(236,72,153,0.2)" }}
        />
      </div>

      {/* Mic button + status */}
      <div className="flex flex-col items-center gap-3 py-4">
        {!isSupported ? (
          <div
            className="text-center px-4 py-4 rounded-2xl"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <MicOff size={28} color="#EF4444" className="mx-auto mb-2" />
            <p className="text-white text-sm font-semibold">
              Voice input not supported
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Please use Chrome or Edge for voice input.
            </p>
          </div>
        ) : (
          <>
            {/* Pulsing rings when recording */}
            <div className="relative flex items-center justify-center">
              {recState === "recording" && (
                <>
                  <div
                    className="absolute w-24 h-24 rounded-full"
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      animation: "micPulse 1.2s ease-out infinite",
                    }}
                  />
                  <div
                    className="absolute w-20 h-20 rounded-full"
                    style={{
                      background: "rgba(239,68,68,0.2)",
                      animation: "micPulse 1.2s ease-out infinite 0.4s",
                    }}
                  />
                </>
              )}
              <button
                type="button"
                data-ocid="voice_logger.primary_button"
                onClick={
                  recState === "recording" ? stopListening : startListening
                }
                disabled={recState === "processing"}
                className="relative w-18 h-18 rounded-full flex items-center justify-center transition-all disabled:opacity-60"
                style={{
                  width: 72,
                  height: 72,
                  background:
                    recState === "recording"
                      ? "linear-gradient(135deg, #EF4444, #DC2626)"
                      : "linear-gradient(135deg, #EC4899, #8B5CF6)",
                  boxShadow:
                    recState === "recording"
                      ? "0 0 0 0 rgba(239,68,68,0.5), 0 8px 32px rgba(239,68,68,0.4)"
                      : "0 8px 32px rgba(236,72,153,0.4)",
                  animation:
                    recState === "recording"
                      ? "micRecording 1.5s ease-in-out infinite"
                      : undefined,
                }}
              >
                {recState === "processing" ? (
                  <Loader2 size={28} color="white" className="animate-spin" />
                ) : recState === "recording" ? (
                  <MicOff size={28} color="white" />
                ) : (
                  <Mic size={28} color="white" />
                )}
              </button>
            </div>

            <p
              className="text-sm font-medium"
              style={{
                color:
                  recState === "recording"
                    ? "#EF4444"
                    : recState === "processing"
                      ? "#F59E0B"
                      : "rgba(255,255,255,0.5)",
              }}
            >
              {recState === "recording"
                ? "🔴 Listening..."
                : recState === "processing"
                  ? "Analyzing..."
                  : "Tap to speak your meal"}
            </p>
            <p className="text-slate-600 text-xs text-center">
              Try: "maine dal chawal aur roti khaya" or "I had chicken and
              salad"
            </p>
          </>
        )}
      </div>

      {/* Recognized text */}
      {transcript.length > 0 && (
        <div
          className="rounded-2xl px-4 py-3"
          style={{ ...glass, borderColor: "rgba(139,92,246,0.25)" }}
        >
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
            You said
          </p>
          <p className="text-white text-sm italic">
            &ldquo;{transcript}&rdquo;
          </p>
        </div>
      )}

      {/* Detection result */}
      {detectedFoods.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            ...glass,
            border: `1px solid ${assessment?.color ?? "#10B981"}30`,
          }}
        >
          <div
            className="px-4 py-3"
            style={{
              background: `linear-gradient(135deg, ${assessment?.color ?? "#10B981"}18, transparent)`,
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold text-sm">Detected Foods</p>
              {assessment && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${assessment.color}22`,
                    color: assessment.color,
                  }}
                >
                  {assessment.emoji} {assessment.label}
                </span>
              )}
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="space-y-2 mt-2">
              {detectedFoods.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between py-1"
                  style={{
                    borderBottom:
                      i < detectedFoods.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                  }}
                >
                  <span className="text-sm text-white">
                    {f.emoji} {f.name}
                  </span>
                  <div className="flex gap-3 text-[10px] text-slate-400">
                    <span style={{ color: "#F97316" }}>{f.cal}cal</span>
                    <span style={{ color: "#3B82F6" }}>{f.protein}g P</span>
                    <span style={{ color: "#10B981" }}>{f.carbs}g C</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                {
                  label: "Calories",
                  value: `${totalCal}`,
                  unit: "kcal",
                  color: "#F97316",
                },
                {
                  label: "Protein",
                  value: `${totalProtein}g`,
                  unit: "",
                  color: "#3B82F6",
                },
                {
                  label: "Carbs",
                  value: `${totalCarbs}g`,
                  unit: "",
                  color: "#10B981",
                },
              ].map(({ label, value, unit, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-2.5 text-center"
                  style={{ background: `${color}15` }}
                >
                  <p className="font-bold text-sm" style={{ color }}>
                    {value}
                    {unit}
                  </p>
                  <p className="text-[10px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddToLog}
              data-ocid="voice_logger.save_button"
              className="w-full mt-3 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #10B981, #059669)" }}
            >
              <Plus size={16} /> Add to Log
            </button>
          </div>
        </div>
      )}

      {/* No food detected */}
      {transcript.length > 0 &&
        detectedFoods.length === 0 &&
        recState === "idle" && (
          <div
            className="rounded-2xl px-4 py-3 text-center"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <p className="text-yellow-400 text-sm">
              No food items recognized in your speech.
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Try saying food names like "roti", "dal", "rice", "chicken"
            </p>
          </div>
        )}

      {/* Voice reply bubble */}
      {voiceReply.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={replayVoice}
              data-ocid="voice_logger.toggle"
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: "rgba(139,92,246,0.25)",
                border: "1px solid rgba(139,92,246,0.4)",
              }}
            >
              <Volume2 size={14} color="#8B5CF6" />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-1">
                AI Voice Response
              </p>
              <p className="text-white text-sm italic">
                &ldquo;{voiceReply}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent log entries */}
      {log.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Check size={14} color="#10B981" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Recent Logs
            </span>
          </div>
          <div className="space-y-2">
            {log.slice(0, 5).map((entry, idx) => (
              <div
                key={entry.id}
                data-ocid={`voice_logger.item.${idx + 1}`}
                className="rounded-xl px-3 py-2.5 flex items-center justify-between"
                style={glass}
              >
                <div>
                  <p className="text-white text-xs font-medium">
                    {entry.foods.join(", ")}
                  </p>
                  <p className="text-slate-600 text-[10px] mt-0.5">
                    {new Date(entry.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-2 text-[10px]">
                  <span style={{ color: "#F97316" }}>{entry.calories}cal</span>
                  <span style={{ color: "#3B82F6" }}>{entry.protein}g P</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
