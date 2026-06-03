from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze, users

app = FastAPI(
    title="AI Resume Analyzer",
    description="Analyze resumes against job descriptions using NLP and AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api", tags=["Analysis"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "AI Resume Analyzer API is running "}