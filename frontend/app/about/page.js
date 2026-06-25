import Link from "next/link";
import Navbar from "../Navbar";
import { ArrowRight, Brain, FileSearch, BarChart3, Zap, Layers, Cpu } from "lucide-react";

export default function About() {
  const steps = [
    { step: "01", title: "Resume Parsing",     desc: "Your PDF or DOCX resume is parsed using pdfminer and python-docx to extract raw text, preserving structure and content.", tech: "pdfminer.six · python-docx", icon: FileSearch },
    { step: "02", title: "Entity Extraction",  desc: "spaCy's Named Entity Recognition model scans the resume to extract your name, email, phone, skills, organizations, and years of experience.", tech: "spaCy en_core_web_lg", icon: Brain },
    { step: "03", title: "Semantic Matching",  desc: "Your resume and the job description are converted into high-dimensional vectors using Sentence-BERT. Cosine similarity measures how semantically close they are.", tech: "Sentence-BERT · all-MiniLM-L6-v2", icon: Layers },
    { step: "04", title: "ATS Simulation",     desc: "TF-IDF vectorization simulates how an Applicant Tracking System scores your resume against the job description.", tech: "scikit-learn · TF-IDF", icon: BarChart3 },
    { step: "05", title: "Skill Gap Detection",desc: "Skills mentioned in the job description are compared against skills found in your resume. Missing skills are ranked by importance.", tech: "Custom NLP pipeline", icon: Zap },
    { step: "06", title: "AI Suggestions",     desc: "Llama 3 reads your resume and job description to generate personalized rewrite suggestions, improved bullet points, and actionable tips.", tech: "Llama 3.3 70B · Groq API", icon: Cpu },
  ];

  const stack = [
    { layer: "Frontend",    tech: "Next.js + Tailwind CSS" },
    { layer: "Backend",     tech: "FastAPI (Python)" },
    { layer: "NLP Engine",  tech: "spaCy + Sentence-BERT" },
    { layer: "ATS Scoring", tech: "scikit-learn TF-IDF" },
    { layer: "LLM",         tech: "Llama 3.3 via Groq" },
    { layer: "Database",    tech: "Supabase PostgreSQL" },
  ];

  return (
    <main className="page-shell">
      <Navbar />

      {/* Hero */}
      <section style={{ background: "white", padding: "64px 0 56px", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container-center" style={{ textAlign: "center" }}>
          <span className="section-tag">ResumeAI</span>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", color: "#111827", marginBottom: 16 }}>
            How ResumeAI works
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            A hybrid AI system combining traditional NLP and modern large language models to help job seekers optimize their resumes.
          </p>
        </div>
      </section>

      <div className="container-center py-12" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Problem */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", marginBottom: 14 }}>The problem</h2>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", lineHeight: 1.75, fontSize: 15, marginBottom: 12 }}>
            Every day, thousands of qualified candidates get rejected not because they lack the skills, but because their resumes fail to communicate those skills effectively. Applicant Tracking Systems (ATS) automatically reject up to 75% of resumes before a human ever reads them.
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", lineHeight: 1.75, fontSize: 15 }}>
            Job seekers have no visibility into why they are being rejected or how to improve. ResumeAI solves this by giving candidates the same analytical power that enterprise recruitment tools give large corporations.
          </p>
        </div>

        {/* How it works */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", marginBottom: 24 }}>How it works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {steps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 20, borderBottom: i < steps.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ width: 40, height: 40, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color="#16a34a" />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 11, color: "#94a3b8", letterSpacing: "0.06em" }}>{item.step}</span>
                      <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827" }}>{item.title}</h3>
                    </div>
                    <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 8 }}>{item.desc}</p>
                    <span style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "3px 12px", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11 }}>
                      {item.tech}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", marginBottom: 20 }}>Tech stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stack.map((item, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{item.layer}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: "#111827" }}>{item.tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", marginBottom: 14 }}>Architecture</h2>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
            ResumeAI uses a decoupled client-server architecture. The Next.js frontend communicates with the FastAPI backend via REST API calls. The backend orchestrates three AI models working in a pipeline — spaCy for extraction, Sentence-BERT for semantic analysis, and Llama 3 for generative suggestions.
          </p>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "20px 24px", border: "1px solid #e2e8f0", fontFamily: "'Courier New', monospace", fontSize: 13, color: "#374151", lineHeight: 2 }}>
            <p style={{ color: "#16a34a", fontWeight: 700 }}>Next.js Frontend</p>
            <p style={{ paddingLeft: 20, color: "#64748b" }}>↓ HTTP POST /api/analyze</p>
            <p style={{ color: "#16a34a", fontWeight: 700 }}>FastAPI Backend</p>
            <p style={{ paddingLeft: 20, color: "#64748b" }}>↓ parse_resume()</p>
            <p style={{ paddingLeft: 20, color: "#64748b" }}>↓ extract_entities()   — spaCy</p>
            <p style={{ paddingLeft: 20, color: "#64748b" }}>↓ calculate_match()    — Sentence-BERT</p>
            <p style={{ paddingLeft: 20, color: "#64748b" }}>↓ calculate_ats()      — TF-IDF</p>
            <p style={{ paddingLeft: 20, color: "#64748b" }}>↓ generate_suggestions() — Llama 3</p>
            <p style={{ color: "#16a34a", fontWeight: 700 }}>JSON Response → Results Page</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "#16a34a", borderRadius: 16, padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", color: "white", marginBottom: 12 }}>
            Try it yourself
          </h2>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 15, marginBottom: 24 }}>
            Upload your resume and see the full analysis in seconds.
          </p>
          <Link href="/analyze" style={{ background: "white", color: "#16a34a", fontFamily: "'Inter', sans-serif", fontWeight: 700, padding: "13px 28px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, textDecoration: "none" }}>
            Analyze my resume <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "28px 0", textAlign: "center" }}>
        <p style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 13 }}>© 2026 ResumeAI — Final Year Project</p>
      </footer>
    </main>
  );
}