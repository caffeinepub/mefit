import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  BodySnapshot,
  Challenge,
  MediaItem,
  MotivationalQuote,
  UserProfile,
  WeightEntry,
} from "../types";

interface Props {
  user: UserProfile;
  mediaItems: MediaItem[];
  quotes: MotivationalQuote[];
  challenges: Challenge[];
  snapshots: BodySnapshot[];
  weightHistory: WeightEntry[];
  onAddMedia: (m: Omit<MediaItem, "id">) => void;
  onDeleteMedia: (id: string) => void;
  onAddQuote: (q: Omit<MotivationalQuote, "id">) => void;
  onDeleteQuote: (id: string) => void;
  onAddChallenge: (c: Omit<Challenge, "id">) => void;
  onToggleChallenge: (id: string) => void;
  onAddSnapshot: (s: Omit<BodySnapshot, "id">) => void;
}

const VIDEO_THUMB_BG = ["bg-purple-200", "bg-pink-200", "bg-indigo-200"];

export default function MediaProgress({
  user,
  mediaItems,
  quotes,
  challenges,
  snapshots,
  weightHistory,
  onAddMedia,
  onDeleteMedia,
  onAddQuote,
  onDeleteQuote,
  onAddChallenge,
  onToggleChallenge,
  onAddSnapshot,
}: Props) {
  const [sub, setSub] = useState<"progress" | "feed" | "manage">("progress");
  const [mediaForm, setMediaForm] = useState({
    mediaType: "tip",
    title: "",
    content: "",
    link: "",
  });
  const [quoteForm, setQuoteForm] = useState({ text: "", author: "" });
  const [challengeForm, setChallengeForm] = useState({
    title: "",
    description: "",
    targetValue: "",
    unit: "",
  });

  const chartData = weightHistory.map((w) => ({
    date: w.date.slice(5),
    weight: w.weight,
    bmi: w.bmi,
  }));

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Media & Progress</h2>

      {/* Sub-tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
        {(["progress", "feed", "manage"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setSub(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              sub === t ? "bg-white shadow-sm text-[#B58AD6]" : "text-gray-500"
            }`}
          >
            {t === "manage"
              ? "Manage Content"
              : t === "feed"
                ? "Media Feed"
                : "Progress"}
          </button>
        ))}
      </div>

      {/* Progress tab */}
      {sub === "progress" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-700 mb-4">Weight Over Time</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#C7A1E3"
                  strokeWidth={2}
                  dot={{ fill: "#C7A1E3" }}
                  name="Weight (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-700 mb-4">BMI Over Time</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#F0A0A0"
                  strokeWidth={2}
                  dot={{ fill: "#F0A0A0" }}
                  name="BMI"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-700">Body Snapshots</h3>
              <label className="text-xs px-3 py-1.5 bg-[#C7A1E3] text-white rounded-xl font-medium cursor-pointer">
                + Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      onAddSnapshot({
                        userId: user.id,
                        date: new Date().toISOString().split("T")[0],
                        photoUrl: url,
                      });
                    }
                  }}
                />
              </label>
            </div>
            {snapshots.filter((s) => s.userId === user.id).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                No snapshots yet. Upload your first one!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {snapshots
                  .filter((s) => s.userId === user.id)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                    >
                      <img
                        src={s.photoUrl}
                        alt={s.date}
                        className="w-full h-full object-cover"
                      />
                      <p className="text-[10px] text-center text-gray-400 mt-0.5">
                        {s.date}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media feed */}
      {sub === "feed" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mediaItems.map((item, i) =>
              item.mediaType === "tip" ? (
                <div
                  key={item.id}
                  className={`rounded-2xl p-5 ${
                    i % 3 === 0
                      ? "bg-[#EDE9F7]"
                      : i % 3 === 1
                        ? "bg-[#D8F2E9]"
                        : "bg-[#F9EEF3]"
                  }`}
                >
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    💡 Tip
                  </span>
                  <h4 className="font-bold text-gray-800 mt-1 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ) : (
                <div
                  key={item.id}
                  className={"rounded-2xl overflow-hidden shadow-sm"}
                >
                  <div
                    className={`h-32 ${VIDEO_THUMB_BG[i % 3]} flex items-center justify-center relative`}
                  >
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xl">▶️</span>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                      Mama on a Mission
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <h4 className="font-bold text-gray-800 text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.content}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#B58AD6] mt-1 inline-block hover:underline"
                      >
                        Watch video →
                      </a>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Manage content */}
      {sub === "manage" && (
        <div className="space-y-6">
          {/* Media items */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-700 mb-3">Media Items</h3>
            <div className="space-y-2 mb-4">
              {mediaItems.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 bg-gray-50 rounded-xl p-3"
                >
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {m.mediaType}
                  </span>
                  <p className="text-sm flex-1 truncate text-gray-700">
                    {m.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => onDeleteMedia(m.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <details className="bg-purple-50 rounded-xl">
              <summary className="p-3 text-sm font-medium text-[#9B7BC4] cursor-pointer">
                + Add media item
              </summary>
              <div className="p-3 pt-0 space-y-2">
                <select
                  value={mediaForm.mediaType}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, mediaType: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="tip">Tip</option>
                  <option value="video">Video</option>
                </select>
                <input
                  placeholder="Title"
                  value={mediaForm.title}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, title: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <textarea
                  placeholder="Content/description"
                  value={mediaForm.content}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, content: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  rows={2}
                />
                {mediaForm.mediaType === "video" && (
                  <input
                    placeholder="YouTube link (optional)"
                    value={mediaForm.link}
                    onChange={(e) =>
                      setMediaForm({ ...mediaForm, link: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (mediaForm.title && mediaForm.content) {
                      onAddMedia({
                        mediaType:
                          mediaForm.mediaType as MediaItem["mediaType"],
                        title: mediaForm.title,
                        content: mediaForm.content,
                        link: mediaForm.link || undefined,
                      });
                      setMediaForm({
                        mediaType: "tip",
                        title: "",
                        content: "",
                        link: "",
                      });
                    }
                  }}
                  className="w-full py-2 bg-[#C7A1E3] text-white rounded-xl text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </details>
          </div>

          {/* Motivational quotes */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-700 mb-3">
              Motivational Quotes
            </h3>
            <div className="space-y-2 mb-4">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="flex items-start gap-2 bg-pink-50 rounded-xl p-3"
                >
                  <p className="text-sm flex-1 text-gray-700 italic">
                    "{q.text.slice(0, 60)}
                    {q.text.length > 60 ? "..." : ""}"
                  </p>
                  <button
                    type="button"
                    onClick={() => onDeleteQuote(q.id)}
                    className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <details className="bg-pink-50 rounded-xl">
              <summary className="p-3 text-sm font-medium text-pink-700 cursor-pointer">
                + Add quote
              </summary>
              <div className="p-3 pt-0 space-y-2">
                <textarea
                  placeholder="Quote text..."
                  value={quoteForm.text}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, text: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  rows={2}
                />
                <input
                  placeholder="Author"
                  value={quoteForm.author}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, author: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (quoteForm.text && quoteForm.author) {
                      onAddQuote({
                        text: quoteForm.text,
                        author: quoteForm.author,
                      });
                      setQuoteForm({ text: "", author: "" });
                    }
                  }}
                  className="w-full py-2 bg-pink-400 text-white rounded-xl text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </details>
          </div>

          {/* Challenges */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-700 mb-3">Challenges</h3>
            <div className="space-y-2 mb-4">
              {challenges.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 bg-green-50 rounded-xl p-3"
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${c.isActive ? "bg-green-400" : "bg-gray-300"}`}
                  />
                  <p className="text-sm flex-1 text-gray-700">{c.title}</p>
                  <button
                    type="button"
                    onClick={() => onToggleChallenge(c.id)}
                    className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              ))}
            </div>
            <details className="bg-green-50 rounded-xl">
              <summary className="p-3 text-sm font-medium text-green-700 cursor-pointer">
                + Add challenge
              </summary>
              <div className="p-3 pt-0 space-y-2">
                <input
                  placeholder="Challenge title"
                  value={challengeForm.title}
                  onChange={(e) =>
                    setChallengeForm({
                      ...challengeForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={challengeForm.description}
                  onChange={(e) =>
                    setChallengeForm({
                      ...challengeForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Target value"
                    value={challengeForm.targetValue}
                    onChange={(e) =>
                      setChallengeForm({
                        ...challengeForm,
                        targetValue: e.target.value,
                      })
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Unit (steps, glasses...)"
                    value={challengeForm.unit}
                    onChange={(e) =>
                      setChallengeForm({
                        ...challengeForm,
                        unit: e.target.value,
                      })
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (challengeForm.title && challengeForm.targetValue) {
                      onAddChallenge({
                        title: challengeForm.title,
                        description: challengeForm.description,
                        targetValue: Number(challengeForm.targetValue),
                        unit: challengeForm.unit,
                        isActive: true,
                      });
                      setChallengeForm({
                        title: "",
                        description: "",
                        targetValue: "",
                        unit: "",
                      });
                    }
                  }}
                  className="w-full py-2 bg-green-400 text-white rounded-xl text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
