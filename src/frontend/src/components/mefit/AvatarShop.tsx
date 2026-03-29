import { Lock, ShoppingBag, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AvatarDisplay, { loadAvatarData, saveAvatarData } from "./AvatarDisplay";

interface AvatarItem {
  id: string;
  name: string;
  category: "clothes" | "accessories" | "premium";
  cost: number;
  emoji: string;
  color: string;
  description: string;
}

const SHOP_ITEMS: AvatarItem[] = [
  {
    id: "a1",
    name: "Blue Outfit",
    category: "clothes",
    cost: 100,
    emoji: "\uD83D\uDC55",
    color: "#3B82F6",
    description: "Clean medical-blue casual wear",
  },
  {
    id: "a2",
    name: "Pink Outfit",
    category: "clothes",
    cost: 150,
    emoji: "\uD83D\uDC58",
    color: "#EC4899",
    description: "Soft pink wellness outfit",
  },
  {
    id: "a3",
    name: "Yoga Wear",
    category: "clothes",
    cost: 200,
    emoji: "\uD83E\uDDD8",
    color: "#8B5CF6",
    description: "Comfortable yoga leggings set",
  },
  {
    id: "a4",
    name: "Maternity Wear",
    category: "clothes",
    cost: 180,
    emoji: "\uD83E\uDD30",
    color: "#10B981",
    description: "Comfortable maternity outfit",
  },
  {
    id: "a5",
    name: "Gold Chain",
    category: "accessories",
    cost: 80,
    emoji: "\uD83D\uDCFF",
    color: "#F59E0B",
    description: "Elegant gold necklace",
  },
  {
    id: "a6",
    name: "Silver Ring",
    category: "accessories",
    cost: 60,
    emoji: "\uD83D\uDC8D",
    color: "#94A3B8",
    description: "Minimalist silver band",
  },
  {
    id: "a7",
    name: "Stethoscope Badge",
    category: "accessories",
    cost: 120,
    emoji: "\uD83E\uDE7A",
    color: "#10B981",
    description: "Medical professional badge",
  },
  {
    id: "a8",
    name: "Sunglasses",
    category: "accessories",
    cost: 90,
    emoji: "\uD83D\uDE0E",
    color: "#F97316",
    description: "Trendy UV400 shades",
  },
  {
    id: "a9",
    name: "Diamond Crown",
    category: "premium",
    cost: 500,
    emoji: "\uD83D\uDC51",
    color: "#A78BFA",
    description: "Rare diamond-encrusted crown",
  },
  {
    id: "a10",
    name: "Premium Aura",
    category: "premium",
    cost: 800,
    emoji: "\u2728",
    color: "#EC4899",
    description: "Glowing energy aura effect",
  },
  {
    id: "a11",
    name: "Holographic Skin",
    category: "premium",
    cost: 650,
    emoji: "\uD83C\uDF08",
    color: "#06B6D4",
    description: "Iridescent holographic look",
  },
  {
    id: "a12",
    name: "Angel Wings",
    category: "premium",
    cost: 1000,
    emoji: "\uD83E\uDEB5",
    color: "#FDE68A",
    description: "Celestial white angel wings",
  },
];

// Maps shop item ID to avatar field update
const ITEM_AVATAR_MAP: Record<
  string,
  { field: "clothes" | "accessories"; value: string }
> = {
  a1: { field: "clothes", value: "casual-blue" },
  a2: { field: "clothes", value: "casual-pink" },
  a3: { field: "clothes", value: "yoga-purple" },
  a4: { field: "clothes", value: "maternity-green" },
  a5: { field: "accessories", value: "necklace" },
  a7: { field: "accessories", value: "necklace" },
  a8: { field: "accessories", value: "sunglasses" },
  a9: { field: "accessories", value: "crown" },
};

type Category = "all" | "clothes" | "accessories" | "premium";

function loadPoints(): number {
  try {
    return Number.parseInt(localStorage.getItem("mefit_rewards") ?? "350");
  } catch {
    return 350;
  }
}
function loadOwned(): string[] {
  try {
    return JSON.parse(
      localStorage.getItem("mefit_avatar_items") ?? "[]",
    ) as string[];
  } catch {
    return [];
  }
}

interface Props {
  onClose: () => void;
}

export default function AvatarShop({ onClose }: Props) {
  const [points, setPoints] = useState(loadPoints);
  const [owned, setOwned] = useState<string[]>(loadOwned);
  const [category, setCategory] = useState<Category>("all");
  const [avatarKey, setAvatarKey] = useState(0);

  const filtered =
    category === "all"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((i) => i.category === category);

  function handleBuy(item: AvatarItem) {
    if (owned.includes(item.id)) return;
    if (points < item.cost) {
      toast.error("Not enough points!");
      return;
    }
    const newPoints = points - item.cost;
    const newOwned = [...owned, item.id];
    setPoints(newPoints);
    setOwned(newOwned);
    localStorage.setItem("mefit_rewards", String(newPoints));
    localStorage.setItem("mefit_avatar_items", JSON.stringify(newOwned));

    // Auto-apply to avatar
    const avatarUpdate = ITEM_AVATAR_MAP[item.id];
    if (avatarUpdate) {
      const existing = loadAvatarData();
      const base = existing ?? {
        face: "medium",
        hair: "long-dark",
        clothes: "casual-blue",
        accessories: "none",
      };
      saveAvatarData({ ...base, [avatarUpdate.field]: avatarUpdate.value });
      setAvatarKey((k) => k + 1);
    }

    toast.success(`\uD83C\uDF89 ${item.name} unlocked!`);
  }

  const tabs: { id: Category; label: string }[] = [
    { id: "all", label: "All" },
    { id: "clothes", label: "Clothes" },
    { id: "accessories", label: "Accessories" },
    { id: "premium", label: "Premium" },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "#0A0F1E" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1))",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}
          >
            <ShoppingBag size={18} color="white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Avatar Shop</h2>
            <div className="flex items-center gap-1">
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <span className="text-yellow-400 text-xs font-bold">
                {points} points
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          data-ocid="avatar_shop.close_button"
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

      {/* Avatar Preview Panel */}
      <div
        className="flex flex-col items-center py-4 px-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
          Your Avatar
        </p>
        <div
          className="rounded-2xl px-6 py-3 flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 0 30px rgba(139,92,246,0.1)",
          }}
        >
          <AvatarDisplay
            size={100}
            avatarKey={avatarKey}
            onCreateAvatar={undefined}
            showPrompt={true}
          />
        </div>
        <p className="text-slate-600 text-[10px] mt-2">
          Buying clothes & accessories updates your avatar instantly
        </p>
      </div>

      <div
        className="flex gap-2 px-5 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            data-ocid="avatar_shop.tab"
            onClick={() => setCategory(t.id)}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{
              background:
                category === t.id
                  ? "linear-gradient(90deg, #8B5CF6, #EC4899)"
                  : "rgba(255,255,255,0.06)",
              color: category === t.id ? "white" : "rgba(255,255,255,0.5)",
              border:
                category === t.id ? "none" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, idx) => {
            const isOwned = owned.includes(item.id);
            const canAfford = points >= item.cost;
            const isPremium = item.category === "premium";
            return (
              <div
                key={item.id}
                data-ocid={`avatar_shop.item.${idx + 1}`}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: isPremium
                    ? `linear-gradient(135deg, ${item.color}22, ${item.color}11)`
                    : "rgba(255,255,255,0.04)",
                  border: isPremium
                    ? `1.5px solid ${item.color}55`
                    : isOwned
                      ? "1.5px solid rgba(16,185,129,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isPremium ? `0 4px 20px ${item.color}20` : "none",
                }}
              >
                {isPremium && (
                  <div
                    className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${item.color}44`, color: item.color }}
                  >
                    PREMIUM
                  </div>
                )}
                <div className="p-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl relative"
                    style={{ background: `${item.color}22` }}
                  >
                    <span>{item.emoji}</span>
                    {!isOwned && (
                      <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                      >
                        <Lock size={16} color="rgba(255,255,255,0.6)" />
                      </div>
                    )}
                  </div>
                  <p className="text-white font-bold text-sm text-center">
                    {item.name}
                  </p>
                  <p className="text-slate-500 text-[10px] text-center mt-0.5 leading-tight">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Star size={11} color="#F59E0B" fill="#F59E0B" />
                      <span className="text-yellow-400 text-xs font-bold">
                        {item.cost}
                      </span>
                    </div>
                    {isOwned ? (
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{
                          background: "rgba(16,185,129,0.2)",
                          color: "#10B981",
                        }}
                      >
                        \u2713 Owned
                      </span>
                    ) : (
                      <button
                        type="button"
                        data-ocid="avatar_shop.primary_button"
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-full transition-all disabled:opacity-40"
                        style={{
                          background: canAfford
                            ? isPremium
                              ? `linear-gradient(90deg, ${item.color}, #8B5CF6)`
                              : "linear-gradient(90deg, #3B82F6, #8B5CF6)"
                            : "rgba(255,255,255,0.1)",
                          color: "white",
                        }}
                      >
                        Buy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-slate-600 text-xs mt-6 pb-4">
          Earn more points by completing health goals, referring friends, and
          streaks!
        </p>
      </div>
    </div>
  );
}
