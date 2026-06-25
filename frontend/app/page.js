"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import {
  FileText, Target, BarChart3, Zap, Mail, GitCompare,
  ArrowRight, CheckCircle, PenLine, ChevronRight
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="container-center py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="section-tag">AI-Powered Resume Analysis</span>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem, 5vw, 3.6rem)", lineHeight: 1.1, letterSpacing: "-0.03em", color: "#111827", marginBottom: 20 }}>
              Get your resume<br /><span className="gradient-text">job ready</span>
            </h1>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 17, color: "#64748b", lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
              Find out exactly why you're not getting interviews. Our AI analyzes your resume against any job description and tells you precisely what to fix.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href={isLoggedIn ? "/analyze" : "/register"} className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>
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

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.1)" }}>
              <Image src="/images/hero.png" alt="AI Resume Analysis" width={600} height={450} className="w-full h-auto object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3" style={{ border: "1px solid #e2e8f0" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#dcfce7" }}>
                <CheckCircle size={20} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#94a3b8" }}>Match Score</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: "#111827" }}>87% — Strong Match</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#f8fafc", padding: "80px 0" }}>
        <div className="container-center">
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
                <div key={i} className="card card-hover" style={{ padding: 28 }}>
                  <div style={{ width: 44, height: 44, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={22} color="#16a34a" />
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 32, color: "#bbf7d0", marginBottom: 10 }}>{item.step}</div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 0" }}>
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
                  <div style={{ height: 160, overflow: "hidden", background: "#f8fafc" }}>
                    <Image src={f.img} alt={f.title} width={400} height={200} className="w-full h-full object-cover" />
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div style={{ width: 32, height: 32, background: "#f0fdf4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

      {/* Resume Builder CTA */}
      <section style={{ background: "#f0fdf4", padding: "64px 0", borderTop: "1px solid #dcfce7", borderBottom: "1px solid #dcfce7" }}>
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
            <Link href="/resume-builder" className="btn-primary flex-shrink-0" style={{ padding: "13px 28px", fontSize: 15 }}>
              <PenLine size={16} /> Build my resume <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#16a34a", padding: "80px 0" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.03em", color: "white", marginBottom: 16 }}>
            Ready to land your dream job?
          </h2>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 32 }}>
            Join thousands of job seekers who use AI to get more interviews.
          </p>
          <Link href={isLoggedIn ? "/analyze" : "/register"} style={{ background: "white", color: "#16a34a", fontFamily: "'Inter', sans-serif", fontWeight: 700, padding: "14px 32px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, textDecoration: "none", transition: "opacity 0.2s" }}>
            Start free analysis <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
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
              <Link key={i} href={href} style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 13, textDecoration: "none", transition: "color 0.15s" }}>
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