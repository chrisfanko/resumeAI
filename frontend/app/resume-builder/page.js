"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Navbar from "../Navbar";
import {
  User, Briefcase, GraduationCap, Wrench,
  Eye, ChevronRight, ChevronLeft, Sparkles,
  Plus, Trash2, FileText, Copy, Check, Loader2, Download
} from "lucide-react";

const STEPS = [
  { id: "personal",   label: "Personal",   icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education",  label: "Education",  icon: GraduationCap },
  { id: "skills",     label: "Skills",     icon: Wrench },
  { id: "preview",    label: "Preview",    icon: Eye },
];

const emptyExperience = () => ({ job_title: "", company: "", location: "", start_date: "", end_date: "", description: "" });
const emptyEducation  = () => ({ degree: "", institution: "", location: "", graduation_year: "", gpa: "" });

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151" }}>
        {label}{required && <span style={{ color: "#16a34a", marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}

export default function ResumeBuilder() {
  const [step, setStep]               = useState(0);
  const [copied, setCopied]           = useState(false);
  const [building, setBuilding]       = useState(false);
  const [builtResume, setBuiltResume] = useState("");
  const [buildError, setBuildError]   = useState("");
  const [personal, setPersonal]       = useState({ full_name: "", email: "", phone: "", location: "", linkedin: "", website: "", summary: "" });
  const [experiences, setExperiences] = useState([emptyExperience()]);
  const [enhancing, setEnhancing]     = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [educations, setEducations]   = useState([emptyEducation()]);
  const [skillInput, setSkillInput]   = useState("");
  const [skills, setSkills]           = useState([]);
  const [targetRole, setTargetRole]   = useState("");

  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
  const setP   = (key) => (val) => setPersonal(p => ({ ...p, [key]: val }));
  const setExp = (i, key) => (val) => setExperiences(exps => exps.map((e, idx) => idx === i ? { ...e, [key]: val } : e));
  const setEdu = (i, key) => (val) => setEducations(eds => eds.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const addSkill = () => {
    const t = skillInput.trim();
    if (t && !skills.includes(t)) setSkills(s => [...s, t]);
    setSkillInput("");
  };

  const handleEnhanceBullet = async (i) => {
    const exp = experiences[i];
    if (!exp.description.trim()) return;
    setEnhancing(h => ({ ...h, [`exp-${i}`]: true }));
    try {
      const res = await axios.post("/api/resume/enhance-bullet", {
        bullet_text: exp.description, job_title: exp.job_title || "Professional",
        company: exp.company || "Company", target_role: targetRole,
      }, { headers: getAuthHeader() });
      setExp(i, "description")(res.data.enhanced);
    } catch {}
    finally { setEnhancing(h => ({ ...h, [`exp-${i}`]: false })); }
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await axios.post("/api/resume/generate-summary", {
        full_name: personal.full_name || "Candidate",
        target_job_title: targetRole || "Professional",
        skills, years_of_experience: Math.max(1, experiences.length * 2),
        key_achievements: experiences.map(e => e.description).join(". "),
      }, { headers: getAuthHeader() });
      setP("summary")(res.data.summary);
    } catch {}
    finally { setSummaryLoading(false); }
  };

  const handleBuildResume = async () => {
    setBuilding(true); setBuildError("");
    try {
      const res = await axios.post("/api/resume/build", {
        personal_info: personal, experiences, educations, skills,
        target_job_title: targetRole, target_job_description: "",
      }, { headers: getAuthHeader() });
      setBuiltResume(res.data.resume_text);
    } catch { setBuildError("Could not build resume. Make sure you are logged in and the backend is running."); }
    finally { setBuilding(false); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(builtResume); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const loadJsPdf = () => new Promise((resolve, reject) => {
    if (window.jspdf) return resolve(window.jspdf);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const { jsPDF } = await loadJsPdf();
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 56;
      const maxWidth = pageWidth - margin * 2;
      let y = 64;

      // Name header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39);
      doc.text(personal.full_name || "Resume", margin, y);
      y += 22;

      // Contact line
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);
      doc.text(contactParts.join("  |  "), margin, y);
      y += 18;

      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(1.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 24;

      // Body text from AI-built resume, parsed line by line
      const lines = builtResume.split("\n");
      doc.setTextColor(31, 41, 55);

      for (let raw of lines) {
        const line = raw.trimEnd();
        if (y > 740) { doc.addPage(); y = 56; }

        if (line.trim() === "") { y += 8; continue; }

        const isHeader = /^[A-Z0-9 .,&/'-]{3,}$/.test(line.trim()) && line.trim().length < 40;

        if (isHeader) {
          y += 6;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(22, 163, 74);
          doc.text(line.trim(), margin, y);
          y += 6;
          doc.setDrawColor(220, 252, 231);
          doc.setLineWidth(0.8);
          doc.line(margin, y, pageWidth - margin, y);
          y += 16;
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
          doc.setTextColor(55, 65, 81);
          const wrapped = doc.splitTextToSize(line, maxWidth);
          for (const w of wrapped) {
            if (y > 740) { doc.addPage(); y = 56; }
            doc.text(w, margin, y);
            y += 14;
          }
        }
      }

      const safeName = (personal.full_name || "resume").trim().replace(/\s+/g, "_");
      doc.save(`${safeName}_resume.pdf`);
    } catch (e) {
      setBuildError("Could not generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const canNext = () => {
    if (step === 0) return personal.full_name && personal.email && personal.phone && personal.location;
    if (step === 1) return experiences.every(e => e.job_title && e.company && e.start_date && e.end_date);
    if (step === 2) return educations.every(e => e.degree && e.institution && e.graduation_year);
    if (step === 3) return skills.length > 0;
    return true;
  };

  const SUGGESTIONS = ["Python", "JavaScript", "React", "SQL", "Node.js", "Git", "Docker", "AWS", "TypeScript", "Figma", "Excel", "Communication"];

  const renderStep = () => {
    if (step === 0) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name"           required value={personal.full_name} onChange={setP("full_name")} placeholder="John Doe" />
        <Field label="Email"               required type="email" value={personal.email} onChange={setP("email")} placeholder="john@example.com" />
        <Field label="Phone"               required value={personal.phone}    onChange={setP("phone")}    placeholder="+1 555 000 0000" />
        <Field label="Location"            required value={personal.location} onChange={setP("location")} placeholder="New York, NY" />
        <Field label="LinkedIn URL"                 value={personal.linkedin} onChange={setP("linkedin")} placeholder="linkedin.com/in/johndoe" />
        <Field label="Website / Portfolio"          value={personal.website}  onChange={setP("website")}  placeholder="johndoe.dev" />
        <Field label="Target Job Title"             value={targetRole}        onChange={setTargetRole}     placeholder="Senior Software Engineer" />
        <div className="md:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151" }}>Professional Summary</label>
            <button onClick={handleGenerateSummary} disabled={summaryLoading} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", opacity: summaryLoading ? 0.5 : 1 }}>
              {summaryLoading ? <><Loader2 size={12} className="animate-spin" /> Generating…</> : <><Sparkles size={12} /> AI Generate</>}
            </button>
          </div>
          <textarea value={personal.summary} onChange={e => setP("summary")(e.target.value)} placeholder="Write a short professional summary, or click AI Generate above…" rows={4} className="textarea" />
        </div>
      </div>
    );

    if (step === 1) return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {experiences.map((exp, i) => (
          <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: "#374151" }}>Experience {i + 1}</span>
              {experiences.length > 1 && <button onClick={() => setExperiences(e => e.filter((_, idx) => idx !== i))} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={15} /></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Job Title"  required value={exp.job_title}  onChange={setExp(i, "job_title")}  placeholder="Software Engineer" />
              <Field label="Company"    required value={exp.company}    onChange={setExp(i, "company")}    placeholder="Google" />
              <Field label="Location"            value={exp.location}   onChange={setExp(i, "location")}   placeholder="Mountain View, CA" />
              <div />
              <Field label="Start Date" required value={exp.start_date} onChange={setExp(i, "start_date")} placeholder="Jan 2022" />
              <Field label="End Date"   required value={exp.end_date}   onChange={setExp(i, "end_date")}   placeholder="Present" />
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151" }}>Description <span style={{ color: "#16a34a" }}>*</span></label>
                <button onClick={() => handleEnhanceBullet(i)} disabled={enhancing[`exp-${i}`]} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", opacity: enhancing[`exp-${i}`] ? 0.5 : 1 }}>
                  {enhancing[`exp-${i}`] ? <><Loader2 size={12} className="animate-spin" /> Enhancing…</> : <><Sparkles size={12} /> AI Enhance</>}
                </button>
              </div>
              <textarea value={exp.description} onChange={e => setExp(i, "description")(e.target.value)} placeholder="Describe your responsibilities. Click AI Enhance to improve automatically." rows={4} className="textarea" />
            </div>
          </div>
        ))}
        <button onClick={() => setExperiences(e => [...e, emptyExperience()])} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#16a34a", background: "none", border: "none", cursor: "pointer" }}>
          <Plus size={15} /> Add another experience
        </button>
      </div>
    );

    if (step === 2) return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {educations.map((edu, i) => (
          <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: "#374151" }}>Education {i + 1}</span>
              {educations.length > 1 && <button onClick={() => setEducations(e => e.filter((_, idx) => idx !== i))} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={15} /></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Degree"          required value={edu.degree}          onChange={setEdu(i, "degree")}          placeholder="B.Sc. Computer Science" />
              <Field label="Institution"     required value={edu.institution}     onChange={setEdu(i, "institution")}     placeholder="MIT" />
              <Field label="Location"                 value={edu.location}         onChange={setEdu(i, "location")}        placeholder="Cambridge, MA" />
              <Field label="Graduation Year" required value={edu.graduation_year} onChange={setEdu(i, "graduation_year")} placeholder="2024" />
              <Field label="GPA (optional)"           value={edu.gpa}              onChange={setEdu(i, "gpa")}             placeholder="3.8 / 4.0" />
            </div>
          </div>
        ))}
        <button onClick={() => setEducations(e => [...e, emptyEducation()])} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#16a34a", background: "none", border: "none", cursor: "pointer" }}>
          <Plus size={15} /> Add another education
        </button>
      </div>
    );

    if (step === 3) return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>
            Add skills <span style={{ color: "#16a34a" }}>*</span>
            <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 6 }}>press Enter or comma to add</span>
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }} placeholder="e.g. Python, React, SQL…" className="input" style={{ flex: 1 }} />
            <button onClick={addSkill} className="btn-primary" style={{ padding: "10px 18px", flexShrink: 0 }}>Add</button>
          </div>
        </div>
        {skills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map(skill => (
              <span key={skill} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "5px 12px", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13 }}>
                {skill}
                <button onClick={() => setSkills(s => s.filter(sk => sk !== skill))} style={{ color: "#86efac", background: "none", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
        )}
        {skills.length === 0 && <p style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 13 }}>No skills added yet.</p>}
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 8 }}>Common suggestions</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SUGGESTIONS.filter(s => !skills.includes(s)).map(s => (
              <button key={s} onClick={() => setSkills(sk => [...sk, s])} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, border: "1px solid #e2e8f0", color: "#64748b", padding: "5px 12px", borderRadius: 100, background: "white", cursor: "pointer", transition: "all 0.15s" }}>
                + {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    if (step === 4) return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {!builtResume && !building && (
          <div style={{ textAlign: "center", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: 60, height: 60, background: "#f0fdf4", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={28} color="#16a34a" />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 17, color: "#111827" }}>Ready to build your resume?</h3>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, marginTop: 4 }}>Our AI will polish and format everything for you.</p>
            </div>
            {buildError && <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 16px", maxWidth: 440 }}><p style={{ fontFamily: "'Lato', sans-serif", color: "#991b1b", fontSize: 13 }}>{buildError}</p></div>}
            <button onClick={handleBuildResume} className="btn-primary" style={{ padding: "13px 28px", fontSize: 15 }}>
              <Sparkles size={15} /> Build my resume with AI
            </button>
          </div>
        )}
        {building && (
          <div style={{ textAlign: "center", padding: "64px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Loader2 size={36} color="#16a34a" className="animate-spin" />
            <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14 }}>AI is polishing your resume…</p>
          </div>
        )}
        {builtResume && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827" }}>Your resume</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleCopy} className="btn-secondary" style={{ padding: "7px 14px", fontSize: 13 }}>
                  {copied ? <><Check size={13} color="#16a34a" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
                <button onClick={handleDownloadPdf} disabled={downloadingPdf} className="btn-primary" style={{ padding: "7px 14px", fontSize: 13 }}>
                  {downloadingPdf ? <><Loader2 size={13} className="animate-spin" /> Preparing…</> : <><Download size={13} /> Download PDF</>}
                </button>
                <button onClick={handleBuildResume} className="btn-secondary" style={{ padding: "7px 14px", fontSize: 13 }}>
                  <Sparkles size={13} /> Regenerate
                </button>
              </div>
            </div>
            <pre style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "24px", fontFamily: "'Courier New', monospace", fontSize: 13, color: "#374151", whiteSpace: "pre-wrap", lineHeight: 1.7, overflowY: "auto", maxHeight: "60vh" }}>
              {builtResume}
            </pre>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
              Copy this text into Word or Google Docs to apply final formatting.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="page-shell">
      <Navbar />
      <div className="container-center py-10">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span className="section-tag">AI Resume Builder</span>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", color: "#111827" }}>Build your resume</h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, marginTop: 4 }}>Fill in your details — AI will enhance and format everything.</p>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active   = i === step;
            const complete = i < step;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => i < step && setStep(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 8, border: "none",
                    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                    cursor: complete ? "pointer" : "default",
                    background: active ? "#16a34a" : "transparent",
                    color: active ? "white" : complete ? "#16a34a" : "#94a3b8",
                    transition: "all 0.15s", whiteSpace: "nowrap",
                    boxShadow: active ? "0 4px 14px rgba(22,163,74,0.25)" : "none",
                  }}
                >
                  <Icon size={14} /> {s.label}
                </button>
                {i < STEPS.length - 1 && <ChevronRight size={14} color={i < step ? "#16a34a" : "#e2e8f0"} style={{ flexShrink: 0, margin: "0 2px" }} />}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "28px 32px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 20 }}>{STEPS[step].label}</h2>
          {renderStep()}
        </div>

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="btn-secondary" style={{ opacity: step === 0 ? 0.3 : 1, cursor: step === 0 ? "not-allowed" : "pointer" }}>
            <ChevronLeft size={15} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary" style={{ opacity: !canNext() ? 0.4 : 1, cursor: !canNext() ? "not-allowed" : "pointer" }}>
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <Link href="/analyze" className="btn-secondary">Go analyze a job <ChevronRight size={15} /></Link>
          )}
        </div>
      </div>
    </main>
  );
}