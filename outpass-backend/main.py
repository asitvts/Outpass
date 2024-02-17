from fastapi import FastAPI,Depends,status,HTTPException
from sqlalchemy.orm import Session
import models
from typing import Annotated
from database import engine
from fastapi.responses import JSONResponse
from schemas import OutpassBase,GuardPassBase
from database import db_dependency, get_db
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc
import auth
from auth import get_current_user
import utils


app=FastAPI()
app.include_router(auth.router)
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
user_dependency = Annotated[dict, Depends(get_current_user)]

@app.post("/apply",status_code=status.HTTP_200_OK)
async def apply_for_outpass(outpass: OutpassBase, db: db_dependency, token: str, email: str):
    if not utils.validate_token(token,email):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="token does not match email")
    db_outpass=models.Outpass(**outpass.dict())
    db.add(db_outpass)
    db.commit()
    return {"message": "Outpass applied successfully"}


    
@app.post("/send_guard_pass",status_code=status.HTTP_200_OK)
async def send_guard_pass(guardpass: GuardPassBase, db: db_dependency):
    db_outpass=models.GuardPass(**guardpass.dict())
    db.add(db_outpass)
    db.commit()
    return {"message": "Outpass sent to guard successfully"}
    





@app.get("/get_user_by_clg_id", status_code=200)
async def get_user_by_email(db: Session = Depends(get_db), College_id: str = None):
    user = db.query(models.User).filter(models.User.College_id == College_id).first()
    if user:
        return user
    else:
        return JSONResponse(content={"message": "No user with that College ID available in the database"}, status_code=404) 

@app.get("/get_outpass_by_clg_id", status_code=200)
async def get_outpass_by_email(db: Session = Depends(get_db), College_id: str = None):
    user = db.query(models.Outpass).filter(models.Outpass.College_id == College_id).order_by(desc(models.Outpass.out_date)).first()
    if user:
        return user
    else:
        return JSONResponse(content={"message": "No outpass with that College ID available in the database"}, status_code=404) 




@app.get("/get_user_by_id", status_code=200)
async def get_user_by_id(db: Session = Depends(get_db), user_id: int = None):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if user:
        return user
    else:
        return JSONResponse(content={"message": "No user with that ID available in the database"}, status_code=404)
    
@app.get("/get_user_by_email", status_code=200)
async def get_user_by_email(db: Session = Depends(get_db), emailid: str = None):
    user = db.query(models.User).filter(models.User.email == emailid).first()
    user1= db.query(models.Warden).filter(models.Warden.email == emailid).first()
    user2= db.query(models.Guard).filter(models.Guard.email == emailid).first()

    if user:
        return user
    elif user1:
        return user1
    elif user2:
        return user2
    else:
        return JSONResponse(content={"message": "No user with that ID available in the database"}, status_code=404)
    
@app.get("/get_all_users", status_code=200)
async def get_user_by_id(db: Session = Depends(get_db)):
    user = db.query(models.User).all()
    if user:
        return user
    else:
        return JSONResponse(content={"message": "No user with that ID available in the database"}, status_code=404)
    
@app.get("/get_all_outpass", status_code=200)
async def get_all_outpass(token: str, email: str, db: Session = Depends(get_db)):
    if not utils.validate_token(token,email):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="token does not match email")
    user = db.query(models.Outpass).all()
    if user:
        return user
    else:
        return JSONResponse(content={"message": "No outpass available in the database"}, status_code=404)

@app.get("/get_all_guard_pass", status_code=200)
async def get_all_guard_pass(token: str, email: str,db: Session = Depends(get_db)):
    if not utils.validate_token(token,email):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="token does not match email")
    passes = db.query(models.GuardPass).all()
    if passes:
        return passes
    else:
        return JSONResponse(content={"message": "No outpass available in the database"}, status_code=404)
   

@app.get("/sign_in", status_code=200)
async def sign_in(emailid: str, password: str, db: Session = Depends(get_db)):

    if auth.authenticate_user(emailid, password,db):
        token=auth.create_access_token(emailid)
        return {
                "token" : token,
                "message": "Sign-in successful for user",
                "type" : "user"
                }
    elif auth.authenticate_warden(emailid, password,db):
        token=auth.create_access_token(emailid)
        return {
                "token" : token,
                "message": "Sign-in successful for warden",
                "type" : "warden"
                }
    elif auth.authenticate_guard(emailid, password,db):
        token=auth.create_access_token(emailid)
        return {
                "token" : token,
                "message": "Sign-in successful for guard",
                "type" : "guard"
                }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email id or password"
    )



@app.delete("/delete_outpass", status_code=200)
async def delete_outpass(College_id: str, db: Session = Depends(get_db)):
    outpass= db.query(models.Outpass).filter(models.Outpass.College_id == College_id).all()
    if not outpass:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="no outpass with that college id found")

    else:
        for op in outpass:
            db.delete(op)
        db.commit()
        return {"message": "successful"}


@app.delete("/delete_guard_pass", status_code=200)
async def delete_guard_pass(College_id: str, db: Session = Depends(get_db)):
    guard_pass= db.query(models.GuardPass).filter(models.GuardPass.College_id == College_id).all()
    if not guard_pass:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="no outpass with that college id found")

    else:
        for op in guard_pass:
            db.delete(op)
        db.commit()
        return {"message": "successful"}
    

