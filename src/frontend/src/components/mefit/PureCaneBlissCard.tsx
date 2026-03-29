import { ExternalLink, Leaf } from "lucide-react";

interface Props {
  className?: string;
}

export default function PureCaneBlissCard({ className = "" }: Props) {
  function handleShopNow() {
    window.open(
      "https://purecanebliss.renderforestsites.com",
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div
      className={`rounded-3xl p-5 relative overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(245,158,11,0.12) 100%)",
        border: "1px solid rgba(16,185,129,0.3)",
        boxShadow: "0 8px 32px rgba(16,185,129,0.15)",
      }}
    >
      <div
        className="absolute top-3 right-4 opacity-10"
        style={{ color: "#10B981" }}
      >
        <Leaf size={60} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{
            background: "rgba(249,115,22,0.15)",
            color: "#F97316",
            border: "1px solid rgba(249,115,22,0.3)",
          }}
        >
          ✦ Premium Health Suggestion
        </span>
        <span className="text-white/30 text-[10px]">Sponsored</span>
      </div>
      <h3
        className="text-white font-bold text-xl mb-0.5"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        Pure Cane Bliss
      </h3>
      <p className="text-emerald-400 text-sm font-medium mb-3">
        The Natural Sweetener
      </p>
      <p className="text-white/60 text-sm leading-relaxed mb-5">
        Made from pure sugarcane, it&apos;s a healthier alternative to refined
        sugar — lower glycemic index, no artificial additives.
      </p>
      <button
        type="button"
        data-ocid="purecane.primary_button"
        onClick={handleShopNow}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.97]"
        style={{
          background: "linear-gradient(90deg, #10B981, #059669)",
          boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
        }}
      >
        Shop Now <ExternalLink size={14} />
      </button>
    </div>
  );
}
