"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  User, Briefcase, GraduationCap, Wrench,
  Eye, ChevronRight, ChevronLeft, Sparkles,
  Plus, Trash2, FileText, Copy, Check, Loader2
} from "lucide-react";

// ── Step config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: "personal",    label: "Personal",   icon: User },
  { id: "experience",  label: "Experience", icon: Briefcase },
  { id: "education",   label: "Education",  icon: GraduationCap },
  { id: "skills",      label: "Skills",     icon: Wrench },
  { id: "preview",     label: "Preview",    icon: Eye },
];

// ── Empty templates ───────────────────────────────────────────────────────────
const emptyExperience = () => ({
  job_title: "", company: "", location: "",
  start_date: "", end_date: "", description: "",
});
const emptyEducation = () => ({
  degree: "", institution: "", location: "",
  graduation_year: "", gpa: "",
});

// ── Small reusable input ──────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-indigo-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [step, setStep]         = useState(0);
  const [copied, setCopied]     = useState(false);
  const [building, setBuilding] = useState(false);
  const [builtResume, setBuiltResume] = useState("");
  const [buildError, setBuildError]   = useState("");

  // Personal info
  const [personal, setPersonal] = useState({
    full_name: "", email: "", phone: "", location: "",
    linkedin: "", website: "", summary: "",
  });

  // Experiences
  const [experiences, setExperiences] = useState([emptyExperience()]);
  const [enhancing, setEnhancing]     = useState({});   // { "exp-0": true }
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Education
  const [educations, setEducations] = useState([emptyEducation()]);

  // Skills
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills]         = useState([]);
  const [targetRole, setTargetRole] = useState("");

  const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  // ── Personal helpers ────────────────────────────────────────────────────────
  const setP = (key) => (val) => setPersonal(p => ({ ...p, [key]: val }));

  // ── Experience helpers ──────────────────────────────────────────────────────
  const setExp = (i, key) => (val) =>
    setExperiences(exps => exps.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const addExp    = () => setExperiences(e => [...e, emptyExperience()]);
  const removeExp = (i) => setExperiences(e => e.filter((_, idx) => idx !== i));

  const handleEnhanceBullet = async (i) => {
    const exp = experiences[i];
    if (!exp.description.trim()) return;
    setEnhancing(h => ({ ...h, [`exp-${i}`]: true }));
    try {
      const res = await axios.post("/api/resume/enhance-bullet", {
        bullet_text: exp.description,
        job_title:   exp.job_title   || "Professional",
        company:     exp.company     || "Company",
        target_role: targetRole,
      }, { headers: getAuthHeader() });
      setExp(i, "description")(res.data.enhanced);
    } catch {
      // silently fail — keep original text
    } finally {
      setEnhancing(h => ({ ...h, [`exp-${i}`]: false }));
    }
  };

  // ── Education helpers ───────────────────────────────────────────────────────
  const setEdu = (i, key) => (val) =>
    setEducations(eds => eds.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const addEdu    = () => setEducations(e => [...e, emptyEducation()]);
  const removeEdu = (i) => setEducations(e => e.filter((_, idx) => idx !== i));

  // ── Skill helpers ───────────────────────────────────────────────────────────
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(s => [...s, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills(s => s.filter(sk => sk !== skill));

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
  };

  // ── AI summary ──────────────────────────────────────────────────────────────
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const years = experiences.length
        ? Math.max(1, experiences.length * 2)
        : 0;
      const res = await axios.post("/api/resume/generate-summary", {
        full_name:           personal.full_name || "Candidate",
        target_job_title:    targetRole || "Professional",
        skills:              skills,
        years_of_experience: years,
        key_achievements:    experiences.map(e => e.description).join(". "),
      }, { headers: getAuthHeader() });
      setP("summary")(res.data.summary);
    } catch {
      // silently fail
    } finally {
      setSummaryLoading(false);
    }
  };

  // ── Build final resume ──────────────────────────────────────────────────────
  const handleBuildResume = async () => {
    setBuilding(true);
    setBuildError("");
    try {
      const res = await axios.post("/api/resume/build", {
        personal_info: personal,
        experiences,
        educations,
        skills,
        target_job_title:      targetRole,
        target_job_description: "",
      }, { headers: getAuthHeader() });
      setBuiltResume(res.data.resume_text);
    } catch (err) {
      setBuildError("Could not build resume. Make sure the backend is running and you are logged in.");
    } finally {
      setBuilding(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(builtResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Validation per step ─────────────────────────────────────────────────────
  const canNext = () => {
    if (step === 0) return personal.full_name && personal.email && personal.phone && personal.location;
    if (step === 1) return experiences.every(e => e.job_title && e.company && e.start_date && e.end_date);
    if (step === 2) return educations.every(e => e.degree && e.institution && e.graduation_year);
    if (step === 3) return skills.length > 0;
    return true;
  };

  // ── Render steps ────────────────────────────────────────────────────────────
  const renderStep = () => {
    // STEP 0 — Personal Info
    if (step === 0) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name"    required value={personal.full_name} onChange={setP("full_name")} placeholder="John Doe" />
        <Field label="Email"        required type="email" value={personal.email} onChange={setP("email")} placeholder="john@example.com" />
        <Field label="Phone"        required value={personal.phone}    onChange={setP("phone")}    placeholder="+1 555 000 0000" />
        <Field label="Location"     required value={personal.location} onChange={setP("location")} placeholder="New York, NY" />
        <Field label="LinkedIn URL"          value={personal.linkedin} onChange={setP("linkedin")} placeholder="linkedin.com/in/johndoe" />
        <Field label="Website / Portfolio"   value={personal.website}  onChange={setP("website")}  placeholder="johndoe.dev" />
        <Field label="Target Job Title"      value={targetRole}        onChange={setTargetRole}     placeholder="Senior Software Engineer" />

        {/* Professional Summary */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Professional Summary</label>
            <button
              onClick={handleGenerateSummary}
              disabled={summaryLoading}
              className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition disabled:opacity-50"
            >
              {summaryLoading
                ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                : <><Sparkles size={13} /> AI Generate</>}
            </button>
          </div>
          <textarea
            value={personal.summary}
            onChange={e => setP("summary")(e.target.value)}
            placeholder="Write a short professional summary, or click AI Generate above…"
            rows={4}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
      </div>
    );

    // STEP 1 — Experience
    if (step === 1) return (
      <div className="flex flex-col gap-6">
        {experiences.map((exp, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-5 bg-slate-50 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-700">Experience {i + 1}</span>
              {experiences.length > 1 && (
                <button onClick={() => removeExp(i)} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Job Title"  required value={exp.job_title}  onChange={setExp(i, "job_title")}  placeholder="Software Engineer" />
              <Field label="Company"    required value={exp.company}    onChange={setExp(i, "company")}    placeholder="Google" />
              <Field label="Location"            value={exp.location}   onChange={setExp(i, "location")}   placeholder="Mountain View, CA" />
              <div /> {/* spacer */}
              <Field label="Start Date" required value={exp.start_date} onChange={setExp(i, "start_date")} placeholder="Jan 2022" />
              <Field label="End Date"   required value={exp.end_date}   onChange={setExp(i, "end_date")}   placeholder="Present" />
            </div>
            {/* Bullet description + AI enhance */}
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Description / Bullet Points <span className="text-indigo-500">*</span>
                </label>
                <button
                  onClick={() => handleEnhanceBullet(i)}
                  disabled={enhancing[`exp-${i}`]}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition disabled:opacity-50"
                >
                  {enhancing[`exp-${i}`]
                    ? <><Loader2 size={13} className="animate-spin" /> Enhancing…</>
                    : <><Sparkles size={13} /> AI Enhance</>}
                </button>
              </div>
              <textarea
                value={exp.description}
                onChange={e => setExp(i, "description")(e.target.value)}
                placeholder="Describe your responsibilities and achievements. Click AI Enhance to improve them automatically."
                rows={4}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>
          </div>
        ))}
        <button
          onClick={addExp}
          className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition self-start"
        >
          <Plus size={16} /> Add Another Experience
        </button>
      </div>
    );

    // STEP 2 — Education
    if (step === 2) return (
      <div className="flex flex-col gap-6">
        {educations.map((edu, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-700">Education {i + 1}</span>
              {educations.length > 1 && (
                <button onClick={() => removeEdu(i)} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Degree"          required value={edu.degree}           onChange={setEdu(i, "degree")}          placeholder="B.Sc. Computer Science" />
              <Field label="Institution"     required value={edu.institution}      onChange={setEdu(i, "institution")}     placeholder="MIT" />
              <Field label="Location"                 value={edu.location}          onChange={setEdu(i, "location")}        placeholder="Cambridge, MA" />
              <Field label="Graduation Year" required value={edu.graduation_year}  onChange={setEdu(i, "graduation_year")} placeholder="2024" />
              <Field label="GPA (optional)"           value={edu.gpa}               onChange={setEdu(i, "gpa")}             placeholder="3.8 / 4.0" />
            </div>
          </div>
        ))}
        <button
          onClick={addEdu}
          className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition self-start"
        >
          <Plus size={16} /> Add Another Education
        </button>
      </div>
    );

    // STEP 3 — Skills
    if (step === 3) return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Add Skills <span className="text-indigo-500">*</span>
            <span className="text-slate-400 font-normal ml-2">(press Enter or comma to add)</span>
          </label>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. Python, React, SQL…"
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
            <button
              onClick={addSkill}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Skill chips */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span
                key={skill}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full border border-indigo-100"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-indigo-700 transition">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {skills.length === 0 && (
          <p className="text-slate-400 text-sm">No skills added yet. Type a skill and press Enter.</p>
        )}

        {/* Suggestions */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Common suggestions</p>
          <div className="flex flex-wrap gap-2">
            {["Python", "JavaScript", "React", "SQL", "Node.js", "Git", "Docker", "AWS", "TypeScript", "Figma", "Excel", "Communication"].map(s => (
              !skills.includes(s) && (
                <button
                  key={s}
                  onClick={() => setSkills(sk => [...sk, s])}
                  className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition"
                >
                  + {s}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    );

    // STEP 4 — Preview
    if (step === 4) return (
      <div className="flex flex-col gap-6">
        {!builtResume && !building && (
          <div className="text-center py-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <FileText size={32} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Ready to build your resume?</h3>
              <p className="text-slate-500 text-sm mt-1">Our AI will polish and format everything for you.</p>
            </div>
            {buildError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 max-w-md">
                {buildError}
              </div>
            )}
            <button
              onClick={handleBuildResume}
              className="btn-primary flex items-center gap-2 mt-2"
            >
              <Sparkles size={16} /> Build My Resume with AI
            </button>
          </div>
        )}

        {building && (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-indigo-500 animate-spin" />
            <p className="text-slate-600 font-medium">AI is polishing your resume…</p>
          </div>
        )}

        {builtResume && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Your Resume</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm border border-slate-200 px-3 py-2 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition font-medium"
                >
                  {copied ? <><Check size={14} className="text-green-500" /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
                <button
                  onClick={handleBuildResume}
                  className="flex items-center gap-1.5 text-sm bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100 transition font-medium"
                >
                  <Sparkles size={14} /> Regenerate
                </button>
              </div>
            </div>
            <pre className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-800 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-[60vh]">
              {builtResume}
            </pre>
            <p className="text-xs text-slate-400 text-center">
              Copy this text into Word, Google Docs, or any resume tool to apply final formatting.
            </p>
          </div>
        )}
      </div>
    );
  };

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="container-center flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText size={16} color="white" />
            </div>
            <span className="font-bold text-lg text-slate-900">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/analyze"    className="text-slate-500 hover:text-slate-900 transition font-medium">Analyze</Link>
            <Link href="/dashboard"  className="text-slate-500 hover:text-slate-900 transition font-medium">Dashboard</Link>
            <Link href="/cover-letter" className="text-slate-500 hover:text-slate-900 transition font-medium">Cover Letter</Link>
          </div>
        </div>
      </nav>

      <div className="container-center py-10">

        {/* Header */}
        <div className="mb-8">
          <span className="section-tag">AI Resume Builder</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Build Your Resume</h1>
          <p className="text-slate-500 mt-1">Fill in your details — AI will enhance and format everything.</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active   = i === step;
            const complete = i < step;
            return (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap
                    ${active   ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : ""}
                    ${complete ? "text-indigo-600 hover:bg-indigo-50 cursor-pointer" : ""}
                    ${!active && !complete ? "text-slate-400 cursor-default" : ""}
                  `}
                >
                  <Icon size={15} />
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={16} className={`mx-1 flex-shrink-0 ${i < step ? "text-indigo-400" : "text-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">{STEPS[step].label}</h2>
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <Link href="/analyze" className="btn-secondary flex items-center gap-2">
              Go Analyze a Job <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}