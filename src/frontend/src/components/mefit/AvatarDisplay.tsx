import { Sparkles } from "lucide-react";

export interface AvatarData {
  face: string;
  hair: string;
  clothes: string;
  accessories: string;
}

export function loadAvatarData(): AvatarData | null {
  try {
    const raw = localStorage.getItem("mefit_avatar");
    if (!raw) return null;
    return JSON.parse(raw) as AvatarData;
  } catch {
    return null;
  }
}

export function saveAvatarData(data: AvatarData) {
  localStorage.setItem("mefit_avatar", JSON.stringify(data));
}

const SKIN_COLORS: Record<
  string,
  { base: string; shadow: string; highlight: string }
> = {
  light: { base: "#FDDBB4", shadow: "#F0C090", highlight: "#FFF0D8" },
  medium: { base: "#F0B885", shadow: "#D99060", highlight: "#FFCFA0" },
  tan: { base: "#D4956A", shadow: "#B87548", highlight: "#E8AF85" },
  brown: { base: "#A0622A", shadow: "#7D4818", highlight: "#C08040" },
  dark: { base: "#6B3A1F", shadow: "#4E2510", highlight: "#8B5030" },
};

const HAIR_COLORS: Record<string, string> = {
  "short-dark": "#1A0A00",
  "short-light": "#C8A060",
  "long-dark": "#1A0A00",
  "long-wavy": "#8B4513",
  curly: "#2D1A00",
  bun: "#1A0A00",
  ponytail: "#8B4513",
  "no-hair": "transparent",
};

const CLOTHES_COLORS: Record<string, { primary: string; secondary: string }> = {
  "casual-blue": { primary: "#3B82F6", secondary: "#2563EB" },
  "casual-pink": { primary: "#EC4899", secondary: "#DB2777" },
  "yoga-purple": { primary: "#8B5CF6", secondary: "#7C3AED" },
  "maternity-green": { primary: "#10B981", secondary: "#059669" },
  "doctor-white": { primary: "#E2E8F0", secondary: "#CBD5E1" },
  "sporty-orange": { primary: "#F97316", secondary: "#EA580C" },
};

interface Props {
  size?: number;
  onCreateAvatar?: () => void;
  showPrompt?: boolean;
  avatarKey?: number;
  userName?: string;
}

export default function AvatarDisplay({
  size = 120,
  onCreateAvatar,
  showPrompt = true,
  avatarKey = 0,
  userName = "",
}: Props) {
  void avatarKey;
  const avatar = loadAvatarData();

  if (!avatar) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          style={{
            width: size,
            height: size * 1.2,
            borderRadius: 16,
            border: "2px dashed rgba(139,92,246,0.4)",
            background: "rgba(139,92,246,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={size * 0.65}
            height={size * 0.65 * 1.2}
            role="img"
            aria-label="Default avatar silhouette"
            viewBox="0 0 60 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="30"
              cy="16"
              r="12"
              fill="rgba(148,163,184,0.25)"
              stroke="rgba(148,163,184,0.4)"
              strokeWidth="1.5"
            />
            <path
              d="M10 58 C10 42 18 36 30 36 C42 36 50 42 50 58"
              fill="rgba(148,163,184,0.2)"
              stroke="rgba(148,163,184,0.4)"
              strokeWidth="1.5"
            />
            <rect
              x="20"
              y="35"
              width="20"
              height="22"
              rx="8"
              fill="rgba(148,163,184,0.2)"
              stroke="rgba(148,163,184,0.4)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        {showPrompt && (
          <div className="text-center">
            <p
              className="text-slate-400 text-xs text-center"
              style={{ maxWidth: size + 20 }}
            >
              Create your avatar to customize your look
            </p>
            {onCreateAvatar && (
              <button
                type="button"
                onClick={onCreateAvatar}
                className="mt-2 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full mx-auto"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                  color: "white",
                }}
              >
                <Sparkles size={11} /> Create
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const skin = SKIN_COLORS[avatar.face] ?? SKIN_COLORS.medium;
  const hairColor = HAIR_COLORS[avatar.hair] ?? "#1A0A00";
  const clothes =
    CLOTHES_COLORS[avatar.clothes] ?? CLOTHES_COLORS["casual-blue"];

  const nameOnShirt = userName ? userName.slice(0, 8) : "";

  return (
    <svg
      role="img"
      aria-label="User avatar"
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={skin.highlight} />
          <stop offset="60%" stopColor={skin.base} />
          <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>
        <radialGradient id="clothesGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={clothes.primary} stopOpacity="1" />
          <stop offset="100%" stopColor={clothes.secondary} stopOpacity="1" />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="rgba(0,0,0,0.3)"
          />
        </filter>
      </defs>

      {/* Body / torso */}
      <path
        d="M28 62 Q20 65 18 80 L16 120 Q30 122 50 122 Q70 122 84 120 L82 80 Q80 65 72 62 Q62 58 50 58 Q38 58 28 62Z"
        fill="url(#clothesGrad)"
        filter="url(#softShadow)"
      />

      {/* Arms */}
      <path
        d="M28 64 Q14 70 12 88 Q14 92 18 90 Q20 78 30 72Z"
        fill="url(#clothesGrad)"
      />
      <path
        d="M72 64 Q86 70 88 88 Q86 92 82 90 Q80 78 70 72Z"
        fill="url(#clothesGrad)"
      />

      {/* Name on t-shirt */}
      {nameOnShirt && (
        <text
          x="50"
          y="88"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill="white"
          fillOpacity="0.8"
          style={{ fontFamily: "sans-serif" }}
        >
          {nameOnShirt}
        </text>
      )}

      {/* Neck */}
      <rect x="44" y="49" width="12" height="12" rx="4" fill="url(#skinGrad)" />

      {/* Head */}
      <ellipse
        cx="50"
        cy="32"
        rx="22"
        ry="24"
        fill="url(#skinGrad)"
        filter="url(#softShadow)"
      />

      {/* Ears */}
      <ellipse cx="28" cy="33" rx="4" ry="5" fill={skin.base} />
      <ellipse cx="72" cy="33" rx="4" ry="5" fill={skin.base} />

      {/* Eyes */}
      <ellipse cx="41" cy="30" rx="4" ry="4.5" fill="white" />
      <ellipse cx="59" cy="30" rx="4" ry="4.5" fill="white" />
      <circle cx="42" cy="31" r="2.5" fill="#1A0A2E" />
      <circle cx="60" cy="31" r="2.5" fill="#1A0A2E" />
      <circle cx="43" cy="30" r="1" fill="white" />
      <circle cx="61" cy="30" r="1" fill="white" />

      {/* Eyebrows */}
      <path
        d="M37 25 Q41 23 45 25"
        stroke="#1A0A2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 25 Q59 23 63 25"
        stroke="#1A0A2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nose */}
      <path
        d="M48 35 Q50 38 52 35"
        stroke={skin.shadow}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth / smile */}
      <path
        d="M43 42 Q50 47 57 42"
        stroke="#C06060"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M44 42 Q50 45 56 42" fill="#E88080" fillOpacity="0.4" />

      {/* Cheeks */}
      <ellipse
        cx="35"
        cy="39"
        rx="5"
        ry="3.5"
        fill="#FF8B8B"
        fillOpacity="0.3"
      />
      <ellipse
        cx="65"
        cy="39"
        rx="5"
        ry="3.5"
        fill="#FF8B8B"
        fillOpacity="0.3"
      />

      {/* HAIR */}
      {avatar.hair !== "no-hair" &&
        (avatar.hair === "short-dark" || avatar.hair === "short-light" ? (
          <path
            d="M28 28 Q28 8 50 8 Q72 8 72 28 Q72 18 50 16 Q28 16 28 28Z"
            fill={hairColor}
          />
        ) : avatar.hair === "long-dark" || avatar.hair === "long-wavy" ? (
          <>
            <path
              d="M28 28 Q28 8 50 8 Q72 8 72 28 Q72 18 50 16 Q28 16 28 28Z"
              fill={hairColor}
            />
            <path
              d="M28 28 Q22 40 24 60 Q28 58 30 50 Q28 40 28 28Z"
              fill={hairColor}
            />
            <path
              d="M72 28 Q78 40 76 60 Q72 58 70 50 Q72 40 72 28Z"
              fill={hairColor}
            />
          </>
        ) : avatar.hair === "curly" ? (
          <>
            <ellipse cx="50" cy="12" rx="22" ry="8" fill={hairColor} />
            <ellipse cx="30" cy="22" rx="6" ry="7" fill={hairColor} />
            <ellipse cx="70" cy="22" rx="6" ry="7" fill={hairColor} />
            <ellipse cx="40" cy="12" rx="8" ry="6" fill={hairColor} />
            <ellipse cx="60" cy="12" rx="8" ry="6" fill={hairColor} />
          </>
        ) : avatar.hair === "bun" ? (
          <>
            <path
              d="M28 28 Q28 8 50 8 Q72 8 72 28 Q72 18 50 16 Q28 16 28 28Z"
              fill={hairColor}
            />
            <circle cx="50" cy="7" r="8" fill={hairColor} />
          </>
        ) : avatar.hair === "ponytail" ? (
          <>
            <path
              d="M28 28 Q28 8 50 8 Q72 8 72 28 Q72 18 50 16 Q28 16 28 28Z"
              fill={hairColor}
            />
            <path
              d="M72 20 Q82 15 84 28 Q82 35 76 32 Q78 25 72 20Z"
              fill={hairColor}
            />
          </>
        ) : null)}

      {/* ACCESSORIES */}
      {avatar.accessories === "glasses" && (
        <>
          <rect
            x="35"
            y="27"
            width="10"
            height="8"
            rx="3"
            stroke="#6366F1"
            strokeWidth="1.5"
            fill="rgba(99,102,241,0.15)"
          />
          <rect
            x="55"
            y="27"
            width="10"
            height="8"
            rx="3"
            stroke="#6366F1"
            strokeWidth="1.5"
            fill="rgba(99,102,241,0.15)"
          />
          <line
            x1="45"
            y1="31"
            x2="55"
            y2="31"
            stroke="#6366F1"
            strokeWidth="1.5"
          />
          <line
            x1="28"
            y1="30"
            x2="35"
            y2="30"
            stroke="#6366F1"
            strokeWidth="1.5"
          />
          <line
            x1="65"
            y1="30"
            x2="72"
            y2="30"
            stroke="#6366F1"
            strokeWidth="1.5"
          />
        </>
      )}
      {avatar.accessories === "sunglasses" && (
        <>
          <rect
            x="34"
            y="27"
            width="12"
            height="8"
            rx="4"
            fill="rgba(0,0,0,0.7)"
            stroke="#F97316"
            strokeWidth="1"
          />
          <rect
            x="54"
            y="27"
            width="12"
            height="8"
            rx="4"
            fill="rgba(0,0,0,0.7)"
            stroke="#F97316"
            strokeWidth="1"
          />
          <line
            x1="46"
            y1="31"
            x2="54"
            y2="31"
            stroke="#F97316"
            strokeWidth="1.5"
          />
          <line
            x1="27"
            y1="30"
            x2="34"
            y2="30"
            stroke="#F97316"
            strokeWidth="1.5"
          />
          <line
            x1="66"
            y1="30"
            x2="73"
            y2="30"
            stroke="#F97316"
            strokeWidth="1.5"
          />
        </>
      )}
      {avatar.accessories === "crown" && (
        <path
          d="M30 12 L35 4 L50 10 L65 4 L70 12 L68 16 L32 16 Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="1"
        />
      )}
      {avatar.accessories === "necklace" && (
        <>
          <path
            d="M38 57 Q50 62 62 57"
            stroke="#F59E0B"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="50" cy="62" r="3" fill="#F59E0B" />
          <circle cx="44" cy="59" r="1.5" fill="#FCD34D" />
          <circle cx="56" cy="59" r="1.5" fill="#FCD34D" />
        </>
      )}
      {avatar.accessories === "earrings" && (
        <>
          <circle cx="27" cy="36" r="2.5" fill="#EC4899" />
          <circle cx="73" cy="36" r="2.5" fill="#EC4899" />
          <line
            x1="27"
            y1="38.5"
            x2="27"
            y2="43"
            stroke="#EC4899"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="73"
            y1="38.5"
            x2="73"
            y2="43"
            stroke="#EC4899"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
