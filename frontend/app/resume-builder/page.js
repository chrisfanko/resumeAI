"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  PenLine,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
  WandSparkles,
} from "lucide-react";

const emptyExperience = () => ({
  job_title: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
});

const emptyEducation = () => ({
  degree: "",
  institution: "",
  location: "",
  graduation_year: "",
  gpa: "",
});

const steps = [
  { label: "Profile", icon: UserRound },
  { label: "Experience", icon: PenLine },
  { label: "Education & skills", icon: GraduationCap },
  { label: "Review", icon: FileText },
];

export default function ResumeBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [copied, setCopied] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  });

  const [target, setTarget] = useState({
    jobTitle: "",
    jobDescription: "",
  });

  const [experiences, setExperiences] = useState([emptyExperience()]);
  const [educations, setEducations] = useState([emptyEducation()]);
  const [skillsInput, setSkillsInput] = useState("");

  const skills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [skillsInput]
  );

  const tokenHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const updatePersonalInfo = (field, value) => {
    setPersonalInfo((current) => ({ ...current, [field]: value }));
  };

  const updateTarget = (field, value) => {
    setTarget((current) => ({ ...current, [field]: value }));
  };

  const updateExperience = (index, field, value) => {
    setExperiences((current) =>
      current.map((experience, experienceIndex) =>
        experienceIndex === index
          ? { ...experience, [field]: value }
          : experience
      )
    );
  };

  const updateEducation = (index, field, value) => {
    setEducations((current) =>
      current.map((education, educationIndex) =>
        educationIndex === index ? { ...education, [field]: value } : education
      )
    );
  };

  const enhanceBullet = async (index) => {
    const experience = experiences[index];

    if (!experience.description.trim()) {
      setError("Add an experience description before using AI Enhance.");
      return;
    }

    setLoadingAction(`enhance-${index}`);
    setError("");

    try {
      const response = await axios.post(
        "/api/resume/enhance-bullet",
        {
          bullet_text: experience.description,
          job_title: experience.job_title,
          company: experience.company,
          target_role: target.jobTitle,
        },
        tokenHeader()
      );

      updateExperience(index, "description", response.data.enhanced);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "AI Enhance failed. Please make sure the backend is running."
      );
    } finally {
      setLoadingAction("");
    }
  };

  const generateSummary = async () => {
    if (!personalInfo.full_name.trim() || !target.jobTitle.trim()) {
      setError("Add your name and target job title before generating a summary.");
      return;
    }

    setLoadingAction("summary");
    setError("");

    try {
      const response = await axios.post(
        "/api/resume/generate-summary",
        {
          full_name: personalInfo.full_name,
          target_job_title: target.jobTitle,
          skills,
          years_of_experience: 0,
          key_achievements: experiences
            .map((experience) => experience.description)
            .filter(Boolean)
            .join(" "),
        },
        tokenHeader()
      );

      updatePersonalInfo("summary", response.data.summary);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "We could not generate a summary right now."
      );
    } finally {
      setLoadingAction("");
    }
  };

  const buildResume = async () => {
    if (!personalInfo.full_name.trim()) {
      setError("Add your name before building your resume.");
      setActiveStep(0);
      return;
    }

    setLoadingAction("build");
    setError("");

    try {
      const response = await axios.post(
        "/api/resume/build",
        {
          personal_info: personalInfo,
          experiences,
          educations,
          skills,
          target_job_title: target.jobTitle,
          target_job_description: target.jobDescription,
        },
        tokenHeader()
      );

      setResumeText(response.data.resume_text);
      setActiveStep(3);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "We could not build your resume right now."
      );
    } finally {
      setLoadingAction("");
    }
  };

  const copyResume = async () => {
    if (!resumeText) return;
    await navigator.clipboard.writeText(resumeText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadResume = () => {
    if (!resumeText) return;

    const file = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${personalInfo.full_name || "resume"}-resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 3));
  const previousStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  return (
    <main className="builder-page">
      <Navbar />

      <section className="builder-shell">
        <div className="container-center">
          <div className="builder-heading">
            <div>
              <div className="builder-eyebrow">
                <Sparkles size={14} />
                AI resume builder
              </div>
              <h1>Build a resume that feels like you.</h1>
              <p>
                Add your experience, polish it with AI, and create a clean
                ATS-friendly version ready to tailor for your next role.
              </p>
            </div>

            <div className="builder-status">
              <span>Step {activeStep + 1} of 4</span>
              <strong>{steps[activeStep].label}</strong>
            </div>
          </div>

          <div className="builder-stepper">
            {steps.map(({ label, icon: Icon }, index) => (
              <button
                key={label}
                type="button"
                className={`builder-step ${
                  index === activeStep ? "is-active" : ""
                } ${index < activeStep ? "is-complete" : ""}`}
                onClick={() => setActiveStep(index)}
              >
                <span>
                  {index < activeStep ? <Check size={15} /> : <Icon size={16} />}
                </span>
                <strong>{label}</strong>
              </button>
            ))}
          </div>

          <div className="builder-layout">
            <section className="builder-form-card">
              {activeStep === 0 && (
                <div className="builder-step-content">
                  <div className="builder-section-title">
                    <div className="builder-section-icon"><UserRound size={19} /></div>
                    <div>
                      <span>Start with the essentials</span>
                      <h2>Your professional profile</h2>
                    </div>
                  </div>

                  <div className="builder-input-grid">
                    <label className="builder-field builder-field-wide">
                      <span>Full name</span>
                      <input
                        value={personalInfo.full_name}
                        onChange={(event) =>
                          updatePersonalInfo("full_name", event.target.value)
                        }
                        placeholder="Jane Smith"
                      />
                    </label>

                    <label className="builder-field">
                      <span>Email address</span>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(event) =>
                          updatePersonalInfo("email", event.target.value)
                        }
                        placeholder="jane@email.com"
                      />
                    </label>

                    <label className="builder-field">
                      <span>Phone number</span>
                      <input
                        value={personalInfo.phone}
                        onChange={(event) =>
                          updatePersonalInfo("phone", event.target.value)
                        }
                        placeholder="+33 6 00 00 00 00"
                      />
                    </label>

                    <label className="builder-field">
                      <span>Location</span>
                      <input
                        value={personalInfo.location}
                        onChange={(event) =>
                          updatePersonalInfo("location", event.target.value)
                        }
                        placeholder="Paris, France"
                      />
                    </label>

                    <label className="builder-field">
                      <span>LinkedIn URL <em>Optional</em></span>
                      <input
                        value={personalInfo.linkedin}
                        onChange={(event) =>
                          updatePersonalInfo("linkedin", event.target.value)
                        }
                        placeholder="linkedin.com/in/janesmith"
                      />
                    </label>

                    <label className="builder-field builder-field-wide">
                      <span>Target job title</span>
                      <input
                        value={target.jobTitle}
                        onChange={(event) =>
                          updateTarget("jobTitle", event.target.value)
                        }
                        placeholder="Product Designer"
                      />
                    </label>

                    <label className="builder-field builder-field-wide">
                      <span>Target job description <em>Optional</em></span>
                      <textarea
                        value={target.jobDescription}
                        onChange={(event) =>
                          updateTarget("jobDescription", event.target.value)
                        }
                        placeholder="Paste a job description to tailor your resume..."
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="builder-step-content">
                  <div className="builder-section-title">
                    <div className="builder-section-icon"><PenLine size={19} /></div>
                    <div>
                      <span>Show the impact you made</span>
                      <h2>Your work experience</h2>
                    </div>
                  </div>

                  <div className="builder-repeat-list">
                    {experiences.map((experience, index) => (
                      <article className="builder-repeat-card" key={index}>
                        <div className="repeat-card-heading">
                          <span>Experience {String(index + 1).padStart(2, "0")}</span>
                          {experiences.length > 1 && (
                            <button
                              type="button"
                              className="icon-delete-button"
                              onClick={() =>
                                setExperiences((current) =>
                                  current.filter((_, itemIndex) => itemIndex !== index)
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <div className="builder-input-grid">
                          <label className="builder-field">
                            <span>Job title</span>
                            <input
                              value={experience.job_title}
                              onChange={(event) =>
                                updateExperience(index, "job_title", event.target.value)
                              }
                              placeholder="UX Designer"
                            />
                          </label>

                          <label className="builder-field">
                            <span>Company</span>
                            <input
                              value={experience.company}
                              onChange={(event) =>
                                updateExperience(index, "company", event.target.value)
                              }
                              placeholder="Company name"
                            />
                          </label>

                          <label className="builder-field">
                            <span>Start date</span>
                            <input
                              value={experience.start_date}
                              onChange={(event) =>
                                updateExperience(index, "start_date", event.target.value)
                              }
                              placeholder="Jan 2022"
                            />
                          </label>

                          <label className="builder-field">
                            <span>End date</span>
                            <input
                              value={experience.end_date}
                              onChange={(event) =>
                                updateExperience(index, "end_date", event.target.value)
                              }
                              placeholder="Present"
                            />
                          </label>

                          <label className="builder-field builder-field-wide">
                            <span>What did you achieve?</span>
                            <textarea
                              value={experience.description}
                              onChange={(event) =>
                                updateExperience(index, "description", event.target.value)
                              }
                              placeholder="Describe your responsibilities, successes, and measurable impact..."
                            />
                          </label>
                        </div>

                        <button
                          type="button"
                          className="ai-enhance-button"
                          onClick={() => enhanceBullet(index)}
                          disabled={loadingAction === `enhance-${index}`}
                        >
                          {loadingAction === `enhance-${index}` ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <WandSparkles size={15} />
                          )}
                          AI Enhance this description
                        </button>
                      </article>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="add-repeat-button"
                    onClick={() =>
                      setExperiences((current) => [...current, emptyExperience()])
                    }
                  >
                    <Plus size={17} /> Add another experience
                  </button>
                </div>
              )}

              {activeStep === 2 && (
                <div className="builder-step-content">
                  <div className="builder-section-title">
                    <div className="builder-section-icon"><GraduationCap size={19} /></div>
                    <div>
                      <span>Complete your background</span>
                      <h2>Education and skills</h2>
                    </div>
                  </div>

                  <div className="builder-repeat-list">
                    {educations.map((education, index) => (
                      <article className="builder-repeat-card" key={index}>
                        <div className="repeat-card-heading">
                          <span>Education {String(index + 1).padStart(2, "0")}</span>
                          {educations.length > 1 && (
                            <button
                              type="button"
                              className="icon-delete-button"
                              onClick={() =>
                                setEducations((current) =>
                                  current.filter((_, itemIndex) => itemIndex !== index)
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <div className="builder-input-grid">
                          <label className="builder-field">
                            <span>Degree</span>
                            <input
                              value={education.degree}
                              onChange={(event) =>
                                updateEducation(index, "degree", event.target.value)
                              }
                              placeholder="Bachelor of Design"
                            />
                          </label>

                          <label className="builder-field">
                            <span>Institution</span>
                            <input
                              value={education.institution}
                              onChange={(event) =>
                                updateEducation(index, "institution", event.target.value)
                              }
                              placeholder="University name"
                            />
                          </label>

                          <label className="builder-field">
                            <span>Graduation year</span>
                            <input
                              value={education.graduation_year}
                              onChange={(event) =>
                                updateEducation(index, "graduation_year", event.target.value)
                              }
                              placeholder="2024"
                            />
                          </label>

                          <label className="builder-field">
                            <span>GPA <em>Optional</em></span>
                            <input
                              value={education.gpa}
                              onChange={(event) =>
                                updateEducation(index, "gpa", event.target.value)
                              }
                              placeholder="3.8 / 4.0"
                            />
                          </label>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="add-repeat-button"
                    onClick={() =>
                      setEducations((current) => [...current, emptyEducation()])
                    }
                  >
                    <Plus size={17} /> Add another education
                  </button>

                  <div className="skills-input-section">
                    <label className="builder-field">
                      <span>Skills</span>
                      <input
                        value={skillsInput}
                        onChange={(event) => setSkillsInput(event.target.value)}
                        placeholder="Figma, React, Project Management, SQL..."
                      />
                    </label>

                    <p>Separate each skill with a comma.</p>

                    {skills.length > 0 && (
                      <div className="builder-skill-chips">
                        {skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="builder-step-content">
                  <div className="builder-section-title">
                    <div className="builder-section-icon"><FileText size={19} /></div>
                    <div>
                      <span>Review and create</span>
                      <h2>Your resume draft</h2>
                    </div>
                  </div>

                  {!resumeText ? (
                    <div className="builder-empty-preview">
                      <FileText size={31} />
                      <h3>Ready to create your resume?</h3>
                      <p>
                        We will format your information into a polished,
                        ATS-friendly resume.
                      </p>
                      <button
                        type="button"
                        className="builder-create-button"
                        onClick={buildResume}
                        disabled={loadingAction === "build"}
                      >
                        {loadingAction === "build" ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <Sparkles size={17} />
                        )}
                        Build my resume
                      </button>
                    </div>
                  ) : (
                    <div className="generated-resume">
                      <div className="generated-resume-actions">
                        <span>AI-generated resume</span>
                        <div>
                          <button type="button" onClick={copyResume}>
                            {copied ? <Check size={15} /> : <Copy size={15} />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                          <button type="button" onClick={downloadResume}>
                            <Download size={15} /> Download
                          </button>
                        </div>
                      </div>

                      <pre>{resumeText}</pre>
                    </div>
                  )}
                </div>
              )}

              {error && <div className="builder-error">{error}</div>}

              <div className="builder-navigation">
                <button
                  type="button"
                  className="builder-back-button"
                  onClick={previousStep}
                  disabled={activeStep === 0}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {activeStep < 3 ? (
                  <button type="button" className="builder-next-button" onClick={nextStep}>
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="button" className="builder-next-button" onClick={buildResume}>
                    {loadingAction === "build" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Sparkles size={16} />
                    )}
                    Build resume
                  </button>
                )}
              </div>
            </section>

            <aside className="builder-preview-panel">
              <div className="builder-preview-top">
                <span>Live preview</span>
                <ChevronDown size={16} />
              </div>

              <div className="resume-paper-preview">
                <h2>{personalInfo.full_name || "Your name"}</h2>
                <p className="preview-role">{target.jobTitle || "Your target role"}</p>

                <div className="preview-contact">
                  {[personalInfo.email, personalInfo.phone, personalInfo.location]
                    .filter(Boolean)
                    .map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                </div>

                <div className="preview-rule" />

                <section>
                  <h3>Profile</h3>
                  <p>
                    {personalInfo.summary ||
                      "Your professional summary will appear here. Use AI Generate Summary to create one based on your background."}
                  </p>
                </section>

                <section>
                  <h3>Experience</h3>
                  {experiences
                    .filter((experience) => experience.job_title || experience.company)
                    .map((experience, index) => (
                      <div className="preview-entry" key={index}>
                        <strong>{experience.job_title || "Job title"}</strong>
                        <span>
                          {experience.company || "Company"}
                          {experience.start_date && ` · ${experience.start_date}`}
                          {experience.end_date && ` – ${experience.end_date}`}
                        </span>
                        <p>{experience.description || "Your achievements will appear here."}</p>
                      </div>
                    ))}
                </section>

                <section>
                  <h3>Skills</h3>
                  <div className="preview-skills">
                    {skills.length
                      ? skills.slice(0, 8).map((skill) => <span key={skill}>{skill}</span>)
                      : <p>Add skills to preview them here.</p>}
                  </div>
                </section>
              </div>

              <button
                type="button"
                className="generate-summary-button"
                onClick={generateSummary}
                disabled={loadingAction === "summary"}
              >
                {loadingAction === "summary" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <WandSparkles size={16} />
                )}
                Generate AI summary
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}