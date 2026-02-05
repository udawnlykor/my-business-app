from sqlalchemy.orm import Session
from sqlalchemy import desc, func
import models, schemas
from datetime import date
import json

# User Operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_name(db: Session, name: str):
    return db.query(models.User).filter(models.User.name == name).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).order_by(desc(models.User.total_points)).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, gender=user.gender.value)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

# Submission Operations
def get_submissions(db: Session, skip: int = 0, limit: int = 100, type: str = None):
    query = db.query(models.Submission).order_by(desc(models.Submission.created_at))
    if type and type != "all":
        query = query.filter(models.Submission.type == type)
    return query.offset(skip).limit(limit).all()

def check_daily_submission(db: Session, user_id: int, type: str, submission_date: date):
    # Check if user already submitted this type today
    # Only applies to account_book and journal
    return db.query(models.Submission).filter(
        models.Submission.user_id == user_id,
        models.Submission.type == type,
        models.Submission.date == submission_date
    ).first()

def create_submission(db: Session, submission: schemas.SubmissionCreate, user_id: int, file_path: str = None):
    # If content is JSON string, use it. If file upload, store path.
    # For this app, we might mix them.
    
    # Logic: Points +5
    points = 5
    
    # Create valid content string
    content_val = submission.content
    if file_path:
        # If we have a file, we might want to store a JSON with both text and image
        # Or just image path if that's all. 
        # Let's assume content passed in is a JSON string or empty.
        try:
            data = json.loads(submission.content) if submission.content else {}
        except:
            data = {"text": submission.content}
        
        data['image_url'] = file_path
        content_val = json.dumps(data)

    db_submission = models.Submission(
        user_id=user_id,
        type=submission.type.value,
        content=content_val,
        date=submission.date if submission.date else date.today(),
        points=points
    )
    db.add(db_submission)
    
    # Update User Points
    user = get_user(db, user_id)
    user.total_points += points
    
    db.commit()
    db.refresh(db_submission)
    return db_submission

def delete_submission(db: Session, submission_id: int):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if submission:
        # Deduct Points
        user = get_user(db, submission.user_id)
        user.total_points -= submission.points
        
        db.delete(submission)
        db.commit()
        return True
    return False

def get_submission(db: Session, submission_id: int):
    return db.query(models.Submission).filter(models.Submission.id == submission_id).first()

def update_submission(db: Session, submission_id: int, content: str = None, submission_date: date = None, file_path: str = None):
    submission = get_submission(db, submission_id)
    if not submission:
        return None
    
    # Update content if provided
    if content is not None or file_path is not None:
        if content:
            try:
                data = json.loads(content)
            except:
                data = {"text": content}
        else:
            # Parse existing content
            try:
                data = json.loads(submission.content) if submission.content else {}
            except:
                data = {"text": submission.content}
        
        # Add or update image_url if file provided
        if file_path:
            data['image_url'] = file_path
        
        submission.content = json.dumps(data)
    
    # Update date if provided
    if submission_date:
        submission.date = submission_date
    
    db.commit()
    db.refresh(submission)
    return submission

