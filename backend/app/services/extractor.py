import spacy
import re

nlp = spacy.load("en_core_web_lg")

# Common tech and soft skills to look for
SKILLS_DB = [
    "python", "javascript", "typescript", "react", "node.js", "fastapi",
    "django", "sql", "postgresql", "mongodb", "redis", "docker", "git",
    "machine learning", "deep learning", "nlp", "data analysis", "excel",
    "communication", "leadership", "teamwork", "problem solving",
    "project management", "agile", "scrum", "java", "c++", "c#",
    "html", "css", "tailwind", "next.js", "aws", "azure", "linux"
]

def extract_entities(text: str) -> dict:
    """Extract structured information from resume text."""
    doc = nlp(text)
    
    # Extract name (first PERSON entity)
    name = None
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    # Extract email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    email = emails[0] if emails else None

    # Extract phone
    phone_pattern = r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}'
    phones = re.findall(phone_pattern, text)
    phone = phones[0] if phones else None

    # Extract skills by matching against skills database
    text_lower = text.lower()
    found_skills = [skill for skill in SKILLS_DB if skill in text_lower]

    # Extract organizations (companies / universities)
    organizations = list(set([
        ent.text for ent in doc.ents if ent.label_ == "ORG"
    ]))

    # Extract years of experience hint
    years_pattern = r'(\d+)\+?\s*years?\s*(of\s*)?(experience)?'
    years_matches = re.findall(years_pattern, text_lower)
    years_experience = max([int(y[0]) for y in years_matches], default=0) if years_matches else 0

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": found_skills,
        "organizations": organizations[:5],
        "years_experience": years_experience
    }