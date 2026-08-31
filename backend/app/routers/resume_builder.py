from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.services.auth import get_current_user
from app.services.database import User
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()


# ── Request Models ────────────────────────────────────────────────────────────

class PersonalInfo(BaseModel):
    full_name: str
    email: str
    phone: str
    location: str
    linkedin: Optional[str] = ""
    website: Optional[str] = ""
    summary: Optional[str] = ""


class Experience(BaseModel):
    job_title: str
    company: str
    location: Optional[str] = ""
    start_date: str
    end_date: str          # "Present" is valid
    description: str       # raw bullet points or freeform text


class Education(BaseModel):
    degree: str
    institution: str
    location: Optional[str] = ""
    graduation_year: str
    gpa: Optional[str] = ""


class ResumeData(BaseModel):
    personal_info: PersonalInfo
    experiences: List[Experience]
    educations: List[Education]
    skills: List[str]
    target_job_title: Optional[str] = ""
    target_job_description: Optional[str] = ""


class EnhanceBulletRequest(BaseModel):
    bullet_text: str
    job_title: str
    company: str
    target_role: Optional[str] = ""


class GenerateSummaryRequest(BaseModel):
    full_name: str
    target_job_title: str
    skills: List[str]
    years_of_experience: Optional[int] = 0
    key_achievements: Optional[str] = ""


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured.")
    return Groq(api_key=api_key)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/resume/enhance-bullet")
async def enhance_bullet_point(
    request: EnhanceBulletRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Takes a raw experience bullet point and rewrites it using
    strong action verbs + quantified impact language.
    """
    client = get_groq_client()

    prompt = f"""You are an expert resume writer. Rewrite the following job experience bullet point to be more impactful.

Rules:
- Start with a strong action verb (past tense)
- Add quantified results where possible (%, $, numbers) — if no numbers are given, use realistic estimates
- Keep it to 1-2 lines max
- Be specific and results-oriented
- Do NOT add placeholder brackets like [X%]

Job Title: {request.job_title}
Company: {request.company}
Target Role: {request.target_role or "Not specified"}

Original bullet: {request.bullet_text}

Return ONLY the improved bullet point, nothing else."""

    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="openai/gpt-oss-120b",
        max_tokens=200,
    )

    enhanced = completion.choices[0].message.content.strip()
    return {"original": request.bullet_text, "enhanced": enhanced}


@router.post("/resume/generate-summary")
async def generate_professional_summary(
    request: GenerateSummaryRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generates a 3-4 sentence professional summary tailored to the target role.
    """
    client = get_groq_client()

    skills_str = ", ".join(request.skills[:10]) if request.skills else "various technical skills"

    prompt = f"""Write a compelling 3-sentence professional resume summary for the following person.

Candidate: {request.full_name}
Target Job Title: {request.target_job_title}
Years of Experience: {request.years_of_experience}
Key Skills: {skills_str}
Key Achievements: {request.key_achievements or "Not provided"}

Rules:
- Write in third person or omit the name entirely
- Mention the target role clearly
- Highlight top 2-3 skills
- End with value proposition (what they bring to a team)
- Keep it under 80 words
- No buzzword fluff — be specific

Return ONLY the summary paragraph, nothing else."""

    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="openai/gpt-oss-120b",
        max_tokens=200,
    )

    summary = completion.choices[0].message.content.strip()
    return {"summary": summary}


@router.post("/resume/build")
async def build_resume(
    resume_data: ResumeData,
    current_user: User = Depends(get_current_user)
):
    """
    Takes the full resume form data and returns a clean,
    AI-polished plain-text resume ready to copy or download.
    """
    client = get_groq_client()

    # Format experiences for the prompt
    exp_blocks = []
    for exp in resume_data.experiences:
        exp_blocks.append(
            f"- {exp.job_title} at {exp.company} ({exp.start_date} – {exp.end_date})\n  {exp.description}"
        )
    experiences_str = "\n".join(exp_blocks) if exp_blocks else "None provided"

    # Format education
    edu_blocks = []
    for edu in resume_data.educations:
        gpa_str = f", GPA: {edu.gpa}" if edu.gpa else ""
        edu_blocks.append(f"- {edu.degree}, {edu.institution} ({edu.graduation_year}{gpa_str})")
    education_str = "\n".join(edu_blocks) if edu_blocks else "None provided"

    skills_str = ", ".join(resume_data.skills) if resume_data.skills else "None provided"

    prompt = f"""You are a professional resume writer. Format the following information into a clean, ATS-friendly resume.

CANDIDATE INFORMATION:
Name: {resume_data.personal_info.full_name}
Email: {resume_data.personal_info.email}
Phone: {resume_data.personal_info.phone}
Location: {resume_data.personal_info.location}
LinkedIn: {resume_data.personal_info.linkedin or "N/A"}
Website: {resume_data.personal_info.website or "N/A"}

SUMMARY:
{resume_data.personal_info.summary or "Generate a professional summary based on the experience below"}

TARGET ROLE: {resume_data.target_job_title or "Not specified"}

EXPERIENCE:
{experiences_str}

EDUCATION:
{education_str}

SKILLS:
{skills_str}

Instructions:
- Format as a clean plain-text resume with clear section headers (ALL CAPS)
- Improve all bullet points with strong action verbs and quantified results
- Keep the summary under 60 words if generating one
- Use consistent formatting throughout
- Make it ATS-optimized
- Return ONLY the formatted resume text"""

    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="openai/gpt-oss-120b",
        max_tokens=2000,
    )

    resume_text = completion.choices[0].message.content.strip()

    return {
        "resume_text": resume_text,
        "candidate_name": resume_data.personal_info.full_name,
        "target_role": resume_data.target_job_title,
    }