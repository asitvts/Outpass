from pydantic import BaseModel
from enum import Enum

class UserBase(BaseModel):

    College_id: str
    Name :str
    Mobile_no:str
    Room_No :str
    Hostel :str
    Year : int
    Father_name :str
    Father_mob :str
    Branch :str
    email :str
    hashed_password :str

class GuardPassBase(BaseModel):
    College_id:str

class OutpassBase(BaseModel):

    College_id: str
    out_date: str
    in_date : str
    out_time : str
    reason: str
    destination: str
    luggage : str
    company : str

class WardenBase(BaseModel):

    Emp_id:str
    Name: str
    Mobile_no: str
    Hostel:str
    email:str
    hashed_password:str

class GuardBase(BaseModel):
    
    Emp_id:str
    Name: str
    Mobile_no: str
    email:str
    hashed_password:str


    

class HostelEnum(str, Enum):
    Nirvana = 'Nirvana'
    Noran = 'Noran'

class LuggageEnum(str, Enum):
    yes = "yes"
    no = "no"

class CompanyEnum(str, Enum):
    self="self"
    friends="friends"
    parents="parents"
