import { useState } from "react";
import { LEADERBOARD } from "../data/demoData";
import type { Challenge, ChallengeProgress, UserProfile } from "../types";

interface Props {
  user: UserProfile;
  allUsers: UserProfile[];
  challenges: Challenge[];
  progress: ChallengeProgress[];
  onAddFriend: (id: string) => void;
}

export default function Social({
  user,
  allUsers,
  challenges,
  progress,
  onAddFriend,
}: Props) {
  const [friendInput, setFriendInput] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const friends = allUsers.filter((u) => user.friends.includes(u.id));

  function getUserProgress(userId: string, challengeId: string) {
    return (
      progress.find((p) => p.userId === userId && p.challengeId === challengeId)
        ?.currentValue || 0
    );
  }

  const friendUser = allUsers.find((u) => u.id === selectedFriend);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Social & Challenges</h2>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-700 mb-3">🏆 Weekly Leaderboard</h3>
        <div className="space-y-2">
          {LEADERBOARD.map((entry, i) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                entry.userId === user.id
                  ? "bg-purple-50 border border-purple-200"
                  : "bg-gray-50"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0
                    ? "bg-yellow-400 text-white"
                    : i === 1
                      ? "bg-gray-300 text-white"
                      : i === 2
                        ? "bg-orange-300 text-white"
                        : "bg-gray-100 text-gray-500"
                }`}
              >
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-700">
                  {entry.name[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">
                  {entry.name}
                </p>
                <p className="text-xs text-gray-500">
                  {entry.weeklySteps.toLocaleString()} steps
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Diet:{" "}
                  <span className="font-medium text-green-600">
                    {entry.dietScore}%
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Score:{" "}
                  <span className="font-medium text-[#9B7BC4]">
                    {entry.challengeScore}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-700 mb-3">🎯 Weekly Challenges</h3>
        <div className="space-y-4">
          {challenges
            .filter((c) => c.isActive)
            .map((c) => {
              const current = getUserProgress(user.id, c.id);
              const pct = Math.min((current / c.targetValue) * 100, 100);
              return (
                <div
                  key={c.id}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {c.title}
                      </p>
                      <p className="text-xs text-gray-500">{c.description}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0 ${
                        pct >= 100
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {pct >= 100 ? "✅ Done" : `${Math.round(pct)}%`}
                    </span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C7A1E3] to-[#F0C4C0] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {current} / {c.targetValue} {c.unit}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Friends */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-700 mb-3">👥 Friends</h3>
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Add friend by username..."
            value={friendInput}
            onChange={(e) => setFriendInput(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              if (friendInput) {
                onAddFriend(friendInput);
                setFriendInput("");
              }
            }}
            className="px-4 py-2 bg-[#C7A1E3] text-white rounded-xl text-sm font-medium"
          >
            Add
          </button>
        </div>
        {friends.length === 0 ? (
          <p className="text-gray-400 text-sm">No friends added yet.</p>
        ) : (
          <div className="space-y-2">
            {friends.map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() =>
                  setSelectedFriend(f.id === selectedFriend ? null : f.id)
                }
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  selectedFriend === f.id
                    ? "bg-purple-100 border border-purple-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-700">
                    {f.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {f.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {f.role}{" "}
                    {f.pregnancyWeek > 0 ? `· Week ${f.pregnancyWeek}` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Friend comparison */}
        {friendUser && friendUser.role === "user" && (
          <div className="mt-4 bg-purple-50 rounded-xl p-4">
            <p className="text-sm font-bold text-gray-700 mb-3">
              vs. {friendUser.name}
            </p>
            {challenges
              .filter((c) => c.isActive)
              .map((c) => {
                const myVal = getUserProgress(user.id, c.id);
                const fVal = getUserProgress(friendUser.id, c.id);
                return (
                  <div key={c.id} className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">{c.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16 text-right text-[#9B7BC4] font-medium">
                        {myVal} {c.unit}
                      </span>
                      <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C7A1E3] to-[#F0C4C0] rounded-full"
                          style={{
                            width: `${Math.min((myVal / c.targetValue) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#BFEADB] to-[#AEE3D3] rounded-full"
                          style={{
                            width: `${Math.min((fVal / c.targetValue) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs w-16 text-green-600 font-medium">
                        {fVal} {c.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                      <span>You</span>
                      <span>{friendUser.name.split(" ")[0]}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
