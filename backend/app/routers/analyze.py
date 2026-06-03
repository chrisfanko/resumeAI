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
import uuid

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

    # Save to database
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
        # 1. Read and parse resume
        file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        resume_text = parse_resume(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    # 2. Parse job descriptions from JSON string
    import json
    try:
        jd_list = json.loads(job_descriptions)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid job descriptions format.")

    if len(jd_list) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 job descriptions.")

    if len(jd_list) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 job descriptions allowed.")

    # 3. Extract entities once
    entities = extract_entities(resume_text)

    # 4. Run analysis against each JD
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

    # 5. Sort by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)

    # 6. Add rank
    for i, r in enumerate(results):
        r["rank"] = i + 1

    return {
        "candidate": entities,
        "filename": file.filename,
        "total_jobs": len(results),
        "best_match": results[0]["job_title"] if results else None,
        "results": results
    }