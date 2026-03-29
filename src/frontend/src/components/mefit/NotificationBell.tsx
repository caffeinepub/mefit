import { Bell, X } from "lucide-react";
import { useState } from "react";

interface AppNotification {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  color: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    icon: "💊",
    title: "Medicine Reminder",
    subtitle: "Time to take your prenatal vitamins",
    time: "2 min ago",
    read: false,
    color: "#3B82F6",
  },
  {
    id: "n2",
    icon: "🩺",
    title: "Doctor Visit Tomorrow",
    subtitle: "Dr. Anjali Sharma · 10:00 AM",
    time: "1 hr ago",
    read: false,
    color: "#10B981",
  },
  {
    id: "n3",
    icon: "📅",
    title: "Event in 3 Days",
    subtitle: "Wedding Ceremony — prep diet ready in Planner",
    time: "3 hr ago",
    read: false,
    color: "#8B5CF6",
  },
  {
    id: "n4",
    icon: "⚠️",
    title: "AI Health Warning",
    subtitle: "Sugar intake slightly high today. Try reducing sweets.",
    time: "5 hr ago",
    read: false,
    color: "#F97316",
  },
  {
    id: "n5",
    icon: "🚨",
    title: "SOS Alert Sent",
    subtitle: "Emergency alert delivered to Dr. Anjali & Raj",
    time: "Yesterday",
    read: true,
    color: "#EF4444",
  },
  {
    id: "n6",
    icon: "🌟",
    title: "Great Progress!",
    subtitle: "You've completed 7-day streak. Keep it up!",
    time: "Yesterday",
    read: true,
    color: "#F59E0B",
  },
];

function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem("mefit_notifications");
    return raw ? (JSON.parse(raw) as AppNotification[]) : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(loadNotifications);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("mefit_notifications", JSON.stringify(updated));
  }

  function dismiss(id: string) {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("mefit_notifications", JSON.stringify(updated));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid="notification.button"
        className="relative w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Bell size={16} color="white" />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: "#EF4444" }}
            data-ocid="notification.toast"
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40"
            role="presentation"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          />
          <div
            className="absolute right-0 top-11 w-80 rounded-2xl z-50 overflow-hidden"
            style={{
              background: "#0D1B2A",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            data-ocid="notification.popover"
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-white font-bold text-sm">Notifications</h3>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  data-ocid="notification.secondary_button"
                  className="text-xs font-semibold"
                  style={{ color: "#818CF8" }}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p
                  className="text-center text-slate-500 text-sm py-8"
                  data-ocid="notification.empty_state"
                >
                  No notifications
                </p>
              )}
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{
                    background: n.read
                      ? "transparent"
                      : "rgba(255,255,255,0.03)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                  data-ocid="notification.item"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: `${n.color}22` }}
                  >
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-white text-xs font-semibold">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: n.color }}
                        />
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {n.subtitle}
                    </p>
                    <p className="text-slate-600 text-[10px] mt-0.5">
                      {n.time}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(n.id)}
                    className="p-1 flex-shrink-0"
                    style={{ color: "#374151" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
