"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, saveToken } from "../lib/auth";
import { FileText, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError(null);
    try {
      const data = await registerUser(name, email, password);
      saveToken(data.access_token, data.name, data.email);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const field = (label, value, onChange, placeholder, type = "text", icon) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>{icon}</span>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input" style={{ paddingLeft: 36 }} />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "#f8fafc" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
            <div className="logo-mark">
              <FileText size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", letterSpacing: "-0.02em" }}>ResumeAI</span>
          </Link>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 26, color: "#111827", letterSpacing: "-0.025em", marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14 }}>Start analyzing resumes for free</p>
        </div>

        <div className="auth-card">
          {field("Full name",        name,     setName,     "John Doe",         "text",     <User size={15} color="#94a3b8" />)}
          {field("Email address",    email,    setEmail,    "you@example.com",  "email",    <Mail size={15} color="#94a3b8" />)}
          {field("Password",         password, setPassword, "••••••••",         "password", <Lock size={15} color="#94a3b8" />)}
          {field("Confirm password", confirm,  setConfirm,  "••••••••",         "password", <Lock size={15} color="#94a3b8" />)}

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#991b1b", fontSize: 13, textAlign: "center" }}>{error}</p>
            </div>
          )}

          <button onClick={handleRegister} disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }}>
            {loading ? "Creating account…" : <><span>Create account</span> <ArrowRight size={15} /></>}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 12 }}>or</span>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#64748b", textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#16a34a", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>

        <p style={{ fontFamily: "'Lato', sans-serif", textAlign: "center", marginTop: 20, fontSize: 13 }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>← Back to home</Link>
        </p>
      </div>
    </main>
  );
}