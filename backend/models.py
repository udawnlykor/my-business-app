from sqlalchemy import Column, Integer, String, Enum, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class GenderEnum(str, enum.Enum):
    Male = "Male"
    Female = "Female"

class SubmissionType(str, enum.Enum):
    account_book = "account_book"
    journal = "journal"
    content = "content"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    gender = Column(String) # Storing Enum as string for simplicity in SQLite
    created_at = Column(DateTime, default=datetime.now)
    total_points = Column(Integer, default=0)

    submissions = relationship("Submission", back_populates="owner")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String) # Storing SubmissionType as string
    content = Column(String) # JSON string or URL
    date = Column(Date, default=datetime.now().date)
    created_at = Column(DateTime, default=datetime.now)
    points = Column(Integer, default=5)

    owner = relationship("User", back_populates="submissions")
