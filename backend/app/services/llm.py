import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_suggestions(resume_text: str, job_description: str, missing_skills: list, match_score: float) -> dict:
    """Use Llama 3 via Groq to generate improvement suggestions."""

    prompt = f"""
You are an expert career coach and resume writer. Analyze this resume against the job description and provide actionable feedback.

RESUME:
{resume_text[:2000]}

JOB DESCRIPTION:
{job_description[:1000]}

MATCH SCORE: {match_score}%
MISSING SKILLS: {', '.join(missing_skills) if missing_skills else 'None'}

Provide your response in this exact format:

SUMMARY:
[2-3 sentence overall assessment]

TOP 3 IMPROVEMENTS:
1. [specific improvement]
2. [specific improvement]
3. [specific improvement]

REWRITTEN BULLET POINT:
[Take one weak line from the resume and rewrite it stronger]

KEYWORDS TO ADD:
[List 5 keywords from the JD missing in the resume]
"""

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )

    response_text = chat_completion.choices[0].message.content

    return {"suggestions": response_text}