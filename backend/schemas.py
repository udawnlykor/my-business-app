from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class GenderEnum(str, Enum):
    Male = "Male"
    Female = "Female"

class SubmissionType(str, Enum):
    account_book = "account_book"
    journal = "journal"
    content = "content"

# User Schemas
class UserBase(BaseModel):
    name: str
    gender: GenderEnum

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    total_points: int

    class Config:
        from_attributes = True

# Submission Schemas
class SubmissionBase(BaseModel):
    type: SubmissionType
    content: Optional[str] = None
    date: date  # Changed from Optional[date] to date

class SubmissionCreate(SubmissionBase):
    # For file uploads, content might be handled separately, 
    # but for request body we might need it. 
    # Actually, file upload endpoints usually take Form data, not JSON body.
    # We'll define a schema used for response primarily.
    pass

class SubmissionUpdate(BaseModel):
    content: Optional[str] = None
    date: Optional[date] = None

class Submission(SubmissionBase):
    id: int
    user_id: int
    created_at: datetime
    points: int
    owner_name: Optional[str] = None # Helper for UI

    class Config:
        from_attributes = True
