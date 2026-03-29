import {
  Brain,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useState } from "react";

interface Props {
  onComplete: () => void;
}

const SCREENS = [
  {
    id: 1,
    title: "Your AI Health Companion",
    subtitle:
      "Personalized health tracking, AI-powered insights, and real-time monitoring for a healthier you.",
    gradient: "linear-gradient(135deg, #1E3A5F 0%, #3B82F6 50%, #8B5CF6 100%)",
    icons: [Brain, Sparkles],
    color: "#93C5FD",
  },
  {
    id: 2,
    title: "Pregnancy & Diet Support",
    subtitle:
      "Tailored diet plans, pregnancy tracking, and nutritional guidance — all in one place.",
    gradient: "linear-gradient(135deg, #4C1D95 0%, #EC4899 50%, #F97316 100%)",
    icons: [Heart, Leaf],
    color: "#FCA5A5",
  },
  {
    id: 3,
    title: "Doctor & Emergency SOS",
    subtitle:
      "Connect with doctors, book consultations, and trigger emergency alerts with one tap.",
    gradient: "linear-gradient(135deg, #7F1D1D 0%, #EF4444 50%, #F97316 100%)",
    icons: [Stethoscope, Shield],
    color: "#FCA5A5",
  },
  {
    id: 4,
    title: "Track Progress & Win",
    subtitle:
      "Weekly body progress, leaderboards, streaks, and rewards to keep you motivated every day.",
    gradient: "linear-gradient(135deg, #064E3B 0%, #10B981 50%, #06B6D4 100%)",
    icons: [Trophy, TrendingUp],
    color: "#6EE7B7",
  },
];

export default function IntroScreens({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);

  function next() {
    if (current < SCREENS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      localStorage.setItem("mefit_intro_seen", "true");
      onComplete();
    }
  }

  function skip() {
    localStorage.setItem("mefit_intro_seen", "true");
    onComplete();
  }

  const screen = SCREENS[current];
  const [IconA, IconB] = screen.icons;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between z-[200] overflow-hidden"
      style={{
        background: screen.gradient,
        transition: "background 0.5s ease",
      }}
    >
      {/* Skip */}
      <div className="w-full flex justify-end p-6">
        <button
          type="button"
          onClick={skip}
          className="text-white/60 text-sm font-medium px-4 py-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
          data-ocid="intro.secondary_button"
        >
          Skip
        </button>
      </div>

      {/* Icons */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
        <div className="relative">
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <IconA size={52} color="white" />
          </div>
          <div
            className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <IconB size={24} color="white" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            {screen.title}
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xs">
            {screen.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full px-8 pb-12 flex flex-col items-center gap-6">
        {/* Progress dots */}
        <div className="flex gap-2">
          {SCREENS.map((screen, i) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => setCurrent(i)}
              data-ocid="intro.toggle"
              className="rounded-full transition-all"
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                background: i === current ? "white" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>

        {/* Next / Get Started */}
        <button
          type="button"
          onClick={next}
          data-ocid="intro.primary_button"
          className="w-full max-w-xs py-4 rounded-2xl text-white font-bold text-lg"
          style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          {current === SCREENS.length - 1 ? "🚀 Get Started" : "Next →"}
        </button>
      </div>
    </div>
  );
}
