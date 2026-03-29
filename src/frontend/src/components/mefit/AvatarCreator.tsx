import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AvatarDisplay, {
  type AvatarData,
  loadAvatarData,
  saveAvatarData,
} from "./AvatarDisplay";

interface Props {
  onClose: () => void;
  onSave: () => void;
}

type Tab = "face" | "hair" | "clothes" | "accessories";

const DEFAULT_AVATAR: AvatarData = {
  face: "medium",
  hair: "long-dark",
  clothes: "casual-blue",
  accessories: "none",
};

const FACE_OPTIONS = [
  { id: "light", label: "Light", color: "#FDDBB4" },
  { id: "medium", label: "Medium", color: "#F0B885" },
  { id: "tan", label: "Tan", color: "#D4956A" },
  { id: "brown", label: "Brown", color: "#A0622A" },
  { id: "dark", label: "Dark", color: "#6B3A1F" },
];

const HAIR_OPTIONS = [
  { id: "short-dark", label: "Short Dark", emoji: "💇" },
  { id: "short-light", label: "Short Light", emoji: "👱" },
  { id: "long-dark", label: "Long Dark", emoji: "👩" },
  { id: "long-wavy", label: "Long Wavy", emoji: "🌊" },
  { id: "curly", label: "Curly", emoji: "🌀" },
  { id: "bun", label: "Bun", emoji: "🍩" },
  { id: "ponytail", label: "Ponytail", emoji: "🎀" },
  { id: "no-hair", label: "No Hair", emoji: "🧑‍🦲" },
];

const CLOTHES_OPTIONS = [
  { id: "casual-blue", label: "Casual Blue", color: "#3B82F6", emoji: "👕" },
  { id: "casual-pink", label: "Casual Pink", color: "#EC4899", emoji: "👘" },
  { id: "yoga-purple", label: "Yoga Wear", color: "#8B5CF6", emoji: "🧘" },
  { id: "maternity-green", label: "Maternity", color: "#10B981", emoji: "🤰" },
  { id: "doctor-white", label: "Doctor White", color: "#CBD5E1", emoji: "🥼" },
  { id: "sporty-orange", label: "Sporty", color: "#F97316", emoji: "🏃" },
];

const ACCESSORIES_OPTIONS = [
  { id: "none", label: "None", emoji: "✖️" },
  { id: "glasses", label: "Glasses", emoji: "👓" },
  { id: "sunglasses", label: "Sunglasses", emoji: "😎" },
  { id: "crown", label: "Crown", emoji: "👑" },
  { id: "necklace", label: "Necklace", emoji: "📿" },
  { id: "earrings", label: "Earrings", emoji: "💎" },
];

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "face", label: "Face", emoji: "😊" },
  { id: "hair", label: "Hair", emoji: "💇" },
  { id: "clothes", label: "Clothes", emoji: "👗" },
  { id: "accessories", label: "Accessories", emoji: "✨" },
];

export default function AvatarCreator({ onClose, onSave }: Props) {
  const existing = loadAvatarData();
  const [avatar, setAvatar] = useState<AvatarData>(existing ?? DEFAULT_AVATAR);
  const [activeTab, setActiveTab] = useState<Tab>("face");
  const [previewKey, setPreviewKey] = useState(0);

  function update(field: keyof AvatarData, value: string) {
    setAvatar((prev) => ({ ...prev, [field]: value }));
    setPreviewKey((k) => k + 1);
  }

  function handleSave() {
    saveAvatarData(avatar);
    toast.success("✨ Avatar saved!");
    onSave();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      data-ocid="avatar_creator.modal"
    >
      <div
        className="flex flex-col h-full"
        style={{
          background: "linear-gradient(180deg, #0D1020 0%, #0A0F1E 100%)",
          maxWidth: 480,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1))",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <h2 className="text-white font-bold text-lg">Avatar Creator</h2>
            <p className="text-slate-400 text-xs">Customize your look</p>
          </div>
          <button
            type="button"
            data-ocid="avatar_creator.close_button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <X size={16} color="white" />
          </button>
        </div>

        {/* Live Preview */}
        <div
          className="flex flex-col items-center py-5 flex-shrink-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="rounded-3xl p-4 flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 40px rgba(139,92,246,0.15)",
            }}
          >
            {/* Render live preview by temporarily saving to a preview state */}
            <LiveAvatarPreview avatar={avatar} key={previewKey} />
          </div>
          <p className="text-slate-500 text-xs mt-2">Live Preview</p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              data-ocid="avatar_creator.tab"
              onClick={() => setActiveTab(t.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background:
                  activeTab === t.id
                    ? "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(236,72,153,0.3))"
                    : "rgba(255,255,255,0.04)",
                border:
                  activeTab === t.id
                    ? "1px solid rgba(139,92,246,0.5)"
                    : "1px solid rgba(255,255,255,0.06)",
                color: activeTab === t.id ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Options Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activeTab === "face" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Skin Tone
              </p>
              <div className="grid grid-cols-5 gap-2">
                {FACE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-ocid="avatar_creator.button"
                    onClick={() => update("face", opt.id)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
                    style={{
                      background:
                        avatar.face === opt.id
                          ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))"
                          : "rgba(255,255,255,0.04)",
                      border:
                        avatar.face === opt.id
                          ? "2px solid #8B5CF6"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: opt.color,
                        boxShadow: `0 0 8px ${opt.color}60`,
                      }}
                    />
                    <span className="text-white text-[9px] font-semibold">
                      {opt.label}
                    </span>
                    {avatar.face === opt.id && (
                      <Check size={10} color="#8B5CF6" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "hair" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Hair Style
              </p>
              <div className="grid grid-cols-4 gap-2">
                {HAIR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-ocid="avatar_creator.button"
                    onClick={() => update("hair", opt.id)}
                    className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all"
                    style={{
                      background:
                        avatar.hair === opt.id
                          ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))"
                          : "rgba(255,255,255,0.04)",
                      border:
                        avatar.hair === opt.id
                          ? "2px solid #8B5CF6"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-white text-[9px] font-semibold text-center leading-tight">
                      {opt.label}
                    </span>
                    {avatar.hair === opt.id && (
                      <Check size={10} color="#8B5CF6" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "clothes" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Outfit Style
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CLOTHES_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-ocid="avatar_creator.button"
                    onClick={() => update("clothes", opt.id)}
                    className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-all"
                    style={{
                      background:
                        avatar.clothes === opt.id
                          ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))"
                          : "rgba(255,255,255,0.04)",
                      border:
                        avatar.clothes === opt.id
                          ? "2px solid #8B5CF6"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${opt.color}33` }}
                    >
                      {opt.emoji}
                    </div>
                    <span className="text-white text-[9px] font-semibold text-center leading-tight">
                      {opt.label}
                    </span>
                    {avatar.clothes === opt.id && (
                      <Check size={10} color="#8B5CF6" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "accessories" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Accessory
              </p>
              <div className="grid grid-cols-3 gap-2">
                {ACCESSORIES_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-ocid="avatar_creator.button"
                    onClick={() => update("accessories", opt.id)}
                    className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-all"
                    style={{
                      background:
                        avatar.accessories === opt.id
                          ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))"
                          : "rgba(255,255,255,0.04)",
                      border:
                        avatar.accessories === opt.id
                          ? "2px solid #8B5CF6"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-white text-[9px] font-semibold text-center leading-tight">
                      {opt.label}
                    </span>
                    {avatar.accessories === opt.id && (
                      <Check size={10} color="#8B5CF6" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div
          className="px-4 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            data-ocid="avatar_creator.save_button"
            onClick={handleSave}
            className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
            }}
          >
            <Check size={16} /> Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}

// Internal component that renders avatar from in-memory data (not localStorage)
function LiveAvatarPreview({ avatar }: { avatar: AvatarData }) {
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
  const CLOTHES_COLORS: Record<string, { primary: string; secondary: string }> =
    {
      "casual-blue": { primary: "#3B82F6", secondary: "#2563EB" },
      "casual-pink": { primary: "#EC4899", secondary: "#DB2777" },
      "yoga-purple": { primary: "#8B5CF6", secondary: "#7C3AED" },
      "maternity-green": { primary: "#10B981", secondary: "#059669" },
      "doctor-white": { primary: "#E2E8F0", secondary: "#CBD5E1" },
      "sporty-orange": { primary: "#F97316", secondary: "#EA580C" },
    };

  const skin = SKIN_COLORS[avatar.face] ?? SKIN_COLORS.medium;
  const hairColor = HAIR_COLORS[avatar.hair] ?? "#1A0A00";
  const clothes =
    CLOTHES_COLORS[avatar.clothes] ?? CLOTHES_COLORS["casual-blue"];

  return (
    <svg
      width="90"
      height="117"
      role="img"
      aria-label="Avatar preview"
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="skinGradP" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={skin.highlight} />
          <stop offset="60%" stopColor={skin.base} />
          <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>
        <radialGradient id="clothesGradP" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={clothes.primary} />
          <stop offset="100%" stopColor={clothes.secondary} />
        </radialGradient>
      </defs>
      <path
        d="M28 62 Q20 65 18 80 L16 120 Q30 122 50 122 Q70 122 84 120 L82 80 Q80 65 72 62 Q62 58 50 58 Q38 58 28 62Z"
        fill="url(#clothesGradP)"
      />
      <path
        d="M28 64 Q14 70 12 88 Q14 92 18 90 Q20 78 30 72Z"
        fill="url(#clothesGradP)"
      />
      <path
        d="M72 64 Q86 70 88 88 Q86 92 82 90 Q80 78 70 72Z"
        fill="url(#clothesGradP)"
      />
      <rect
        x="44"
        y="49"
        width="12"
        height="12"
        rx="4"
        fill="url(#skinGradP)"
      />
      <ellipse cx="50" cy="32" rx="22" ry="24" fill="url(#skinGradP)" />
      <ellipse cx="28" cy="33" rx="4" ry="5" fill={skin.base} />
      <ellipse cx="72" cy="33" rx="4" ry="5" fill={skin.base} />
      <ellipse cx="41" cy="30" rx="4" ry="4.5" fill="white" />
      <ellipse cx="59" cy="30" rx="4" ry="4.5" fill="white" />
      <circle cx="42" cy="31" r="2.5" fill="#1A0A2E" />
      <circle cx="60" cy="31" r="2.5" fill="#1A0A2E" />
      <circle cx="43" cy="30" r="1" fill="white" />
      <circle cx="61" cy="30" r="1" fill="white" />
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
      <path
        d="M48 35 Q50 38 52 35"
        stroke={skin.shadow}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M43 42 Q50 47 57 42"
        stroke="#C06060"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
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
      {avatar.hair !== "no-hair" && (
        <>
          {(avatar.hair === "short-dark" ||
            avatar.hair === "short-light" ||
            avatar.hair === "bun" ||
            avatar.hair === "ponytail") && (
            <path
              d="M28 28 Q28 8 50 8 Q72 8 72 28 Q72 18 50 16 Q28 16 28 28Z"
              fill={hairColor}
            />
          )}
          {(avatar.hair === "long-dark" || avatar.hair === "long-wavy") && (
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
          )}
          {avatar.hair === "curly" && (
            <>
              <ellipse cx="50" cy="12" rx="22" ry="8" fill={hairColor} />
              <ellipse cx="30" cy="22" rx="6" ry="7" fill={hairColor} />
              <ellipse cx="70" cy="22" rx="6" ry="7" fill={hairColor} />
            </>
          )}
          {avatar.hair === "bun" && (
            <circle cx="50" cy="7" r="8" fill={hairColor} />
          )}
          {avatar.hair === "ponytail" && (
            <path
              d="M72 20 Q82 15 84 28 Q82 35 76 32 Q78 25 72 20Z"
              fill={hairColor}
            />
          )}
        </>
      )}
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
        </>
      )}
      {avatar.accessories === "earrings" && (
        <>
          <circle cx="27" cy="36" r="2.5" fill="#EC4899" />
          <circle cx="73" cy="36" r="2.5" fill="#EC4899" />
        </>
      )}
    </svg>
  );
}
