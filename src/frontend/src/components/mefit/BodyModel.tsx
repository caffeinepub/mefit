import { useCallback, useRef, useState } from "react";

interface BodyModelProps {
  sugarLevel: "normal" | "high" | "critical";
  proteinLevel: "normal" | "low";
  hydration: "normal" | "low";
  steps: "active" | "inactive";
  pregnancyWeek?: number;
}

const BODY_KEYFRAMES = `
  @keyframes bodyFloat {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes bodyBreathe {
    0%,100% { transform: scale(1.0); }
    50%     { transform: scale(1.025); }
  }
  @keyframes glowPulse {
    0%,100% { opacity: 0.4; }
    50%     { opacity: 0.85; }
  }
  @keyframes scanLine {
    0%   { top: 0%; opacity: 0.5; }
    50%  { opacity: 0.15; }
    100% { top: 100%; opacity: 0.5; }
  }
  @keyframes healthDot {
    0%,100% { transform: scale(1); opacity: 0.7; }
    50%     { transform: scale(1.4); opacity: 1; }
  }
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = BODY_KEYFRAMES;
  document.head.appendChild(style);
  stylesInjected = true;
}

export default function BodyModel({
  sugarLevel,
  proteinLevel,
  hydration,
  steps,
  pregnancyWeek = 0,
}: BodyModelProps) {
  injectStyles();

  const [rotateY, setRotateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");

  const dragStartX = useRef<number | null>(null);
  const dragStartRotate = useRef<number>(0);

  const sugarColor =
    sugarLevel === "normal"
      ? "#10B981"
      : sugarLevel === "high"
        ? "#F59E0B"
        : "#EF4444";
  const proteinColor = proteinLevel === "normal" ? "#10B981" : "#F59E0B";
  const hydrationColor = hydration === "normal" ? "#3B82F6" : "#F97316";
  const stepsColor = steps === "active" ? "#10B981" : "#9CA3AF";

  const onDragStart = useCallback(
    (clientX: number) => {
      dragStartX.current = clientX;
      dragStartRotate.current = rotateY;
      setIsDragging(true);
    },
    [rotateY],
  );

  const onDragMove = useCallback((clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    setRotateY(
      Math.max(-35, Math.min(35, dragStartRotate.current + delta * 0.4)),
    );
  }, []);

  const onDragEnd = useCallback((clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 80) {
      setSide(delta < 0 ? "back" : "front");
    }
    setRotateY(0);
    dragStartX.current = null;
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    onDragMove(e.clientX);
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    onDragEnd(e.clientX);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    onDragStart(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    onDragMove(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    onDragEnd(e.changedTouches[0].clientX);
  };

  const showBelly = pregnancyWeek > 0;

  const FrontSVG = (
    <svg
      viewBox="0 0 120 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
      role="img"
      aria-label="Human body medical diagram"
    >
      <defs>
        <radialGradient id="skinG" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>
        <radialGradient id="bodyG" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </radialGradient>
      </defs>
      {/* Neck */}
      <rect
        x="51"
        y="80"
        width="18"
        height="22"
        rx="4"
        fill="url(#skinG)"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth="1"
      />
      {/* Head */}
      <ellipse
        cx="60"
        cy="50"
        rx="26"
        ry="30"
        fill="url(#skinG)"
        stroke={
          hoveredPart === "head"
            ? "rgba(147,197,253,0.9)"
            : "rgba(148,163,184,0.6)"
        }
        strokeWidth={hoveredPart === "head" ? 2 : 1.5}
        onClick={() =>
          setTooltip((t) =>
            t === "Head: Check blood pressure and hydration"
              ? null
              : "Head: Check blood pressure and hydration",
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setTooltip((t) =>
              t === "Head: Check blood pressure and hydration"
                ? null
                : "Head: Check blood pressure and hydration",
            );
        }}
        onMouseEnter={() => setHoveredPart("head")}
        onMouseLeave={() => setHoveredPart(null)}
        style={{
          cursor: "pointer",
          filter:
            hoveredPart === "head"
              ? "drop-shadow(0 0 8px rgba(147,197,253,0.7))"
              : undefined,
        }}
      />
      <ellipse cx="50" cy="46" rx="4" ry="5" fill="rgba(30,41,59,0.7)" />
      <ellipse cx="70" cy="46" rx="4" ry="5" fill="rgba(30,41,59,0.7)" />
      <path
        d="M52 60 Q60 65 68 60"
        stroke="rgba(100,116,139,0.6)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Torso */}
      <rect
        x="30"
        y="100"
        width="60"
        height="65"
        rx="10"
        fill="url(#bodyG)"
        stroke={
          hoveredPart === "chest"
            ? "rgba(147,197,253,0.9)"
            : "rgba(148,163,184,0.6)"
        }
        strokeWidth={hoveredPart === "chest" ? 2 : 1.5}
        onClick={() =>
          setTooltip((t) =>
            t === "Chest: Monitor heart rate and breathing"
              ? null
              : "Chest: Monitor heart rate and breathing",
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setTooltip((t) =>
              t === "Chest: Monitor heart rate and breathing"
                ? null
                : "Chest: Monitor heart rate and breathing",
            );
        }}
        onMouseEnter={() => setHoveredPart("chest")}
        onMouseLeave={() => setHoveredPart(null)}
        style={{
          cursor: "pointer",
          filter:
            hoveredPart === "chest"
              ? "drop-shadow(0 0 8px rgba(147,197,253,0.6))"
              : undefined,
        }}
      />
      <path
        d="M48 115 Q60 111 72 115"
        stroke="rgba(100,116,139,0.45)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M46 124 Q60 120 74 124"
        stroke="rgba(100,116,139,0.35)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M46 132 Q60 128 74 132"
        stroke="rgba(100,116,139,0.25)"
        strokeWidth="1"
        fill="none"
      />
      {/* Belly */}
      {showBelly ? (
        <ellipse
          cx="60"
          cy="168"
          rx="28"
          ry="22"
          fill="url(#skinG)"
          stroke={
            hoveredPart === "belly"
              ? "rgba(236,72,153,0.9)"
              : "rgba(236,72,153,0.5)"
          }
          strokeWidth="2"
          strokeDasharray={hoveredPart === "belly" ? "0" : "4 2"}
          onClick={() =>
            setTooltip((t) =>
              t === `Pregnancy Week ${pregnancyWeek}`
                ? null
                : `Pregnancy Week ${pregnancyWeek}`,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              setTooltip((t) =>
                t === `Pregnancy Week ${pregnancyWeek}`
                  ? null
                  : `Pregnancy Week ${pregnancyWeek}`,
              );
          }}
          onMouseEnter={() => setHoveredPart("belly")}
          onMouseLeave={() => setHoveredPart(null)}
          style={{
            cursor: "pointer",
            filter: "drop-shadow(0 0 10px rgba(236,72,153,0.4))",
          }}
        />
      ) : (
        <rect
          x="34"
          y="150"
          width="52"
          height="36"
          rx="8"
          fill="url(#bodyG)"
          stroke={
            hoveredPart === "stomach"
              ? "rgba(147,197,253,0.9)"
              : "rgba(148,163,184,0.55)"
          }
          strokeWidth={hoveredPart === "stomach" ? 2 : 1.5}
          onClick={() =>
            setTooltip((t) =>
              t === "Stomach: Track sugar levels and diet"
                ? null
                : "Stomach: Track sugar levels and diet",
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              setTooltip((t) =>
                t === "Stomach: Track sugar levels and diet"
                  ? null
                  : "Stomach: Track sugar levels and diet",
              );
          }}
          onMouseEnter={() => setHoveredPart("stomach")}
          onMouseLeave={() => setHoveredPart(null)}
          style={{
            cursor: "pointer",
            filter:
              hoveredPart === "stomach"
                ? "drop-shadow(0 0 8px rgba(147,197,253,0.6))"
                : undefined,
          }}
        />
      )}
      {/* Arms */}
      <rect
        x="8"
        y="100"
        width="20"
        height="70"
        rx="8"
        fill="url(#skinG)"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth="1.5"
        onClick={() =>
          setTooltip((t) =>
            t === "Left Arm: Activity tracking"
              ? null
              : "Left Arm: Activity tracking",
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setTooltip((t) =>
              t === "Left Arm: Activity tracking"
                ? null
                : "Left Arm: Activity tracking",
            );
        }}
        onMouseEnter={() => setHoveredPart("arm-l")}
        onMouseLeave={() => setHoveredPart(null)}
        style={{
          cursor: "pointer",
          filter:
            hoveredPart === "arm-l"
              ? "drop-shadow(0 0 6px rgba(147,197,253,0.5))"
              : undefined,
        }}
      />
      <rect
        x="92"
        y="100"
        width="20"
        height="70"
        rx="8"
        fill="url(#skinG)"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth="1.5"
        onClick={() =>
          setTooltip((t) =>
            t === "Right Arm: Blood pressure site"
              ? null
              : "Right Arm: Blood pressure site",
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setTooltip((t) =>
              t === "Right Arm: Blood pressure site"
                ? null
                : "Right Arm: Blood pressure site",
            );
        }}
        onMouseEnter={() => setHoveredPart("arm-r")}
        onMouseLeave={() => setHoveredPart(null)}
        style={{
          cursor: "pointer",
          filter:
            hoveredPart === "arm-r"
              ? "drop-shadow(0 0 6px rgba(147,197,253,0.5))"
              : undefined,
        }}
      />
      {/* Legs */}
      <rect
        x="33"
        y="188"
        width="24"
        height="82"
        rx="8"
        fill="url(#skinG)"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth="1.5"
        onClick={() =>
          setTooltip((t) =>
            t === "Left Leg: Step count & circulation"
              ? null
              : "Left Leg: Step count & circulation",
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setTooltip((t) =>
              t === "Left Leg: Step count & circulation"
                ? null
                : "Left Leg: Step count & circulation",
            );
        }}
        onMouseEnter={() => setHoveredPart("leg-l")}
        onMouseLeave={() => setHoveredPart(null)}
        style={{
          cursor: "pointer",
          filter:
            hoveredPart === "leg-l"
              ? "drop-shadow(0 0 6px rgba(147,197,253,0.5))"
              : undefined,
        }}
      />
      <rect
        x="63"
        y="188"
        width="24"
        height="82"
        rx="8"
        fill="url(#skinG)"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth="1.5"
        onClick={() =>
          setTooltip((t) =>
            t === "Right Leg: Step count & circulation"
              ? null
              : "Right Leg: Step count & circulation",
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setTooltip((t) =>
              t === "Right Leg: Step count & circulation"
                ? null
                : "Right Leg: Step count & circulation",
            );
        }}
        onMouseEnter={() => setHoveredPart("leg-r")}
        onMouseLeave={() => setHoveredPart(null)}
        style={{
          cursor: "pointer",
          filter:
            hoveredPart === "leg-r"
              ? "drop-shadow(0 0 6px rgba(147,197,253,0.5))"
              : undefined,
        }}
      />
      {/* Health indicator dots */}
      <circle
        cx="60"
        cy="140"
        r="5"
        fill={sugarColor}
        style={{ animation: "healthDot 2s ease-in-out infinite" }}
      />
      <circle
        cx="40"
        cy="33"
        r="4"
        fill={hydrationColor}
        style={{ animation: "healthDot 2.5s ease-in-out infinite" }}
      />
      <circle
        cx="80"
        cy="128"
        r="4"
        fill={proteinColor}
        style={{ animation: "healthDot 3s ease-in-out infinite" }}
      />
      <circle
        cx="45"
        cy="238"
        r="4"
        fill={stepsColor}
        style={{ animation: "healthDot 3.5s ease-in-out infinite" }}
      />
    </svg>
  );

  const BackSVG = (
    <svg
      viewBox="0 0 120 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
      role="img"
      aria-label="Human body back view medical diagram"
    >
      <defs>
        <radialGradient id="backG" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
      </defs>
      <rect
        x="51"
        y="80"
        width="18"
        height="22"
        rx="4"
        fill="url(#backG)"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth="1"
      />
      <ellipse
        cx="60"
        cy="50"
        rx="26"
        ry="30"
        fill="url(#backG)"
        stroke="rgba(148,163,184,0.6)"
        strokeWidth="1.5"
      />
      <rect
        x="30"
        y="100"
        width="60"
        height="105"
        rx="10"
        fill="url(#backG)"
        stroke="rgba(148,163,184,0.55)"
        strokeWidth="1.5"
      />
      <line
        x1="60"
        y1="106"
        x2="60"
        y2="200"
        stroke="rgba(100,116,139,0.35)"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <rect
        x="8"
        y="100"
        width="20"
        height="70"
        rx="8"
        fill="url(#backG)"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="1.5"
      />
      <rect
        x="92"
        y="100"
        width="20"
        height="70"
        rx="8"
        fill="url(#backG)"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="1.5"
      />
      <rect
        x="33"
        y="188"
        width="24"
        height="82"
        rx="8"
        fill="url(#backG)"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="1.5"
      />
      <rect
        x="63"
        y="188"
        width="24"
        height="82"
        rx="8"
        fill="url(#backG)"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="1.5"
      />
      <text
        x="60"
        y="158"
        textAnchor="middle"
        fill="rgba(148,163,184,0.35)"
        fontSize="7"
        fontFamily="sans-serif"
      >
        BACK VIEW
      </text>
    </svg>
  );

  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background:
          "linear-gradient(160deg, #080c1a 0%, #0d1033 50%, #12082a 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(148,163,184,0.12)",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(148,163,184,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm" style={{ color: "#93C5FD" }}>
            Body Health Map
          </h3>
          <p className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>
            Medical viewer &middot; drag to rotate
          </p>
        </div>
        <div className="flex gap-2">
          {(["front", "back"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSide(s);
                setRotateY(0);
              }}
              className="text-[10px] font-bold px-3 py-1 rounded-full transition-all capitalize"
              style={{
                background:
                  side === s
                    ? "rgba(59,130,246,0.25)"
                    : "rgba(255,255,255,0.06)",
                color: side === s ? "#93C5FD" : "rgba(255,255,255,0.35)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          perspective: "600px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 140,
            height: 290,
            transform: `rotateY(${rotateY}deg)`,
            transition: isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            animation: "bodyFloat 6s ease-in-out infinite",
            position: "relative",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Glow aura */}
          <div
            style={{
              position: "absolute",
              inset: "-24px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(148,163,184,0.1) 0%, transparent 70%)",
              animation: "glowPulse 4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          {/* Breathing wrapper */}
          <div
            style={{
              animation: "bodyBreathe 4s ease-in-out infinite",
              width: "100%",
              height: "100%",
            }}
          >
            {side === "front" ? FrontSVG : BackSVG}
          </div>
          {/* Scan line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, rgba(147,197,253,0.35), transparent)",
              animation: "scanLine 4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {tooltip && (
        <div
          className="mt-4 rounded-2xl px-4 py-3 text-sm text-center"
          style={{
            background: "rgba(147,197,253,0.08)",
            border: "1px solid rgba(147,197,253,0.2)",
            color: "#93C5FD",
          }}
        >
          \uD83D\uDCA1 {tooltip}
          <button
            type="button"
            onClick={() => setTooltip(null)}
            className="ml-2 text-xs opacity-40 hover:opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 justify-center">
        {[
          { color: hydrationColor, label: "Hydration" },
          { color: sugarColor, label: "Sugar" },
          { color: proteinColor, label: "Protein" },
          { color: stepsColor, label: "Activity" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: color, boxShadow: `0 0 5px ${color}` }}
            />
            <span
              className="text-[10px]"
              style={{ color: "rgba(148,163,184,0.65)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {showBelly && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(90deg, #8B5CF6, #EC4899)" }}
          >
            Week {pregnancyWeek}
          </span>
          <span className="text-slate-500 text-xs">
            Pregnancy tracking active
          </span>
        </div>
      )}
    </div>
  );
}
