from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.parser import parse_resume
from app.services.extractor import extract_entities
from app.services.matcher import calculate_match_score, detect_skill_gaps
from app.services.scorer import calculate_ats_score
from app.services.llm import generate_suggestions
from app.services.database import get_db, Analysis
from app.services.auth import get_current_user
from app.services.database import User
from groq import Groq
from dotenv import load_dotenv
import uuid
import json
import os

load_dotenv()

router = APIRouter()


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        resume_text = parse_resume(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    entities    = extract_entities(resume_text)
    match       = calculate_match_score(resume_text, job_description)
    gaps        = detect_skill_gaps(entities["skills"], job_description)
    ats         = calculate_ats_score(resume_text, job_description)
    suggestions = generate_suggestions(
                      resume_text,
                      job_description,
                      gaps["missing_skills"],
                      match["match_score"]
                  )

    analysis = Analysis(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        filename=file.filename,
        match_score=match["match_score"],
        ats_score=ats["ats_score"],
        keyword_score=ats["keyword_score"],
        format_score=ats["format_score"],
        matched_skills=",".join(gaps["matched_skills"]),
        missing_skills=",".join(gaps["missing_skills"]),
        suggestions=suggestions["suggestions"],
        candidate_name=entities.get("name"),
        candidate_email=entities.get("email"),
    )
    db.add(analysis)
    db.commit()

    return {
        "candidate": entities,
        "scores": {
            "match_score": match["match_score"],
            "ats_score": ats["ats_score"],
            "keyword_score": ats["keyword_score"],
            "format_score": ats["format_score"],
        },
        "skills": {
            "matched": gaps["matched_skills"],
            "missing": gaps["missing_skills"],
        },
        "format_checks": ats["format_checks"],
        "suggestions": suggestions["suggestions"]
    }


@router.post("/compare")
async def compare_resume(
    file: UploadFile = File(...),
    job_descriptions: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        resume_text = parse_resume(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    try:
        jd_list = json.loads(job_descriptions)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid job descriptions format.")

    if len(jd_list) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 job descriptions.")

    if len(jd_list) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 job descriptions allowed.")

    entities = extract_entities(resume_text)

    results = []
    for i, jd in enumerate(jd_list):
        job_title = jd.get("title", f"Job {i + 1}")
        job_description = jd.get("description", "")

        if not job_description.strip():
            continue

        match = calculate_match_score(resume_text, job_description)
        gaps = detect_skill_gaps(entities["skills"], job_description)
        ats = calculate_ats_score(resume_text, job_description)

        results.append({
            "job_title": job_title,
            "match_score": match["match_score"],
            "ats_score": ats["ats_score"],
            "keyword_score": ats["keyword_score"],
            "matched_skills": gaps["matched_skills"],
            "missing_skills": gaps["missing_skills"],
            "recommendation": (
                "Strong Match" if match["match_score"] >= 70
                else "Moderate Match" if match["match_score"] >= 40
                else "Weak Match"
            )
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)

    for i, r in enumerate(results):
        r["rank"] = i + 1

    return {
        "candidate": entities,
        "filename": file.filename,
        "total_jobs": len(results),
        "best_match": results[0]["job_title"] if results else None,
        "results": results
    }


@router.post("/cover-letter")
async def generate_cover_letter(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    job_title: str = Form(...),
    company_name: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        resume_text = parse_resume(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    entities = extract_entities(resume_text)
    candidate_name = entities.get("name") or current_user.name

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""
You are an expert career coach and professional cover letter writer.

Write a compelling, professional cover letter for the following candidate:

CANDIDATE NAME: {candidate_name}
TARGET JOB TITLE: {job_title}
COMPANY NAME: {company_name}

CANDIDATE RESUME:
{resume_text[:2000]}

JOB DESCRIPTION:
{job_description[:1000]}

Requirements:
- Write in a professional but personable tone
- 3-4 paragraphs
- Opening paragraph: Express enthusiasm for the role and company
- Middle paragraphs: Highlight 2-3 most relevant experiences and skills from the resume that match the job
- Closing paragraph: Strong call to action
- Do NOT include placeholders like [Your Address] or [Date]
- Start directly with "Dear Hiring Manager,"
- End with "Sincerely," followed by the candidate name
- Make it specific to the job and company, not generic
"""

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )

    cover_letter = chat_completion.choices[0].message.content

    return {
        "cover_letter": cover_letter,
        "candidate_name": candidate_name,
        "job_title": job_title,
        "company_name": company_name,
    }