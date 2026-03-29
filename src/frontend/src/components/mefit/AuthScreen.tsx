import { Eye, EyeOff, Leaf } from "lucide-react";
import { useState } from "react";

interface Props {
  onAuth: () => void;
}

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("mefit_auth", JSON.stringify({ authenticated: true }));
    onAuth();
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F2940 100%)",
      }}
    >
      <div className="flex flex-col items-center mb-10">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
          style={{
            background: "linear-gradient(135deg, #3B82F6, #10B981)",
            boxShadow:
              "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(16,185,129,0.25)",
          }}
        >
          <Leaf size={38} className="text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">MeFit</h1>
        <p className="text-blue-300 mt-1 text-base tracking-wide">
          Your AI Health Partner
        </p>
      </div>

      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="flex rounded-2xl p-1 mb-6"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              data-ocid="auth.tab"
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background:
                  mode === m
                    ? "linear-gradient(90deg, #3B82F6, #10B981)"
                    : "transparent",
                color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="auth-name"
                className="text-xs text-blue-200 font-medium uppercase tracking-wider"
              >
                Full Name
              </label>
              <input
                id="auth-name"
                data-ocid="auth.input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="auth-email"
              className="text-xs text-blue-200 font-medium uppercase tracking-wider"
            >
              Email or Phone
            </label>
            <input
              id="auth-email"
              data-ocid="auth.input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none text-sm"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="auth-password"
              className="text-xs text-blue-200 font-medium uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                data-ocid="auth.input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 pr-11 text-white placeholder-white/30 outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            data-ocid="auth.submit_button"
            className="w-full py-3.5 rounded-2xl text-white font-bold text-base mt-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
              boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
            }}
          >
            Continue
          </button>
        </form>
        <p className="text-center text-white/30 text-xs mt-5">
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>
      </div>

      <p className="text-white/20 text-xs mt-8">
        © {new Date().getFullYear()} MeFit. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/40"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
