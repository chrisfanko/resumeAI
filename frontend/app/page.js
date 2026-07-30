"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import {
  FileText, Target, BarChart3, Zap, Mail, GitCompare,
  ArrowRight, CheckCircle, PenLine, Sparkles, TrendingUp, ShieldCheck
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900" style={{ overflowX: "hidden" }}>
      <Navbar />

      {/* ══════════════════ HERO with gradient mesh ══════════════════ */}
      <section style={{ position: "relative", overflow: "hidden" }}>

        {/* Gradient mesh background blobs */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: "-180px", right: "-160px", width: 560, height: 560, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.16) 0%, rgba(34,197,94,0) 70%)",
            filter: "blur(10px)",
          }} />
          <div style={{
            position: "absolute", top: "120px", left: "-200px", width: 480, height: 480, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.10) 0%, rgba(22,163,74,0) 70%)",
            filter: "blur(10px)",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "100%",
            backgroundImage: "radial-gradient(rgba(15,23,42,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
            opacity: 0.5,
          }} />
        </div>

        <div className="container-center py-20 md:py-28" style={{ position: "relative", zIndex: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={12} /> AI-Powered Resume Analysis
              </span>
              <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem, 5vw, 3.6rem)", lineHeight: 1.08, letterSpacing: "-0.03em", color: "#111827", marginBottom: 20 }}>
                Get your resume<br /><span className="gradient-text">job ready</span>
              </h1>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 17, color: "#64748b", lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                Find out exactly why you're not getting interviews. Our AI analyzes your resume against any job description and tells you precisely what to fix.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href={isLoggedIn ? "/analyze" : "/register"} className="btn-primary" style={{ fontSize: 15, padding: "13px 28px", boxShadow: "0 8px 24px rgba(22,163,74,0.25)" }}>
                  Analyze my resume <ArrowRight size={16} />
                </Link>
                <Link href="/about" className="btn-secondary" style={{ fontSize: 15, padding: "13px 24px" }}>
                  How it works
                </Link>
              </div>
              <div className="flex gap-8 mt-10">
                {[
                  { value: "98%", label: "Accuracy rate" },
                  { value: "< 30s", label: "Analysis time" },
                  { value: "Free", label: "No credit card" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 22, color: "#16a34a" }}>{s.value}</div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layered hero visual */}
            <div className="relative">
              {/* glow behind image */}
              <div aria-hidden="true" style={{
                position: "absolute", top: "-24px", right: "-24px", left: "24px", bottom: "-24px",
                background: "linear-gradient(135deg, rgba(34,197,94,0.35), rgba(22,163,74,0.12))",
                borderRadius: 28, filter: "blur(2px)", zIndex: 0,
              }} />
              <div className="rounded-2xl overflow-hidden" style={{ position: "relative", zIndex: 1, boxShadow: "0 30px 70px rgba(15,23,42,0.16)" }}>
                <Image src="/images/hero.png" alt="AI Resume Analysis" width={600} height={450} className="w-full h-auto object-cover" />
              </div>

              {/* Floating card 1 — match score */}
              <div className="absolute" style={{ bottom: -18, left: -20, zIndex: 2, background: "white", borderRadius: 14, boxShadow: "0 12px 30px rgba(15,23,42,0.14)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: "1px solid #f1f5f9" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={19} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#94a3b8" }}>Match Score</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: "#111827" }}>87% — Strong Match</div>
                </div>
              </div>

              {/* Floating card 2 — ATS pass */}
              <div className="absolute" style={{ top: -16, right: -16, zIndex: 2, background: "white", borderRadius: 14, boxShadow: "0 12px 30px rgba(15,23,42,0.14)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #f1f5f9" }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, color: "#111827" }}>ATS Passed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section style={{ position: "relative", background: "#f8fafc", padding: "84px 0", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", bottom: "-120px", right: "10%", width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, rgba(34,197,94,0) 70%)",
        }} />
        <div className="container-center" style={{ position: "relative" }}>
          <div className="text-center mb-14">
            <span className="section-tag">Simple Process</span>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.025em", color: "#111827", marginBottom: 12 }}>How it works</h2>
            <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 16 }}>Get your full resume analysis in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Upload your resume", desc: "Upload your resume in PDF or Word format. Our system reads and understands every detail.", icon: FileText },
              { step: "2", title: "Add the job description", desc: "Paste the job description you want to apply for. Any job from any platform works.", icon: Target },
              { step: "3", title: "Get your results", desc: "Receive your match score, missing skills, ATS score and AI-powered suggestions instantly.", icon: Zap },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="card card-hover" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                  <div aria-hidden="true" style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)" }} />
                  <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, position: "relative" }}>
                    <Icon size={22} color="#16a34a" />
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 32, color: "#bbf7d0", marginBottom: 10, position: "relative" }}>{item.step}</div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 8, position: "relative" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, lineHeight: 1.6, position: "relative" }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section style={{ padding: "84px 0" }}>
        <div className="container-center">
          <div className="text-center mb-14">
            <span className="section-tag">Features</span>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.025em", color: "#111827", marginBottom: 12 }}>
              Everything you need to <span className="gradient-text">get hired</span>
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 16 }}>A complete AI toolkit built for job seekers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Resume Match Score", desc: "See exactly how well your resume matches the job description with a precise percentage score.", icon: Target, img: "/images/feature-match.png" },
              { title: "ATS Score", desc: "Know if your resume will pass automated screening systems before it reaches a recruiter.", icon: BarChart3, img: "/images/feature-analyze.png" },
              { title: "Skill Gap Detection", desc: "Discover which skills the employer needs that are missing from your resume.", icon: Zap, img: "/images/feature-skills.png" },
              { title: "AI Improvement Tips", desc: "Get specific, actionable suggestions to rewrite your resume and improve your chances.", icon: FileText, img: "/images/feature-analyze.png" },
              { title: "Cover Letter Generator", desc: "Generate a personalized professional cover letter tailored to any job in seconds.", icon: Mail, img: "/images/feature-coverletter.png" },
              { title: "Job Comparison", desc: "Compare your resume against multiple jobs at once to find your best opportunity.", icon: GitCompare, img: "/images/feature-dashboard.png" },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card card-hover" style={{ overflow: "hidden" }}>
                  <div style={{ height: 160, overflow: "hidden", background: "#f8fafc", position: "relative" }}>
                    <Image src={f.img} alt={f.title} width={400} height={200} className="w-full h-full object-cover" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(15,23,42,0.06))" }} />
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={16} color="#16a34a" />
                      </div>
                      <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827" }}>{f.title}</h3>
                    </div>
                    <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS BAR ══════════════════ */}
      <section style={{ background: "#0f172a", padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: "-100px", left: "30%", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0) 70%)",
        }} />
        <div className="container-center" style={{ position: "relative" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, value: "3.2x", label: "More interview callbacks" },
              { icon: Target,     value: "98%",  label: "Match accuracy" },
              { icon: ShieldCheck,value: "75%",  label: "Resumes auto-rejected by ATS without optimization" },
              { icon: Zap,        value: "<30s", label: "Average analysis time" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <Icon size={20} color="#4ade80" />
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 26, color: "white" }}>{s.value}</div>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", maxWidth: 160, lineHeight: 1.5 }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ RESUME BUILDER CTA ══════════════════ */}
      <section style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)", padding: "64px 0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="section-tag">New</span>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", color: "#111827", marginBottom: 10 }}>
                Build your resume from scratch
              </h2>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 15, maxWidth: 460 }}>
                No existing resume? Use our AI-powered builder to create a polished, ATS-ready resume in minutes — step by step.
              </p>
            </div>
            <Link href="/resume-builder" className="btn-primary flex-shrink-0" style={{ padding: "13px 28px", fontSize: 15, boxShadow: "0 8px 24px rgba(22,163,74,0.25)" }}>
              <PenLine size={16} /> Build my resume <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      <section style={{ background: "#16a34a", padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: "-140px", right: "-100px", width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", bottom: "-160px", left: "-80px", width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
        }} />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.03em", color: "white", marginBottom: 16 }}>
            Ready to land your dream job?
          </h2>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 32 }}>
            Join thousands of job seekers who use AI to get more interviews.
          </p>
          <Link href={isLoggedIn ? "/analyze" : "/register"} style={{ background: "white", color: "#16a34a", fontFamily: "'Inter', sans-serif", fontWeight: 700, padding: "14px 32px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, textDecoration: "none", boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}>
            Start free analysis <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "36px 0" }}>
        <div className="container-center flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="logo-mark" style={{ width: 28, height: 28, borderRadius: 6 }}>
              <FileText size={13} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 15, color: "#111827" }}>ResumeAI</span>
          </div>
          <div className="flex gap-5">
            {["/about", "/analyze", "/compare", "/cover-letter", "/resume-builder"].map((href, i) => (
              <Link key={i} href={href} style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 13, textDecoration: "none" }}>
                {["How it works", "Analyze", "Compare", "Cover Letter", "Builder"][i]}
              </Link>
            ))}
          </div>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 12 }}>© 2026 ResumeAI — Final Year Project</p>
        </div>
      </footer>
    </main>
  );
}