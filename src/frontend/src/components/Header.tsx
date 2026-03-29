import { Bell, ChevronDown, LogOut } from "lucide-react";
import type { Role, UserProfile } from "../types";

interface Props {
  currentUser: UserProfile;
  users: UserProfile[];
  onSwitchUser: (userId: string) => void;
  remindersCount: number;
  mefitRole?: Role | null;
  onLogout?: () => void;
}

const roleColors: Record<string, string> = {
  user: "bg-pink-100 text-pink-700",
  doctor: "bg-blue-100 text-blue-700",
  nutritionist: "bg-green-100 text-green-700",
};

export default function Header({
  currentUser,
  users,
  onSwitchUser,
  remindersCount,
  mefitRole,
  onLogout,
}: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#10B981] flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <span className="font-bold text-gray-800 text-sm">Me</span>
            <span className="font-bold text-[#3B82F6] text-sm">Fit</span>
            {mefitRole && (
              <span
                className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${roleColors[mefitRole]}`}
              >
                {mefitRole}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={20} className="text-gray-500" />
            {remindersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-100 text-[9px] text-blue-800 font-bold rounded-full flex items-center justify-center">
                {remindersCount}
              </span>
            )}
          </div>

          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-2 py-1 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#10B981] flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {currentUser.name[0]}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {currentUser.name.split(" ")[0]}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="px-3 pb-2 mb-1 border-b border-gray-50">
                <p className="text-xs text-gray-500">Switch user / role</p>
              </div>
              {users.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => onSwitchUser(u.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors ${currentUser.id === u.id ? "bg-blue-50" : ""}`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#10B981] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {u.name[0]}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {u.name}
                    </p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleColors[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </div>
                </button>
              ))}
              {onLogout && (
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <button
                    type="button"
                    data-ocid="header.button"
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <LogOut size={14} />
                    <span className="text-sm font-medium">Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
