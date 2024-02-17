from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from starlette import status
from database import SessionLocal
import models
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from database import get_db, db_dependency
from schemas import UserBase,WardenBase,GuardBase
import asyncio



router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = "c924ed7a0378f7eb4e2014e1a51661de8231436b33afd669f6e1fcb77cfd1083"
ALGORITHM = 'HS256'


bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')


class Token(BaseModel):
    access_token: str
    token_type: str



@router.post("/token", response_model= Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm,Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid creds")

    token = create_access_token(user.email)

    return {'access_token': token, 'token_type': 'bearer'}

@router.get("/get_user_from_token", status_code=200)
async def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user')
        return {'username' :username}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail = 'Could not validate user')
    




def create_access_token(email: str):
    encode = {'sub': email}
    expires = datetime.utcnow() + timedelta(minutes=30)
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


# temp=create_access_token("asit")
# print(temp)


        


# tok_temp="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhc2l0IiwiZXhwIjoxNzA4MTU1MzMzfQ.wivrqb6fv2YZ0dX879D2kzVChPDVQRu40O1KusA6EEY"

# async def main():
#     temp = await get_current_user(tok_temp)
#     print(temp)

# asyncio.run(main())





def authenticate_user(email: str, password: str, db):
    user=db.query(models.User).filter(models.User.email==email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def authenticate_guard(email: str, password: str, db):
    user=db.query(models.Guard).filter(models.Guard.email==email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def authenticate_warden(email: str, password: str, db):
    user=db.query(models.Warden).filter(models.Warden.email==email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user



@router.post("/register_user",status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: UserBase, db: db_dependency):
    

    create_user_model= models.User(

        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.hashed_password),
        Mobile_no=create_user_request.Mobile_no,
        Father_name=create_user_request.Father_name,
        Father_mob=create_user_request.Father_mob,
        Year=create_user_request.Year,
        College_id=create_user_request.College_id,
        Room_No=create_user_request.Room_No,
        Branch= create_user_request.Branch,
        Name= create_user_request.Name,
        Hostel= create_user_request.Hostel,
    )

    db.add(create_user_model)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/register_guard",status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: GuardBase, db: db_dependency):
    

    create_user_model= models.Guard(

        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.hashed_password),
        Mobile_no=create_user_request.Mobile_no,
        Name= create_user_request.Name,
        Emp_id= create_user_request.Emp_id,
    )

    db.add(create_user_model)
    db.commit()
    return {"message": "User registered successfully"}



@router.post("/register_warden",status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: WardenBase, db: db_dependency):
    

    create_user_model= models.Warden(

        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.hashed_password),
        Mobile_no=create_user_request.Mobile_no,
        Name= create_user_request.Name,
        Emp_id= create_user_request.Emp_id,
        Hostel= create_user_request.Hostel,
    )

    db.add(create_user_model)
    db.commit()
    return {"message": "User registered successfully"}



