import { useState } from "react";
import type { Reminder, UserProfile } from "../types";

interface Props {
  user: UserProfile;
  reminders: Reminder[];
  onAdd: (r: Omit<Reminder, "id">) => void;
  onDelete: (id: string) => void;
}

const typeStyles: Record<string, { bg: string; text: string; emoji: string }> =
  {
    medicine: { bg: "bg-purple-100", text: "text-purple-700", emoji: "💊" },
    appointment: { bg: "bg-pink-100", text: "text-pink-700", emoji: "🏥" },
    checkup: { bg: "bg-green-100", text: "text-green-700", emoji: "✅" },
  };

export default function Reminders({ user, reminders, onAdd, onDelete }: Props) {
  const myReminders = reminders
    .filter((r) => r.userId === user.id)
    .sort((a, b) => a.datetime.localeCompare(b.datetime));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    reminderType: "medicine",
    title: "",
    date: "",
    time: "",
    repeat: "none",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      userId: user.id,
      reminderType: form.reminderType as Reminder["reminderType"],
      title: form.title,
      datetime: `${form.date}T${form.time}`,
      repeat: form.repeat as Reminder["repeat"],
    });
    setForm({
      reminderType: "medicine",
      title: "",
      date: "",
      time: "",
      repeat: "none",
    });
    setShowForm(false);
  }

  const now = new Date().toISOString();
  const upcoming = myReminders.filter((r) => r.datetime >= now);
  const past = myReminders.filter((r) => r.datetime < now);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Reminders</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-[#F0C4C0] to-[#C7A1E3] text-white rounded-xl text-sm font-medium shadow-sm"
        >
          + New
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl shadow-md p-5 space-y-3"
        >
          <h3 className="font-bold text-gray-700">New Reminder</h3>
          <select
            value={form.reminderType}
            onChange={(e) => setForm({ ...form, reminderType: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
          >
            <option value="medicine">Medicine</option>
            <option value="appointment">Doctor Appointment</option>
            <option value="checkup">Checkup</option>
          </select>
          <input
            required
            placeholder="Reminder title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <select
            value={form.repeat}
            onChange={(e) => setForm({ ...form, repeat: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
          >
            <option value="none">No repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-[#C7A1E3] text-white rounded-xl text-sm font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Upcoming */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-semibold text-gray-700 mb-3">
          Upcoming ({upcoming.length})
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-gray-400 text-sm">All caught up! 🎉</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((r) => {
              const s = typeStyles[r.reminderType];
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 ${s.bg} rounded-xl p-3`}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                    <span>{s.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${s.text}`}>
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.datetime).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {r.repeat !== "none" && (
                        <span className="ml-2 italic">{r.repeat}</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <details className="bg-white rounded-2xl shadow-md">
          <summary className="font-semibold text-gray-500 p-5 cursor-pointer text-sm">
            Past reminders ({past.length})
          </summary>
          <div className="px-5 pb-5 space-y-2">
            {past.map((r) => {
              const s = typeStyles[r.reminderType];
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 opacity-60"
                >
                  <span>{s.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.datetime).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
