"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, saveToken } from "../lib/auth";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      saveToken(data.access_token, data.name, data.email);
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "We could not sign you in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <Link href="/" className="auth-brand">
          <div><FileText size={17} /></div>
          <strong>ResumeAI</strong>
        </Link>

        <div className="auth-showcase-copy">
          <div className="auth-eyebrow"><Sparkles size={14} /> Apply with confidence</div>
          <h1>Your next opportunity starts with a stronger story.</h1>
          <p>
            Improve every application with resume feedback built around the role
            you actually want.
          </p>

          <div className="auth-benefits">
            <p><CheckCircle2 size={17} /> Tailor resumes to any job description</p>
            <p><CheckCircle2 size={17} /> Find missing skills and keywords</p>
            <p><CheckCircle2 size={17} /> Create letters that feel personal</p>
          </div>
        </div>

        <div className="auth-photo-credit" />
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Link href="/" className="auth-mobile-brand">
            <div><FileText size={17} /></div>
            <strong>ResumeAI</strong>
          </Link>

          <div className="auth-form-heading">
            <span>Welcome back</span>
            <h2>Sign in to ResumeAI</h2>
            <p>Continue building stronger applications.</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <label>
              <span>Email address</span>
              <div className="auth-input-wrap">
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="auth-input-wrap">
                <LockKeyhole size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </div>
            </label>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button className="auth-submit-button" disabled={loading}>
              {loading ? "Signing in…" : <>Sign in <ArrowRight size={17} /></>}
            </button>
          </form>

          <p className="auth-switch">
            New to ResumeAI? <Link href="/register">Create a free account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}