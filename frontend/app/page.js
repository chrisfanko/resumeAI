"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      
      {/* Navbar */}
       <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">AI</div>
          <span className="font-bold text-lg">ResumeAI</span>
        </div>
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <span className="text-white/60 text-sm"> {userName}</span>
              <Link href="/compare" className="text-white/70 hover:text-white transition px-4 py-2">Compare Jobs</Link>

              <Link href="/dashboard" className="text-white/70 hover:text-white transition px-4 py-2">Dashboard</Link>
              <button
                onClick={handleSignOut}
                className="border border-white/20 hover:border-white/40 transition px-4 py-2 rounded-lg font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              
              <Link href="/login" className="text-white/70 hover:text-white transition px-4 py-2">Login</Link>
              <Link href="/register" className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-medium">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-purple-300 text-sm mb-6">
          Powered by NLP + Llama 3 AI
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Get Your Resume <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            AI Analyzed
          </span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mb-10">
          Upload your resume, paste a job description, and get an instant AI-powered analysis — match score, skill gaps, ATS score, and rewrite suggestions.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-8 py-4 rounded-xl font-semibold text-lg">
            Analyze My Resume →
          </Link>
          <Link href="/about" className="border border-white/20 hover:border-white/40 transition px-8 py-4 rounded-xl font-semibold text-lg">
            How It Works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Everything you need to land the job</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🎯", title: "Match Score", desc: "See how well your resume matches the job description using semantic AI analysis." },
            { icon: "📊", title: "ATS Score", desc: "Know if your resume will pass Applicant Tracking Systems before you apply." },
            { icon: "🔍", title: "Skill Gap Detection", desc: "Instantly see which skills the employer wants that are missing from your resume." },
            { icon: "✍️", title: "AI Rewrites", desc: "Get AI-generated improved versions of your resume bullet points." },
            { icon: "⚡", title: "Instant Results", desc: "Full analysis in seconds. No waiting, no signup required to try." },
            { icon: "🔒", title: "Private & Secure", desc: "Your resume is never stored without your permission." },
          ].map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-6">Ready to improve your resume?</h2>
        <p className="text-white/60 mb-8 text-lg">Join thousands of job seekers getting smarter about their applications.</p>
        <Link href="/analyze" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition px-10 py-4 rounded-xl font-semibold text-lg">
          Start Free Analysis →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-8 text-white/30 text-sm">
        © 2026 ResumeAI 
      </footer>

    </main>
  );
}