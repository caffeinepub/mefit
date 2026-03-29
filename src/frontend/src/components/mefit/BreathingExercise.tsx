import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "idle" | "inhale" | "hold" | "exhale";
type Duration = 1 | 3 | 5;

const PHASE_DURATIONS: Record<Exclude<Phase, "idle">, number> = {
  inhale: 4000,
  hold: 4000,
  exhale: 6000,
};

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Ready",
  inhale: "Inhale...",
  hold: "Hold...",
  exhale: "Exhale...",
};

const PHASE_SUBTITLES: Record<Phase, string> = {
  idle: "Take a moment for yourself",
  inhale: "Breathe deeply and relax",
  hold: "Hold your breath gently",
  exhale: "Release slowly and fully",
};

const PHASE_COLORS: Record<Phase, string> = {
  idle: "#8B5CF6",
  inhale: "#3B82F6",
  hold: "#A855F7",
  exhale: "#EC4899",
};

const PHASE_GRADIENTS: Record<Phase, string> = {
  idle: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(59,130,246,0.4) 60%, transparent 100%)",
  inhale:
    "radial-gradient(circle, rgba(59,130,246,0.9) 0%, rgba(139,92,246,0.5) 60%, transparent 100%)",
  hold: "radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(236,72,153,0.5) 60%, transparent 100%)",
  exhale:
    "radial-gradient(circle, rgba(236,72,153,0.8) 0%, rgba(59,130,246,0.4) 60%, transparent 100%)",
};

const PHASE_SEQUENCE: Exclude<Phase, "idle">[] = ["inhale", "hold", "exhale"];

const MIN_SCALE = 80 / 140;
const MAX_SCALE = 1.0;

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: 4 + Math.floor((i * 7) % 9),
  x: 5 + ((i * 6.5) % 90),
  y: 5 + ((i * 8.3) % 85),
  duration: 6 + ((i * 0.6) % 8),
  delay: (i * 0.4) % 4,
  color:
    i % 3 === 0
      ? "rgba(139,92,246,0.35)"
      : i % 3 === 1
        ? "rgba(59,130,246,0.25)"
        : "rgba(236,72,153,0.25)",
}));
const CONFETTI = Array.from({ length: 12 }, (_, i) => ({
  id: `confetti-${i}`,
  color: ["#8B5CF6", "#3B82F6", "#EC4899", "#F59E0B", "#10B981"][i % 5],
  isCircle: i % 2 === 0,
  left: 15 + ((i * 6.5) % 70),
  top: 10 + ((i * 5.3) % 30),
  duration: 1.2 + i * 0.15,
  delay: i * 0.08,
}));

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  stressDetected?: boolean;
}

export default function BreathingExercise({ stressDetected = false }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<Duration>(3);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [reminderSaved, setReminderSaved] = useState(false);
  const [showStressBanner, setShowStressBanner] = useState(stressDetected);
  const [reminderToast, setReminderToast] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const phaseRef = useRef<Phase>("idle");
  const phaseProgressRef = useRef(0);
  const phaseStartRef = useRef<number>(0);
  const elapsedRef = useRef(0);
  const lastSecondRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalDuration = selectedDuration * 60;

  // Load reminder from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mefit_breathing_reminder");
    if (saved) {
      const parsed = JSON.parse(saved);
      setReminderEnabled(parsed.enabled);
      setReminderTime(parsed.time);
      setReminderSaved(true);

      // Check if current time matches
      const now = new Date();
      const [h, m] = parsed.time.split(":").map(Number);
      if (now.getHours() === h && now.getMinutes() === m) {
        setReminderToast(true);
        setTimeout(() => setReminderToast(false), 6000);
      }
    }
  }, []);

  const stopSession = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setPhase("idle");
    phaseRef.current = "idle";
    setPhaseProgress(0);
    phaseProgressRef.current = 0;
    setElapsedSeconds(0);
    elapsedRef.current = 0;
    lastSecondRef.current = 0;
  }, []);

  const startSession = useCallback(
    (dur?: Duration) => {
      const d = dur ?? selectedDuration;
      setSelectedDuration(d);
      setSessionComplete(false);
      setIsRunning(true);
      setPhase("inhale");
      phaseRef.current = "inhale";
      setPhaseProgress(0);
      phaseProgressRef.current = 0;
      setElapsedSeconds(0);
      elapsedRef.current = 0;
      lastSecondRef.current = 0;
      phaseStartRef.current = Date.now();

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - phaseStartRef.current;
        const curPhase = phaseRef.current as Exclude<Phase, "idle">;
        const phaseDur = PHASE_DURATIONS[curPhase];
        const progress = Math.min(elapsed / phaseDur, 1);

        phaseProgressRef.current = progress;
        setPhaseProgress(progress);

        // Advance elapsed seconds
        const totalElapsed = Math.floor(elapsedRef.current + elapsed / 1000);
        if (totalElapsed !== lastSecondRef.current) {
          lastSecondRef.current = totalElapsed;
          setElapsedSeconds(totalElapsed);
        }

        // Check session complete
        const sessionDur = d * 60;
        if (elapsedRef.current + elapsed / 1000 >= sessionDur) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          setPhase("idle");
          phaseRef.current = "idle";
          setSessionComplete(true);
          return;
        }

        // Advance phase
        if (progress >= 1) {
          const idx = PHASE_SEQUENCE.indexOf(curPhase);
          const next = PHASE_SEQUENCE[(idx + 1) % PHASE_SEQUENCE.length];
          elapsedRef.current += phaseDur / 1000;
          phaseRef.current = next;
          setPhase(next);
          setPhaseProgress(0);
          phaseProgressRef.current = 0;
          phaseStartRef.current = Date.now();
        }
      }, 50);
    },
    [selectedDuration],
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const circleScale = (() => {
    if (phase === "idle") return MIN_SCALE;
    if (phase === "inhale")
      return MIN_SCALE + (MAX_SCALE - MIN_SCALE) * phaseProgress;
    if (phase === "hold") return MAX_SCALE;
    if (phase === "exhale")
      return MAX_SCALE - (MAX_SCALE - MIN_SCALE) * phaseProgress;
    return MIN_SCALE;
  })();

  const phaseCountdown = (() => {
    if (phase === "idle") return null;
    const dur = PHASE_DURATIONS[phase as Exclude<Phase, "idle">];
    return Math.ceil(((1 - phaseProgress) * dur) / 1000);
  })();

  const saveReminder = () => {
    const data = { enabled: reminderEnabled, time: reminderTime };
    localStorage.setItem("mefit_breathing_reminder", JSON.stringify(data));
    setReminderSaved(true);
  };

  const formatReminderTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <>
      <style>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(-20px); }
          50% { transform: translateY(20px); }
        }
        @keyframes holdPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.85; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(139,92,246,0.5)); }
          50% { filter: drop-shadow(0 0 45px rgba(168,85,247,0.85)); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confettiBurst {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
        }
        @keyframes toastSlide {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes breathingOutline {
          0%, 100% { box-shadow: 0 0 0 0px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(139,92,246,0.08), 0 0 60px rgba(139,92,246,0.5); }
        }
        .hold-pulse { animation: holdPulse 2s ease-in-out infinite; }
        .glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
        .breathing-outline { animation: breathingOutline 3s ease-in-out infinite; }
      `}</style>

      <div
        data-ocid="breathing.panel"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg, rgba(8,12,35,0.98) 0%, rgba(20,10,45,0.97) 50%, rgba(8,12,35,0.98) 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 16px 80px",
        }}
      >
        {/* Background gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(88,28,220,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Reminder toast */}
        {reminderToast && (
          <div
            data-ocid="breathing.toast"
            style={{
              position: "fixed",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              background: "rgba(30,20,60,0.95)",
              border: "1px solid rgba(139,92,246,0.5)",
              borderRadius: 16,
              padding: "12px 20px",
              color: "#E2D9FF",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              backdropFilter: "blur(12px)",
              animation: "toastSlide 0.3s ease",
              boxShadow: "0 4px 24px rgba(139,92,246,0.3)",
            }}
          >
            🧘‍♀️ Time to relax and breathe
            <button
              type="button"
              onClick={() => setReminderToast(false)}
              style={{
                marginLeft: 8,
                opacity: 0.6,
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "#E2D9FF",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Stress banner */}
        {showStressBanner && (
          <div
            data-ocid="breathing.stress_banner"
            style={{
              width: "100%",
              maxWidth: 420,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.35)",
              borderRadius: 16,
              padding: "12px 16px",
              marginBottom: 16,
              zIndex: 2,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              animation: "fadeInUp 0.4s ease",
            }}
          >
            <div>
              <p
                style={{
                  color: "#6EE7B7",
                  fontSize: 13,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                🌿 You seem stressed
              </p>
              <p
                style={{
                  color: "#A7F3D0",
                  fontSize: 12,
                  margin: 0,
                  opacity: 0.85,
                }}
              >
                Try a 2-minute breathing session
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                type="button"
                data-ocid="breathing.stress_start_button"
                onClick={() => {
                  setShowStressBanner(false);
                  startSession(1);
                }}
                style={{
                  background: "linear-gradient(135deg, #059669, #10B981)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Start 1-min
              </button>
              <button
                type="button"
                onClick={() => setShowStressBanner(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6EE7B7",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {sessionComplete ? (
          // ── Completion screen ──
          <div
            data-ocid="breathing.success_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              paddingTop: 40,
              position: "relative",
              zIndex: 2,
              animation: "fadeInUp 0.5s ease",
            }}
          >
            {/* Confetti-like particles */}
            {CONFETTI.map((c) => (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  width: 8,
                  height: 8,
                  borderRadius: c.isCircle ? "50%" : 2,
                  background: c.color,
                  left: `${c.left}%`,
                  top: `${c.top}%`,
                  animation: `confettiBurst ${c.duration}s ease-out ${c.delay}s forwards`,
                }}
              />
            ))}

            <div style={{ fontSize: 80, lineHeight: 1 }}>💛</div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                background: "linear-gradient(135deg, #A78BFA, #EC4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                margin: 0,
              }}
            >
              Great job!
            </h2>
            <p
              style={{
                color: "#C4B5FD",
                fontSize: 18,
                textAlign: "center",
                margin: 0,
                fontWeight: 600,
              }}
            >
              You are calmer now 💛
            </p>
            <p
              style={{
                color: "#8B9CC8",
                fontSize: 14,
                textAlign: "center",
                margin: 0,
              }}
            >
              You completed a {selectedDuration}-minute breathing session
            </p>
            <button
              type="button"
              data-ocid="breathing.primary_button"
              onClick={() => {
                setSessionComplete(false);
              }}
              style={{
                marginTop: 8,
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                color: "#fff",
                border: "none",
                borderRadius: 30,
                padding: "14px 40px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: 0.3,
                boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
              }}
            >
              ↩ Start Again
            </button>
          </div>
        ) : (
          <>
            {/* Title */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 8,
                zIndex: 2,
                position: "relative",
              }}
            >
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  margin: 0,
                  background: "linear-gradient(135deg, #A78BFA, #60A5FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Breathing Exercise
              </h1>
              <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
                4-4-6 rhythm · Calm your mind
              </p>
            </div>

            {/* Duration picker */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 28,
                zIndex: 2,
                position: "relative",
              }}
            >
              {([1, 3, 5] as Duration[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  data-ocid="breathing.tab"
                  disabled={isRunning}
                  onClick={() => setSelectedDuration(d)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 30,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isRunning ? "not-allowed" : "pointer",
                    opacity: isRunning ? 0.5 : 1,
                    transition: "all 0.2s",
                    background:
                      selectedDuration === d
                        ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                        : "rgba(255,255,255,0.06)",
                    color: selectedDuration === d ? "#fff" : "#64748B",
                    border:
                      selectedDuration === d
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {d} min
                </button>
              ))}
            </div>

            {/* Circle */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 28,
              }}
            >
              {/* Outer ring glow */}
              <div
                style={{
                  position: "absolute",
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  border: `1px solid ${PHASE_COLORS[phase]}44`,
                  transition: "border-color 0.8s ease",
                }}
                className={phase !== "idle" ? "breathing-outline" : ""}
              />
              <div
                className={
                  phase === "hold"
                    ? "hold-pulse glow-pulse"
                    : phase !== "idle"
                      ? "glow-pulse"
                      : ""
                }
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: PHASE_GRADIENTS[phase],
                  transform: `scale(${circleScale})`,
                  transition: phase === "idle" ? "transform 0.5s ease" : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                  border: `2px solid ${PHASE_COLORS[phase]}55`,
                  boxShadow: `0 0 40px ${PHASE_COLORS[phase]}44, inset 0 0 30px rgba(255,255,255,0.04)`,
                }}
              >
                {/* Phase label */}
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: "#fff",
                    textShadow: `0 0 20px ${PHASE_COLORS[phase]}`,
                    transition: "color 0.5s ease",
                  }}
                >
                  {PHASE_LABELS[phase]}
                </span>

                {/* Countdown */}
                {phaseCountdown !== null && (
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "rgba(255,255,255,0.9)",
                      textShadow: `0 0 30px ${PHASE_COLORS[phase]}`,
                      marginTop: 4,
                    }}
                  >
                    {phaseCountdown}
                  </span>
                )}
              </div>
            </div>

            {/* Phase subtitle */}
            <p
              style={{
                color: "#94A3B8",
                fontSize: 13,
                textAlign: "center",
                marginBottom: 24,
                zIndex: 2,
                position: "relative",
                minHeight: 20,
              }}
            >
              {PHASE_SUBTITLES[phase]}
            </p>

            {/* Session timer */}
            {isRunning && (
              <div
                style={{
                  fontSize: 13,
                  color: "#64748B",
                  zIndex: 2,
                  position: "relative",
                  marginBottom: 16,
                }}
              >
                {formatTime(elapsedSeconds)} / {formatTime(totalDuration)}
              </div>
            )}

            {/* Controls */}
            <div
              style={{
                display: "flex",
                gap: 12,
                zIndex: 2,
                position: "relative",
                marginBottom: 32,
              }}
            >
              {!isRunning ? (
                <button
                  type="button"
                  data-ocid="breathing.primary_button"
                  onClick={() => startSession()}
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 50,
                    padding: "16px 48px",
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
                    letterSpacing: 0.5,
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1)";
                  }}
                >
                  <span style={{ fontSize: 18 }}>▶</span>
                  Start
                </button>
              ) : (
                <button
                  type="button"
                  data-ocid="breathing.secondary_button"
                  onClick={stopSession}
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    color: "#F87171",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 50,
                    padding: "14px 36px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: 0.3,
                  }}
                >
                  ⏹ Stop
                </button>
              )}
            </div>

            {/* Reminder section */}
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                zIndex: 2,
                position: "relative",
              }}
            >
              <button
                type="button"
                data-ocid="breathing.toggle"
                onClick={() => setShowReminder((v) => !v)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  color: "#94A3B8",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>🔔 Breathing Reminders</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>
                  {showReminder ? "▲" : "▼"}
                </span>
              </button>

              {showReminder && (
                <div
                  style={{
                    background: "rgba(20,14,50,0.8)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: "0 0 14px 14px",
                    borderTop: "none",
                    padding: "16px",
                    animation: "fadeInUp 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <Label
                      htmlFor="reminder-switch"
                      style={{
                        color: "#C4B5FD",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Daily Breathing Reminder
                    </Label>
                    <Switch
                      id="reminder-switch"
                      data-ocid="breathing.switch"
                      checked={reminderEnabled}
                      onCheckedChange={setReminderEnabled}
                    />
                  </div>

                  {reminderEnabled && (
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <input
                        type="time"
                        data-ocid="breathing.input"
                        value={reminderTime}
                        onChange={(e) => {
                          setReminderTime(e.target.value);
                          setReminderSaved(false);
                        }}
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(139,92,246,0.3)",
                          borderRadius: 10,
                          padding: "8px 12px",
                          color: "#E2D9FF",
                          fontSize: 15,
                          outline: "none",
                          colorScheme: "dark",
                        }}
                      />
                      <button
                        type="button"
                        data-ocid="breathing.save_button"
                        onClick={saveReminder}
                        style={{
                          background:
                            "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {reminderSaved && reminderEnabled && (
                    <div
                      style={{
                        background: "rgba(139,92,246,0.15)",
                        border: "1px solid rgba(139,92,246,0.3)",
                        borderRadius: 10,
                        padding: "8px 12px",
                        color: "#C4B5FD",
                        fontSize: 12,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        animation: "fadeInUp 0.3s ease",
                      }}
                    >
                      ⏰ Reminder set for {formatReminderTime(reminderTime)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
