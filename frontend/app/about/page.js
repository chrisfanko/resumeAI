import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">AI</div>
          <span className="font-bold text-lg">ResumeAI</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-white/70 hover:text-white transition px-4 py-2">Login</Link>
          <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-medium">
            Try It Free
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-purple-300 text-sm mb-6">
            ResumeA
          </div>
          <h1 className="text-5xl font-extrabold mb-6">How ResumeAI Works</h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            A hybrid AI system combining traditional NLP and modern large language models to help job seekers optimize their resumes.
          </p>
        </div>

        {/* Problem */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎯 The Problem</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Every day, thousands of qualified candidates get rejected not because they lack the skills, but because their resumes fail to communicate those skills effectively. Applicant Tracking Systems (ATS) automatically reject up to 75% of resumes before a human ever reads them.
          </p>
          <p className="text-white/60 leading-relaxed">
            Job seekers have no visibility into why they are being rejected or how to improve. ResumeAI solves this by giving candidates the same analytical power that enterprise recruitment tools give large corporations.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-8">⚙️ How It Works</h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Resume Parsing",
                desc: "Your PDF or DOCX resume is parsed using pdfminer and python-docx to extract raw text, preserving structure and content.",
                tech: "pdfminer.six · python-docx"
              },
              {
                step: "02",
                title: "Entity Extraction",
                desc: "spaCy's Named Entity Recognition model scans the resume to extract your name, email, phone, skills, organizations, and years of experience.",
                tech: "spaCy en_core_web_lg"
              },
              {
                step: "03",
                title: "Semantic Matching",
                desc: "Your resume and the job description are converted into high-dimensional vectors using Sentence-BERT. Cosine similarity measures how semantically close they are — giving you a match score.",
                tech: "Sentence-BERT · all-MiniLM-L6-v2"
              },
              {
                step: "04",
                title: "ATS Simulation",
                desc: "TF-IDF vectorization simulates how an Applicant Tracking System scores your resume against the job description based on keyword frequency and relevance.",
                tech: "scikit-learn · TF-IDF"
              },
              {
                step: "05",
                title: "Skill Gap Detection",
                desc: "Skills mentioned in the job description are compared against skills found in your resume. Missing skills are ranked by importance to help you prioritize what to add.",
                tech: "Custom NLP pipeline"
              },
              {
                step: "06",
                title: "AI Suggestions",
                desc: "Llama 3 — a large language model running via Groq — reads your resume and job description to generate personalized rewrite suggestions, improved bullet points, and actionable tips.",
                tech: "Llama 3.3 70B · Groq API"
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="text-purple-400 font-extrabold text-2xl w-10 shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-2">{item.desc}</p>
                  <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
                    {item.tech}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">🛠️ Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { layer: "Frontend", tech: "Next.js + TailwindCSS" },
              { layer: "Backend", tech: "FastAPI (Python)" },
              { layer: "NLP Engine", tech: "spaCy + Sentence-BERT" },
              { layer: "ATS Scoring", tech: "scikit-learn TF-IDF" },
              { layer: "LLM", tech: "Llama 3.3 via Groq" },
              { layer: "Database", tech: "Supabase PostgreSQL" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs mb-1">{item.layer}</p>
                <p className="font-semibold text-sm">{item.tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4"> Architecture</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            ResumeAI uses a decoupled client-server architecture. The Next.js frontend communicates with the FastAPI backend via REST API calls. The backend orchestrates three AI models working in a pipeline — spaCy for extraction, Sentence-BERT for semantic analysis, and Llama 3 for generative suggestions.
          </p>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-sm text-white/60">
            <p>Next.js Frontend</p>
            <p className="ml-4">↓ HTTP POST /api/analyze</p>
            <p>FastAPI Backend</p>
            <p className="ml-4">↓ parse_resume()</p>
            <p className="ml-4">↓ extract_entities()  — spaCy</p>
            <p className="ml-4">↓ calculate_match()   — Sentence-BERT</p>
            <p className="ml-4">↓ calculate_ats()     — TF-IDF</p>
            <p className="ml-4">↓ generate_suggestions() — Llama 3</p>
            <p>JSON Response → Results Page</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Try it yourself</h2>
          <p className="text-white/50 mb-8">Upload your resume and see the full analysis in seconds.</p>
          <Link href="/analyze" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition px-10 py-4 rounded-xl font-semibold text-lg">
            Analyze My Resume →
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-8 text-white/30 text-sm mt-16">
        © 2026 ResumeAI 
      </footer>

    </main>
  );
}