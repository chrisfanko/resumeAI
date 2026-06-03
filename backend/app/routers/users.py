from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.services.database import get_db, User, Analysis
from app.services.auth import hash_password, verify_password, create_access_token, get_current_user
import uuid

router = APIRouter()

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    user = User(
        id=str(uuid.uuid4()),
        name=request.name,
        email=request.email,
        password=hash_password(request.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "name": user.name, "email": user.email}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "name": user.name, "email": user.email}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"name": current_user.name, "email": current_user.email}

@router.get("/history")
def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()

    return [
        {
            "id": a.id,
            "filename": a.filename,
            "match_score": a.match_score,
            "ats_score": a.ats_score,
            "keyword_score": a.keyword_score,
            "format_score": a.format_score,
            "matched_skills": a.matched_skills.split(",") if a.matched_skills else [],
            "missing_skills": a.missing_skills.split(",") if a.missing_skills else [],
            "suggestions": a.suggestions,
            "candidate_name": a.candidate_name,
            "created_at": a.created_at,
        }
        for a in analyses
    ]