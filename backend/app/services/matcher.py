from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load model once when server starts
model = SentenceTransformer('all-MiniLM-L6-v2')

def calculate_match_score(resume_text: str, job_description: str) -> dict:
    """Calculate semantic similarity between resume and job description."""
    
    # Generate embeddings
    resume_embedding = model.encode([resume_text])
    jd_embedding = model.encode([job_description])
    
    # Calculate cosine similarity
    similarity = cosine_similarity(resume_embedding, jd_embedding)[0][0]
    match_score = round(float(similarity) * 100, 2)

    return {"match_score": match_score}

def detect_skill_gaps(resume_skills: list, job_description: str) -> dict:
    """Find skills mentioned in JD that are missing from resume."""
    
    # Common skills to scan for in JD
    ALL_SKILLS = [
        "python", "javascript", "typescript", "react", "node.js", "fastapi",
        "django", "sql", "postgresql", "mongodb", "redis", "docker", "git",
        "machine learning", "deep learning", "nlp", "data analysis", "excel",
        "communication", "leadership", "teamwork", "problem solving",
        "project management", "agile", "scrum", "java", "c++", "c#",
        "html", "css", "tailwind", "next.js", "aws", "azure", "linux"
    ]

    jd_lower = job_description.lower()
    jd_skills = [skill for skill in ALL_SKILLS if skill in jd_lower]
    resume_skills_lower = [s.lower() for s in resume_skills]

    missing_skills = [s for s in jd_skills if s not in resume_skills_lower]
    matched_skills = [s for s in jd_skills if s in resume_skills_lower]

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "jd_skills_found": jd_skills
    }