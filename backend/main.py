from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Cookie, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional, List
import shutil
import os
import json
from datetime import date

import crud, models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads folder
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/login", response_model=schemas.User)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_name(db, name=user.name)
    if not db_user:
        db_user = crud.create_user(db, user)
    return db_user

@app.get("/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.patch("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, gender: str = Form(...), db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate gender
    if gender not in ["Male", "Female"]:
        raise HTTPException(status_code=400, detail="Invalid gender. Must be 'Male' or 'Female'")
    
    # Update gender
    db_user.gender = gender
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/submissions", response_model=schemas.Submission)
async def create_submission(
    type: str = Form(...),
    content: Optional[str] = Form(None),
    date_str: Optional[str] = Form(None), # YYYY-MM-DD
    user_id: int = Form(...), # Trusted from client for this loose auth
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Parse date
    submission_date = date.today()
    if date_str:
        try:
            submission_date = date.fromisoformat(date_str)
        except ValueError:
            pass # fallback to today

    # Check Daily Limit (only for account_book and journal, content is unlimited)
    if type in ["account_book", "journal"]:
        existing = crud.check_daily_submission(db, user_id, type, submission_date)
        print(f"DEBUG: Checking submission for user_id={user_id}, type={type}, date={submission_date}")
        print(f"DEBUG: Existing submission found: {existing}")
        if existing:
            print(f"DEBUG: Existing submission date: {existing.date}")
            # Format date as YYYY-MM-DD for Korean message
            date_formatted = submission_date.strftime("%Y-%m-%d")
            type_korean = "가계부" if type == "account_book" else "저널링"
            raise HTTPException(
                status_code=400, 
                detail=f"이미 제출하셨습니다. 금액이 바뀐 경우 마이페이지에서 수정해주세요. ({date_formatted})"
            )

    # Handle File Upload
    file_path = None
    if file:
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        # Store relative path for URL
        file_path = f"/static/{file.filename}"

    # Prepare Schema
    # valid type check
    try:
        enum_type = schemas.SubmissionType(type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid submission type")

    submission_data = schemas.SubmissionCreate(
        type=enum_type,
        content=content,
        date=submission_date
    )

    return crud.create_submission(db, submission=submission_data, user_id=user_id, file_path=file_path)

@app.get("/submissions", response_model=List[schemas.Submission])
def read_submissions(skip: int = 0, limit: int = 100, type: Optional[str] = None, db: Session = Depends(get_db)):
    submissions = crud.get_submissions(db, skip=skip, limit=limit, type=type)
    # Populate owner_name for UI convenience
    for sub in submissions:
        sub.owner_name = sub.owner.name
    return submissions

@app.put("/submissions/{submission_id}", response_model=schemas.Submission)
async def update_submission(
    submission_id: int,
    content: Optional[str] = Form(None),
    date_str: Optional[str] = Form(None),
    user_id: int = Form(...),
    file: Optional[UploadFile] = File(None),
    x_admin_pass: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    submission = crud.get_submission(db, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Auth Check - only owner or admin can edit
    is_owner = (submission.user_id == user_id)
    is_admin = (x_admin_pass == "admin1234")

    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to edit this submission")
    
    # Parse date if provided
    submission_date = None
    if date_str:
        try:
            submission_date = date.fromisoformat(date_str)
        except ValueError:
            pass
    
    # Handle File Upload
    file_path = None
    if file:
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_path = f"/static/{file.filename}"
    
    updated = crud.update_submission(db, submission_id, content, submission_date, file_path)
    if not updated:
        raise HTTPException(status_code=400, detail="Could not update submission")
    
    # Populate owner_name for UI
    updated.owner_name = updated.owner.name
    return updated

@app.delete("/submissions/{submission_id}")
def delete_submission(
    submission_id: int, 
    x_user_id: int = Header(None), # Matches x-user-id header from frontend
    x_admin_pass: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    submission = crud.get_submission(db, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Auth Check
    is_owner = (x_user_id is not None and submission.user_id == x_user_id)
    is_admin = (x_admin_pass == "admin1234")

    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to delete this submission")

    success = crud.delete_submission(db, submission_id)
    if not success:
        raise HTTPException(status_code=400, detail="Could not delete")
    
    return {"status": "success"}

@app.get("/rankings")
def get_rankings(db: Session = Depends(get_db)):
    # Simply return users sorted by points
    return crud.get_users(db, limit=10)
