"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, saveToken } from "../lib/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      saveToken(data.access_token, data.name, data.email);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center font-bold text-lg">AI</div>
            <span className="font-bold text-2xl">ResumeAI</span>
          </Link>
          <h1 className="text-3xl font-extrabold mt-6 mb-2">Welcome back</h1>
          <p className="text-white/50">Sign in to access your analysis history</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-4">
            <label className="text-white/70 text-sm font-medium block mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          <div className="mb-6">
            <label className="text-white/70 text-sm font-medium block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 transition py-3 rounded-xl font-semibold text-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/30 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <p className="text-center text-white/50 text-sm">
            Dont have an account?{" "}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 transition font-medium">
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-white/30 text-sm">
          <Link href="/" className="hover:text-white/60 transition">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
