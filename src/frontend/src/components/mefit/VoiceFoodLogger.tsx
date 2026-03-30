import {
  AlertTriangle,
  Check,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getLocalNutrition } from "../../services/foodAI";
import { addMealLog } from "../../utils/userDataStore";

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

type VoiceStep =
  | "idle"
  | "permission-check"
  | "recording"
  | "processing"
  | "results";

interface DetectedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
}

const FOOD_KEYWORDS: { keywords: string[]; name: string }[] = [
  {
    keywords: ["roti", "chapati", "chapatti", "paratha", "naan"],
    name: "roti",
  },
  {
    keywords: ["sabzi", "sabji", "vegetables", "veggie", "subzi"],
    name: "sabzi",
  },
  { keywords: ["doodh", "milk"], name: "milk" },
  { keywords: ["rice", "chawal", "bhaat", "chaawal"], name: "rice" },
  { keywords: ["dal", "daal", "lentil"], name: "dal" },
  { keywords: ["banana", "kela"], name: "banana" },
  { keywords: ["egg", "anda", "ande"], name: "egg" },
  { keywords: ["chicken", "murgi"], name: "chicken breast" },
  { keywords: ["paneer", "cottage cheese"], name: "paneer" },
  { keywords: ["idli", "idly"], name: "idli" },
  { keywords: ["dosa"], name: "dosa" },
  { keywords: ["sambar"], name: "sambar" },
  { keywords: ["poha"], name: "poha" },
  { keywords: ["oats"], name: "oats" },
  { keywords: ["bread", "toast"], name: "bread" },
  { keywords: ["pasta", "noodles"], name: "pasta" },
  { keywords: ["salad"], name: "salad" },
  { keywords: ["soup"], name: "soup" },
  { keywords: ["coffee", "kafi"], name: "coffee" },
  { keywords: ["chai", "tea"], name: "chai" },
  { keywords: ["curd", "dahi", "yogurt"], name: "curd" },
  { keywords: ["mango", "aam"], name: "mango" },
  { keywords: ["apple", "seb"], name: "apple" },
  { keywords: ["orange", "santra"], name: "orange" },
  { keywords: ["biryani"], name: "biryani" },
  { keywords: ["khichdi"], name: "khichdi" },
  { keywords: ["upma"], name: "upma" },
  { keywords: ["lassi"], name: "lassi" },
  { keywords: ["kheer"], name: "kheer" },
  { keywords: ["fish", "machli", "machhi"], name: "fish curry" },
  { keywords: ["pizza"], name: "pizza" },
  { keywords: ["burger"], name: "burger" },
  { keywords: ["sandwich"], name: "sandwich" },
];

function detectFoodsFromText(text: string): DetectedFood[] {
  const lower = text.toLowerCase();
  const found: DetectedFood[] = [];
  const seen = new Set<string>();
  for (const entry of FOOD_KEYWORDS) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      if (!seen.has(entry.name)) {
        seen.add(entry.name);
        const n = getLocalNutrition(entry.name);
        found.push({ name: entry.name, ...n });
      }
    }
  }
  return found;
}

interface VoiceProps {
  onSaved?: () => void;
}

export default function VoiceFoodLogger({ onSaved }: VoiceProps) {
  const [voiceStep, setVoiceStep] = useState<VoiceStep>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [fallbackInput, setFallbackInput] = useState("");
  const [permError, setPermError] = useState("");
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptRef = useRef("");
  const interimRef = useRef("");

  const SpeechAPI =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  useEffect(() => {
    return () => {
      recogRef.current?.abort();
    };
  }, []);

  async function handleMicTap() {
    if (!SpeechAPI) {
      setPermError(
        "Voice input not supported in this browser. Please use Chrome.",
      );
      setVoiceStep("recording");
      return;
    }
    setVoiceStep("permission-check");
    setPermError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      for (const track of stream.getTracks()) {
        track.stop();
      }
      startRecognition();
    } catch {
      setPermError(
        "Microphone access denied. Please allow mic in browser settings.",
      );
      setVoiceStep("recording");
    }
  }

  function startRecognition() {
    if (!SpeechAPI) return;
    transcriptRef.current = "";
    interimRef.current = "";
    setTranscript("");
    setInterimTranscript("");

    const recog = new SpeechAPI();
    recog.lang = "hi-IN";
    recog.interimResults = true;
    recog.continuous = false;

    recog.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      interimRef.current = interim;
      setInterimTranscript(interim);
      if (final) {
        transcriptRef.current = final;
        setTranscript(final);
      }
    };

    recog.onerror = (e: { error: string }) => {
      if (e.error === "not-allowed") {
        setPermError(
          "Microphone access denied. Please allow mic in browser settings.",
        );
      } else {
        setPermError(`Voice error: ${e.error}. Please retry.`);
      }
    };

    recog.onend = () => {
      const finalText = transcriptRef.current || interimRef.current;
      if (finalText.trim()) {
        setVoiceStep("processing");
        setTimeout(() => {
          const detected = detectFoodsFromText(finalText);
          setDetectedFoods(detected);
          setVoiceStep("results");
          if (detected.length > 0) speakResponse(detected);
        }, 800);
      } else {
        setVoiceStep("idle");
      }
    };

    recogRef.current = recog;
    recog.start();
    setVoiceStep("recording");
  }

  function stopRecording() {
    recogRef.current?.stop();
  }

  function speakResponse(foods: DetectedFood[]) {
    if (!window.speechSynthesis) return;
    const names = foods.map((f) => f.name).join(", ");
    const totalCal = foods.reduce((s, f) => s + f.calories, 0);
    const totalProt = foods.reduce((s, f) => s + f.protein, 0);
    let msg = `Aapne ${names} liya. Kul calories ${totalCal} hai.`;
    if (totalProt < 20) msg += " Protein thoda kam hai.";
    else msg += " Aapne balanced meal liya hai.";
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = "hi-IN";
    window.speechSynthesis.speak(utterance);
  }

  function updateFood(idx: number, field: string, value: string | number) {
    setDetectedFoods((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f)),
    );
  }

  function handleSave() {
    const allFoods = [...detectedFoods];
    if (fallbackInput.trim()) {
      const n = getLocalNutrition(fallbackInput.trim());
      allFoods.push({ name: fallbackInput.trim(), ...n });
    }
    if (allFoods.length === 0) {
      toast.error("No food items to save");
      return;
    }
    for (const food of allFoods) {
      addMealLog({
        foodName: food.name,
        calories: Number(food.calories),
        protein: Number(food.protein),
        carbs: Number(food.carbs),
        sugar: Number(food.sugar),
        fat: Number(food.fat),
        source: "voice",
      });
    }
    toast.success("Voice meal logged! 🎙️");
    handleReset();
    onSaved?.();
  }

  function handleReset() {
    recogRef.current?.abort();
    setVoiceStep("idle");
    setTranscript("");
    setInterimTranscript("");
    setDetectedFoods([]);
    setFallbackInput("");
    setPermError("");
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 14,
  };

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

  if (voiceStep === "idle") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <button
          type="button"
          data-ocid="voice.primary_button"
          onClick={handleMicTap}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}
        >
          <Mic size={28} color="white" />
        </button>
        <p className="text-slate-300 text-sm text-center">
          Tap to log food by voice
        </p>
        <p className="text-slate-500 text-xs text-center">
          Supports Hindi &amp; English
        </p>
      </div>
    );
  }

  if (voiceStep === "permission-check") {
    return (
      <div
        className="flex flex-col items-center gap-3 py-4"
        data-ocid="voice.loading_state"
      >
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "#818CF8" }}
        />
        <p className="text-slate-300 text-sm">
          Checking microphone permission...
        </p>
      </div>
    );
  }

  if (voiceStep === "recording") {
    if (permError) {
      return (
        <div className="space-y-3">
          <div
            className="flex items-start gap-2 rounded-xl p-3"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
            data-ocid="voice.error_state"
          >
            <AlertTriangle
              size={14}
              style={{ color: "#EF4444", flexShrink: 0, marginTop: 2 }}
            />
            <p className="text-xs" style={{ color: "#F87171" }}>
              {permError}
            </p>
          </div>
          <button
            type="button"
            data-ocid="voice.secondary_button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#94A3B8",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          <button
            type="button"
            onClick={stopRecording}
            className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
            style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)" }}
            data-ocid="voice.primary_button"
          >
            <MicOff size={26} color="white" />
          </button>
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: "rgba(239,68,68,0.4)" }}
          />
        </div>
        <p className="text-white font-semibold text-sm">Listening...</p>
        {(transcript || interimTranscript) && (
          <div style={cardStyle} className="w-full">
            <p className="text-slate-400 text-xs mb-1">Hearing:</p>
            <p className="text-white text-sm">
              {transcript || interimTranscript}
            </p>
          </div>
        )}
        <button
          type="button"
          data-ocid="voice.cancel_button"
          onClick={handleReset}
          className="text-xs text-slate-400 underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (voiceStep === "processing") {
    return (
      <div
        className="flex flex-col items-center gap-3 py-4"
        data-ocid="voice.loading_state"
      >
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "#818CF8" }}
        />
        <p className="text-white text-sm font-semibold">Processing voice...</p>
        {transcript && (
          <p className="text-slate-400 text-xs text-center">
            &ldquo;{transcript}&rdquo;
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transcript && (
        <div style={cardStyle}>
          <p className="text-slate-400 text-xs mb-1">You said:</p>
          <p className="text-white text-sm">&ldquo;{transcript}&rdquo;</p>
        </div>
      )}

      {detectedFoods.length === 0 && (
        <div
          className="flex items-start gap-2 rounded-xl p-3"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
          data-ocid="voice.error_state"
        >
          <AlertTriangle
            size={14}
            style={{ color: "#F59E0B", flexShrink: 0, marginTop: 2 }}
          />
          <p className="text-xs" style={{ color: "#FCD34D" }}>
            Could not detect food items. Please type them below:
          </p>
        </div>
      )}

      {detectedFoods.map((food, i) => (
        <div key={`vf-${food.name}-${i}`} style={cardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Volume2 size={14} style={{ color: "#818CF8" }} />
            <input
              style={{ ...inputStyle, fontWeight: 600 }}
              value={food.name}
              onChange={(e) => updateFood(i, "name", e.target.value)}
              data-ocid="voice.input"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["calories", "protein", "carbs", "fat", "sugar"] as const).map(
              (field) => (
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
                    data-ocid="voice.input"
                  />
                </label>
              ),
            )}
          </div>
        </div>
      ))}

      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-400">
          Add food manually (optional)
        </span>
        <input
          style={inputStyle}
          placeholder="e.g. roti, dal, rice..."
          value={fallbackInput}
          onChange={(e) => setFallbackInput(e.target.value)}
          data-ocid="voice.input"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          data-ocid="voice.cancel_button"
          onClick={handleReset}
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
          data-ocid="voice.primary_button"
          onClick={handleSave}
          className="flex items-center justify-center gap-1.5 py-3 px-5 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "linear-gradient(135deg,#10B981,#059669)",
            color: "white",
            flex: 2,
          }}
        >
          <Check size={14} /> Save to Diet Log
        </button>
      </div>
    </div>
  );
}
