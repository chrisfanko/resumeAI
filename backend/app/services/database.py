from sqlalchemy import create_engine, Column, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    analyses = relationship("Analysis", back_populates="user")

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    filename = Column(String)
    match_score = Column(Float)
    ats_score = Column(Float)
    keyword_score = Column(Float)
    format_score = Column(Float)
    matched_skills = Column(String)
    missing_skills = Column(String)
    suggestions = Column(String)
    candidate_name = Column(String)
    candidate_email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="analyses")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()