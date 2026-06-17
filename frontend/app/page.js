"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FileText, Target, BarChart3, Zap,
  Mail, GitCompare, ArrowRight, CheckCircle, Menu, X
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("user_name");
      if (token) {
        setIsLoggedIn(true);
        setUserName(name || "User");
      }
    };
    checkAuth();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="container-center flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText size={16} color="white" />
            </div>
            <span className="font-bold text-lg text-slate-900">ResumeAI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-slate-500 hover:text-slate-900 transition text-sm font-medium">How it works</Link>
            {isLoggedIn && (
              <>
                <Link href="/analyze" className="text-slate-500 hover:text-slate-900 transition text-sm font-medium">Analyze</Link>
                <Link href="/resume-builder" className="text-slate-500 hover:text-slate-900 transition text-sm font-medium">Resume Builder</Link>
                <Link href="/compare" className="text-slate-500 hover:text-slate-900 transition text-sm font-medium">Compare Jobs</Link>
                <Link href="/cover-letter" className="text-slate-500 hover:text-slate-900 transition text-sm font-medium">Cover Letter</Link>
                <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition text-sm font-medium">Dashboard</Link>
                
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-slate-400 text-sm">Hi, {userName}</span>
                <button onClick={handleSignOut} className="btn-secondary text-sm py-2 px-4">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-500 hover:text-slate-900 transition text-sm font-medium px-4 py-2">Login</Link>
                <Link href="/register" className="btn-primary text-sm py-2.5 px-5">Get Started Free</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
            <Link href="/about" className="block text-slate-600 text-sm py-2">How it works</Link>
            {isLoggedIn ? (
              <>
                <Link href="/analyze" className="block text-slate-600 text-sm py-2">Analyze</Link>
                <Link href="/compare" className="block text-slate-600 text-sm py-2">Compare Jobs</Link>
                <Link href="/cover-letter" className="block text-slate-600 text-sm py-2">Cover Letter</Link>
                <Link href="/dashboard" className="block text-slate-600 text-sm py-2">Dashboard</Link>
                <button onClick={handleSignOut} className="block text-slate-600 text-sm py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-slate-600 text-sm py-2">Login</Link>
                <Link href="/register" className="block btn-primary text-center mt-2">Get Started Free</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="container-center py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-tag">AI-Powered Resume Analysis</span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 mb-6">
              Get Your Resume
              <span className="gradient-text"> Job Ready</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Find out exactly why you are not getting interviews. Our AI analyzes your resume against any job description and tells you precisely what to fix.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href={isLoggedIn ? "/analyze" : "/register"} className="btn-primary flex items-center gap-2">
                Analyze My Resume <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-secondary">
                See How It Works
              </Link>
            </div>
            <div className="flex gap-6 mt-10">
              {[
                { value: "98%", label: "Accuracy rate" },
                { value: "< 30s", label: "Analysis time" },
                { value: "Free", label: "No credit card" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-xl font-extrabold text-indigo-600">{s.value}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100">
              <Image
                src="/images/hero.png"
                alt="AI Resume Analysis"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 border border-slate-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} color="#10B981" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Match Score</div>
                <div className="font-bold text-slate-900 text-sm">87% — Strong Match</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-24">
        <div className="container-center">
          <div className="text-center mb-16">
            <span className="section-tag">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Get your full resume analysis in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Your Resume", desc: "Upload your resume in PDF or Word format. Our system reads and understands every detail.", icon: <FileText size={24} color="#4F46E5" /> },
              { step: "02", title: "Add the Job Description", desc: "Paste the job description you want to apply for. Any job from any platform works.", icon: <Target size={24} color="#4F46E5" /> },
              { step: "03", title: "Get Your Results", desc: "Receive your match score, missing skills, ATS score and AI-powered suggestions instantly.", icon: <Zap size={24} color="#4F46E5" /> },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 card-hover">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <div className="text-indigo-300 font-black text-3xl mb-3">{item.step}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container-center">
          <div className="text-center mb-16">
            <span className="section-tag">Features</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Everything you need to <span className="gradient-text">get hired</span></h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">A complete AI toolkit built specifically for job seekers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Resume Match Score", desc: "See exactly how well your resume matches the job description with a precise percentage score.", icon: <Target size={22} color="#4F46E5" />, img: "/images/feature-match.png" },
              { title: "ATS Score", desc: "Know if your resume will pass automated screening systems before it even reaches a recruiter.", icon: <BarChart3 size={22} color="#4F46E5" />, img: "/images/feature-analyze.png" },
              { title: "Skill Gap Detection", desc: "Discover which skills the employer is looking for that are missing from your resume.", icon: <Zap size={22} color="#4F46E5" />, img: "/images/feature-skills.png" },
              { title: "AI Improvement Tips", desc: "Get specific, actionable suggestions to rewrite your resume bullet points and improve your chances.", icon: <FileText size={22} color="#4F46E5" />, img: "/images/feature-analyze.png" },
              { title: "Cover Letter Generator", desc: "Generate a personalized professional cover letter tailored to the job in seconds.", icon: <Mail size={22} color="#4F46E5" />, img: "/images/feature-coverletter.png" },
              { title: "Job Comparison", desc: "Compare your resume against multiple job descriptions at once to find your best opportunity.", icon: <GitCompare size={22} color="#4F46E5" />, img: "/images/feature-dashboard.png" },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm card-hover">
                <div className="h-44 overflow-hidden">
                  <Image
                    src={f.img}
                    alt={f.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-slate-900">{f.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to land your dream job?</h2>
          <p className="text-indigo-200 text-lg mb-8">Join thousands of job seekers who use AI to get more interviews.</p>
          <Link href={isLoggedIn ? "/analyze" : "/register"} className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition inline-flex items-center gap-2 shadow-lg">
            Start Free Analysis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText size={14} color="white" />
            </div>
            <span className="font-bold text-slate-900">ResumeAI</span>
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="text-slate-400 hover:text-slate-600 text-sm transition">How it works</Link>
            <Link href="/analyze" className="text-slate-400 hover:text-slate-600 text-sm transition">Analyze</Link>
            <Link href="/compare" className="text-slate-400 hover:text-slate-600 text-sm transition">Compare</Link>
            <Link href="/cover-letter" className="text-slate-400 hover:text-slate-600 text-sm transition">Cover Letter</Link>
          </div>
          <p className="text-slate-400 text-sm">© 2026 ResumeAI — Final Year Project</p>
        </div>
      </footer>

    </main>
  );
}