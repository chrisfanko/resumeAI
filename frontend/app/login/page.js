"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, saveToken } from "../lib/auth";
import { FileText, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError(null);
    try {
      const data = await loginUser(email, password);
      saveToken(data.access_token, data.name, data.email);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f8fafc" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
            <div className="logo-mark">
              <FileText size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", letterSpacing: "-0.02em" }}>ResumeAI</span>
          </Link>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 26, color: "#111827", letterSpacing: "-0.025em", marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14 }}>Sign in to access your analysis history</p>
        </div>

        <div className="auth-card">
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKey}
                placeholder="you@example.com"
                className="input"
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKey}
                placeholder="••••••••"
                className="input"
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#991b1b", fontSize: 13, textAlign: "center" }}>{error}</p>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }}>
            {loading ? "Signing in…" : <><span>Sign in</span> <ArrowRight size={15} /></>}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 12 }}>or</span>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#64748b", textAlign: "center" }}>
            No account?{" "}
            <Link href="/register" style={{ color: "#16a34a", fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
          </p>
        </div>

        <p style={{ fontFamily: "'Lato', sans-serif", textAlign: "center", marginTop: 20, fontSize: 13 }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>← Back to home</Link>
        </p>
      </div>
    </main>
  );
}