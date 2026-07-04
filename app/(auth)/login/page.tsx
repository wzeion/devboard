"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (res.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (res.ok) {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-gray-900 dark:text-white font-semibold text-lg tracking-tight">
            DevBoard
          </span>
        </div>

        <div className="bg-white dark:bg-[#161b22] rounded-lg border border-gray-200 dark:border-[#30363d] p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Sign in
          </h1>
          <p className="text-gray-500 dark:text-[#8b949e] text-sm mb-6">
            Welcome back to DevBoard
          </p>

          {error && (
            <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 text-sm transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
                className="mt-1 w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-md font-medium text-sm transition-all mt-1"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#30363d]" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 dark:text-[#8b949e]">
              <span className="bg-white dark:bg-[#161b22] px-2">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-2 border border-gray-200 dark:border-[#30363d] hover:bg-gray-50 dark:hover:bg-[#21262d] text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-[#8b949e] mt-4">
          No account?{" "}
          <a href="/signup" className="text-emerald-500 hover:text-emerald-400 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}