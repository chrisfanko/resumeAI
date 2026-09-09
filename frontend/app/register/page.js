"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, saveToken } from "../lib/auth";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please complete every field.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await registerUser(name, email, password);
      saveToken(data.access_token, data.name, data.email);
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "We could not create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-showcase register-showcase">
        <Link href="/" className="auth-brand">
          <div><FileText size={17} /></div>
          <strong>ResumeAI</strong>
        </Link>

        <div className="auth-showcase-copy">
          <div className="auth-eyebrow"><Sparkles size={14} /> Free to start</div>
          <h1>Make every application count.</h1>
          <p>
            Get practical feedback that helps you explain your experience with
            more clarity, relevance, and confidence.
          </p>

          <div className="auth-benefits">
            <p><CheckCircle2 size={17} /> Resume and ATS analysis</p>
            <p><CheckCircle2 size={17} /> Job comparison and skill-gap insights</p>
            <p><CheckCircle2 size={17} /> AI-powered letters and resume builder</p>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Link href="/" className="auth-mobile-brand">
            <div><FileText size={17} /></div>
            <strong>ResumeAI</strong>
          </Link>

          <div className="auth-form-heading">
            <span>Start for free</span>
            <h2>Create your account</h2>
            <p>No credit card required. Start improving your next application today.</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <label>
              <span>Full name</span>
              <div className="auth-input-wrap">
                <UserRound size={16} />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                />
              </div>
            </label>

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
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
            </label>

            <label>
              <span>Confirm password</span>
              <div className="auth-input-wrap">
                <LockKeyhole size={16} />
                <input
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
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
              {loading ? "Creating your account…" : <>Create free account <ArrowRight size={17} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}