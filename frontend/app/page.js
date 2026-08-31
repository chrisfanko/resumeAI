"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  GitCompare,
  Mail,
  PenLine,
  ScanSearch,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    text: "Drop in a PDF or DOCX. We extract the important details in seconds.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Add a job description",
    text: "Paste the role you are applying for so we know exactly what to compare.",
    icon: Target,
  },
  {
    number: "03",
    title: "Get your advantage",
    text: "Receive your match score, missing skills, ATS feedback, and next steps.",
    icon: Sparkles,
  },
];

const features = [
  {
    title: "Resume match score",
    text: "Understand how closely your experience matches the role you want.",
    image: "/images/feature-match.png",
    icon: Target,
  },
  {
    title: "ATS-ready feedback",
    text: "Find formatting and keyword issues before a recruiter ever sees them.",
    image: "/images/feature-analyze.png",
    icon: BarChart3,
  },
  {
    title: "Skill gap detection",
    text: "Know which relevant skills and keywords your resume is missing.",
    image: "/images/feature-skills.png",
    icon: Zap,
  },
  {
    title: "Cover letters that fit",
    text: "Create a tailored cover letter without starting from a blank page.",
    image: "/images/feature-coverletter.png",
    icon: Mail,
  },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  const startLink = isLoggedIn ? "/analyze" : "/register";

  return (
    <main className="landing-page">
      <Navbar />

      <section className="landing-hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grid" />

        <div className="container-center hero-content">
          <div className="hero-copy">
            <div className="eyebrow hero-reveal">
              <Sparkles size={14} />
              AI-powered career toolkit
            </div>

            <h1 className="hero-title hero-reveal hero-reveal-delay-1">
              Your resume deserves
              <span> more interviews.</span>
            </h1>

            <p className="hero-description hero-reveal hero-reveal-delay-2">
              Find the keywords you are missing, improve your ATS score, and
              tailor your resume to every role with practical AI guidance.
            </p>

            <div className="hero-actions hero-reveal hero-reveal-delay-3">
              <Link href={startLink} className="landing-primary-button">
                Analyze my resume <ArrowRight size={17} />
              </Link>

              <Link href="#how-it-works" className="landing-secondary-button">
                See how it works
              </Link>
            </div>

            <div className="hero-proof hero-reveal hero-reveal-delay-4">
              <div className="avatar-stack" aria-hidden="true">
                <span>J</span>
                <span>M</span>
                <span>A</span>
              </div>
              <p>
                Built to help job seekers turn experience into a clearer,
                stronger story.
              </p>
            </div>
          </div>

          <div className="hero-visual hero-reveal hero-reveal-delay-2">
            <div className="hero-image-frame">
              <Image
                src="/images/hero.png"
                alt="ResumeAI dashboard showing a resume analysis"
                width={900}
                height={680}
                priority
              />
            </div>

            <div className="floating-card floating-score">
              <div className="score-circle">87</div>
              <div>
                <span>Match score</span>
                <strong>Strong match</strong>
              </div>
            </div>

            <div className="floating-card floating-skills">
              <CheckCircle2 size={19} />
              <div>
                <strong>12 skills matched</strong>
                <span>Ready to highlight</span>
              </div>
            </div>

            <div className="floating-card floating-ats">
              <ScanSearch size={18} />
              <span>ATS check complete</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container-center trust-strip-inner">
          <p>Everything you need to apply with more confidence</p>
          <div>
            <span>Resume analysis</span>
            <span>ATS optimization</span>
            <span>Cover letters</span>
            <span>Job comparison</span>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section soft-section">
        <div className="container-center">
          <div className="section-heading centered-heading">
            <div className="eyebrow">Simple by design</div>
            <h2>From upload to insight in three steps.</h2>
            <p>No complicated setup. Just your resume, the role, and clear next steps.</p>
          </div>

          <div className="steps-grid">
            {steps.map(({ number, title, text, icon: Icon }) => (
              <article className="step-card" key={number}>
                <div className="step-top">
                  <span>{number}</span>
                  <div className="step-icon"><Icon size={21} /></div>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section resume-story-section">
        <div className="container-center split-layout">
          <div className="story-image-wrap">
            <Image
              src="/images/markus-winkler-7iSEHWsxPLw-unsplash.jpg"
              alt="Resume and laptop on a desk"
              width={900}
              height={650}
              className="story-image"
            />
            <div className="story-image-badge">
              <PenLine size={17} />
              <span>Built for better applications</span>
            </div>
          </div>

          <div className="story-copy">
            <div className="eyebrow">More than a score</div>
            <h2>Turn every application into a stronger one.</h2>
            <p>
              ResumeAI does not just show a percentage. It gives you a clear
              path: what is already working, what the role requires, and what
              to improve before you apply.
            </p>

            <ul className="check-list">
              <li><CheckCircle2 size={18} /> Match your experience to the role</li>
              <li><CheckCircle2 size={18} /> Identify missing skills and keywords</li>
              <li><CheckCircle2 size={18} /> Build a professional, ATS-friendly resume</li>
            </ul>

            <Link href="/resume-builder" className="text-link">
              Build a stronger resume <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-section features-section">
        <div className="container-center">
          <div className="section-heading">
            <div className="eyebrow">Your application toolkit</div>
            <h2>Practical tools for every part of the job search.</h2>
            <p>One focused workspace for improving, tailoring, and comparing your applications.</p>
          </div>

          <div className="features-grid">
            {features.map(({ title, text, image, icon: Icon }) => (
              <article className="feature-card" key={title}>
                <div className="feature-image">
                  <Image src={image} alt="" width={600} height={360} />
                </div>
                <div className="feature-content">
                  <div className="feature-icon"><Icon size={18} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="feature-links">
            <Link href="/compare"><GitCompare size={16} /> Compare jobs</Link>
            <Link href="/cover-letter"><Mail size={16} /> Create a cover letter</Link>
            <Link href="/dashboard"><BarChart3 size={16} /> Track your progress</Link>
          </div>
        </div>
      </section>

      <section className="landing-section final-section">
        <div className="container-center final-grid">
          <div className="final-copy">
            <div className="eyebrow eyebrow-light">Your next opportunity</div>
            <h2>Apply with a resume that makes your value obvious.</h2>
            <p>
              Stop guessing what recruiters and applicant tracking systems are
              looking for. Start with a clear, tailored application.
            </p>
            <Link href={startLink} className="landing-light-button">
              Start free analysis <ArrowRight size={17} />
            </Link>
          </div>

          <div className="final-image-wrap">
            <Image
              src="/images/linkedin-sales-solutions-wS73LE0GnKs-unsplash.jpg"
              alt="Professional using a laptop"
              width={700}
              height={760}
            />
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container-center footer-inner">
          <div>
            <strong>ResumeAI</strong>
            <span>AI-powered resume analysis for job seekers.</span>
          </div>
          <p>© {new Date().getFullYear()} ResumeAI</p>
        </div>
      </footer>
    </main>
  );
}