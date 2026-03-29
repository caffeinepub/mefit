import { ExternalLink, Play, Star, X } from "lucide-react";
import { useState } from "react";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  channel: string;
  color: string;
  isInfluencer?: boolean;
  influencerUrl?: string;
}

const DEMO_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "5 Yoga Poses for Pregnancy",
    category: "Wellness",
    duration: "8:24",
    channel: "Mama on a Mission",
    color: "#8B5CF6",
  },
  {
    id: "v2",
    title: "Healthy Diet in Third Trimester",
    category: "Nutrition",
    duration: "12:10",
    channel: "Dr. Rahul Mehta",
    color: "#10B981",
  },
  {
    id: "v3",
    title: "Morning Routine for Moms",
    category: "Lifestyle",
    duration: "6:45",
    channel: "MeFit",
    color: "#3B82F6",
  },
  {
    id: "v4",
    title: "Managing Gestational Diabetes",
    category: "Health",
    duration: "15:30",
    channel: "Dr. Anjali Sharma",
    color: "#EF4444",
  },
  {
    id: "v5",
    title: "Breathing Exercises for Labor",
    category: "Pregnancy",
    duration: "9:15",
    channel: "Meera Iyer",
    color: "#EC4899",
  },
  {
    id: "v6",
    title: "Postpartum Recovery Tips",
    category: "Recovery",
    duration: "11:00",
    channel: "Dr. Priya Nair",
    color: "#F59E0B",
  },
];

function getInfluencerCard(): VideoItem | null {
  try {
    const raw = localStorage.getItem("mefit_influencer_link");
    if (!raw) return null;
    const data = JSON.parse(raw) as { url?: string; name?: string };
    if (!data.url) return null;
    const name = data.name || data.url;
    return {
      id: "inf1",
      title: `${name} Health Channel`,
      category: "Influencer",
      duration: "Live",
      channel: name,
      color: "#EC4899",
      isInfluencer: true,
      influencerUrl: data.url,
    };
  } catch {
    return null;
  }
}

export default function ReelsSection() {
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const influencerCard = getInfluencerCard();
  const allVideos = influencerCard
    ? [influencerCard, ...DEMO_VIDEOS]
    : DEMO_VIDEOS;

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#818CF8" }}
          >
            🎬 Health Reels
          </span>
          <span
            className="flex-1 h-px"
            style={{ background: "rgba(129,140,248,0.2)" }}
          />
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {allVideos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelected(v)}
              data-ocid={`reels.item.${i + 1}`}
              className="flex-shrink-0 w-44 rounded-2xl overflow-hidden text-left relative"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${v.isInfluencer ? "rgba(236,72,153,0.4)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {v.isInfluencer && (
                <div
                  className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #EC4899, #8B5CF6)",
                  }}
                >
                  <Star size={8} color="white" fill="white" />
                  <span className="text-[8px] font-bold text-white">
                    INFLUENCER
                  </span>
                </div>
              )}
              <div
                className="w-full h-24 flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${v.color}44, ${v.color}22)`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Play size={18} color="white" fill="white" />
                </div>
                <span
                  className="absolute bottom-2 right-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  {v.duration}
                </span>
                <span
                  className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${v.color}55`, color: "white" }}
                >
                  {v.category}
                </span>
              </div>
              <div className="p-3">
                <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                  {v.title}
                </p>
                <p className="text-slate-500 text-[10px] mt-1">{v.channel}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          role="presentation"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: "#0D1B2A",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-ocid="reels.modal"
          >
            <div
              className="w-full h-48 flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${selected.color}66, ${selected.color}33)`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Play size={28} color="white" fill="white" />
              </div>
              <span
                className="absolute top-2 right-2 text-xs font-bold text-white px-2 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                {selected.duration}
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                data-ocid="reels.close_button"
                className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.4)" }}
              >
                <X size={14} color="white" />
              </button>
            </div>
            <div className="p-5">
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full"
                style={{
                  background: `${selected.color}33`,
                  color: selected.color,
                }}
              >
                {selected.category}
              </span>
              <h3 className="text-white font-bold mt-2 mb-1">
                {selected.title}
              </h3>
              <p className="text-slate-400 text-xs mb-1">
                By {selected.channel}
              </p>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                {selected.isInfluencer
                  ? "Follow this influencer for health, pregnancy and wellness content curated for you."
                  : `Expert-curated content on ${selected.category.toLowerCase()} for mothers and pregnant women.`}
              </p>
              {selected.isInfluencer && selected.influencerUrl ? (
                <a
                  href={selected.influencerUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-ocid="reels.primary_button"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                  }}
                >
                  <ExternalLink size={14} /> Follow Influencer
                </a>
              ) : (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selected.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  data-ocid="reels.primary_button"
                  className="block w-full py-3 rounded-2xl text-white font-bold text-sm text-center"
                  style={{
                    background: `linear-gradient(135deg, ${selected.color}, #8B5CF6)`,
                  }}
                >
                  ▶ Watch on YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
