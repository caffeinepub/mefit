import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Drumstick,
  Leaf,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { MeFitUser } from "../../types";

interface Props {
  onComplete: (user: MeFitUser) => void;
}

const TOTAL_STEPS = 5;

function GlassInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none text-base"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.14)",
        ...(props.style ?? {}),
      }}
    />
  );
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<MeFitUser["gender"] | "">("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState<MeFitUser["goal"] | "">("");
  const [lifestyle, setLifestyle] = useState<MeFitUser["lifestyle"] | "">("");

  function canProceed() {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return age.trim().length > 0 && gender !== "";
    if (step === 3) return height.trim().length > 0 && weight.trim().length > 0;
    if (step === 4) return goal !== "";
    if (step === 5) return lifestyle !== "";
    return false;
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      const user: MeFitUser = {
        name: name.trim(),
        age: Number(age),
        gender: gender as MeFitUser["gender"],
        height: Number(height),
        weight: Number(weight),
        goal: goal as MeFitUser["goal"],
        lifestyle: lifestyle as MeFitUser["lifestyle"],
      };
      localStorage.setItem("mefit_user", JSON.stringify(user));
      onComplete(user);
    }
  }

  const chipBase =
    "px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer";

  function chipStyle(active: boolean, color = "#3B82F6"): React.CSSProperties {
    return {
      background: active ? `${color}33` : "rgba(255,255,255,0.07)",
      border: active
        ? `1.5px solid ${color}`
        : "1px solid rgba(255,255,255,0.12)",
      color: active ? "#fff" : "rgba(255,255,255,0.5)",
      boxShadow: active ? `0 0 12px ${color}44` : "none",
    };
  }

  const stepTitles = [
    "What's your name?",
    "About you",
    "Your body stats",
    "What's your goal?",
    "Your lifestyle",
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F2940 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/40 text-xs">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-blue-400 text-xs font-semibold">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
                background: "linear-gradient(90deg, #3B82F6, #10B981)",
              }}
            />
          </div>
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
              <div
                key={idx.toString()}
                className="h-1 flex-1 rounded-full transition-all"
                style={{
                  background:
                    idx < step
                      ? "linear-gradient(90deg, #3B82F6, #10B981)"
                      : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {stepTitles[step - 1]}
          </h2>

          {step === 1 && (
            <GlassInput
              data-ocid="onboarding.input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              autoFocus
            />
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="ob-age"
                  className="text-white/50 text-xs uppercase tracking-wider mb-2 block"
                >
                  Age
                </label>
                <GlassInput
                  id="ob-age"
                  data-ocid="onboarding.input"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  min="10"
                  max="100"
                />
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                  Gender
                </p>
                <div className="flex gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      data-ocid="onboarding.toggle"
                      onClick={() => setGender(g)}
                      className={chipBase}
                      style={chipStyle(gender === g)}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="ob-height"
                  className="text-white/50 text-xs uppercase tracking-wider mb-2 block"
                >
                  Height (cm)
                </label>
                <GlassInput
                  id="ob-height"
                  data-ocid="onboarding.input"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                />
              </div>
              <div>
                <label
                  htmlFor="ob-weight"
                  className="text-white/50 text-xs uppercase tracking-wider mb-2 block"
                >
                  Weight (kg)
                </label>
                <GlassInput
                  id="ob-weight"
                  data-ocid="onboarding.input"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="65"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              {[
                {
                  id: "loss" as const,
                  label: "Weight Loss",
                  desc: "Burn fat, get lean",
                  icon: TrendingDown,
                  color: "#EF4444",
                },
                {
                  id: "gain" as const,
                  label: "Weight Gain",
                  desc: "Build muscle, bulk up",
                  icon: TrendingUp,
                  color: "#10B981",
                },
                {
                  id: "maintain" as const,
                  label: "Maintain",
                  desc: "Stay healthy & balanced",
                  icon: Minus,
                  color: "#3B82F6",
                },
              ].map(({ id, label, desc, icon: Icon, color }) => (
                <button
                  type="button"
                  key={id}
                  data-ocid="onboarding.toggle"
                  onClick={() => setGoal(id)}
                  className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all"
                  style={chipStyle(goal === id, color)}
                >
                  <Icon size={20} style={{ color }} />
                  <div>
                    <p className="font-bold text-sm text-white">{label}</p>
                    <p className="text-xs text-white/40">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                data-ocid="onboarding.toggle"
                onClick={() => setLifestyle("veg")}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all"
                style={chipStyle(lifestyle === "veg", "#10B981")}
              >
                <Leaf size={22} style={{ color: "#10B981" }} />
                <div>
                  <p className="font-bold text-sm text-white">Vegetarian</p>
                  <p className="text-xs text-white/40">
                    Plant-based, no meat or fish
                  </p>
                </div>
              </button>
              <button
                type="button"
                data-ocid="onboarding.toggle"
                onClick={() => setLifestyle("nonveg")}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all"
                style={chipStyle(lifestyle === "nonveg", "#F97316")}
              >
                <Drumstick size={22} style={{ color: "#F97316" }} />
                <div>
                  <p className="font-bold text-sm text-white">Non-Vegetarian</p>
                  <p className="text-xs text-white/40">
                    Includes meat, fish, and eggs
                  </p>
                </div>
              </button>
              <button
                type="button"
                data-ocid="onboarding.toggle"
                onClick={() => setLifestyle("vegan")}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all"
                style={chipStyle(lifestyle === "vegan", "#10B981")}
              >
                <Leaf size={22} style={{ color: "#10B981" }} />
                <div>
                  <p className="font-bold text-sm text-white">Vegan</p>
                  <p className="text-xs text-white/40">No animal products</p>
                </div>
              </button>
              <button
                type="button"
                data-ocid="onboarding.toggle"
                onClick={() => setLifestyle("eggetarian")}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all"
                style={chipStyle(lifestyle === "eggetarian", "#F59E0B")}
              >
                <CircleDot size={22} style={{ color: "#F59E0B" }} />
                <div>
                  <p className="font-bold text-sm text-white">Eggetarian</p>
                  <p className="text-xs text-white/40">Vegetarian + eggs</p>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              data-ocid="onboarding.secondary_button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl text-white/60 font-semibold text-sm transition-all hover:text-white"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button
            type="button"
            data-ocid="onboarding.primary_button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
            style={{
              background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
              boxShadow: canProceed()
                ? "0 8px 24px rgba(59,130,246,0.35)"
                : "none",
            }}
          >
            {step === TOTAL_STEPS ? "Complete Setup" : "Next"}{" "}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
