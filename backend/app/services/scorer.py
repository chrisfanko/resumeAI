from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_ats_score(resume_text: str, job_description: str) -> dict:
    """Simulate ATS scoring using TF-IDF keyword matching."""
    
    vectorizer = TfidfVectorizer(stop_words='english')
    
    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        ats_score = round(float(similarity) * 100, 2)
    except Exception:
        ats_score = 0.0

    # Simple format checks
    checks = {
        "has_email": "@" in resume_text,
        "has_phone": any(char.isdigit() for char in resume_text),
        "good_length": 200 < len(resume_text.split()) < 1200,
        "no_tables": True  # Can't detect in plain text
    }

    format_score = round((sum(checks.values()) / len(checks)) * 100, 2)
    final_ats = round((ats_score * 0.7) + (format_score * 0.3), 2)

    return {
        "ats_score": final_ats,
        "keyword_score": ats_score,
        "format_score": format_score,
        "format_checks": checks
    }