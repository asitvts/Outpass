import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash
from database import Base
from enum import Enum





class Guard(Base):
    __tablename__ = "guard"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)

    Emp_id = _sql.Column(_sql.String, unique=True)
    Name = _sql.Column(_sql.String(length=50))
    Mobile_no = _sql.Column(_sql.String(length=15))
    email = _sql.Column(_sql.String, unique=True)
    hashed_password = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)
   

class HostelEnum(str, Enum):
    Nirvana = 'Nirvana'
    Noran = 'Noran'


class Warden(Base):
    __tablename__ = "warden"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)

    Emp_id = _sql.Column(_sql.String, unique=True)
    Name = _sql.Column(_sql.String(length=50))
    Mobile_no = _sql.Column(_sql.String(length=15))
    Hostel = _sql.Column(_sql.Enum(HostelEnum), nullable=False)
    email = _sql.Column(_sql.String, unique=True)
    hashed_password = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)
    


class User(Base):
    __tablename__ = "user"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)

    College_id = _sql.Column(_sql.String, unique=True)

    Name = _sql.Column(_sql.String(length=50))
    Mobile_no = _sql.Column(_sql.String(length=15))
    Room_No = _sql.Column(_sql.String(length=3))
    Hostel = _sql.Column(_sql.Enum(HostelEnum), nullable=False)
    Year = _sql.Column(_sql.Integer)
    Father_name = _sql.Column(_sql.String(length=50))
    Father_mob = _sql.Column(_sql.String)
    Branch = _sql.Column(_sql.String)
    email = _sql.Column(_sql.String, unique=True)
    hashed_password = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)

   

class LuggageEnum(str, Enum):
    yes = "yes"
    no = "no"


class CompanyEnum(str, Enum):
    self = "self"
    friends = "friends"
    parents = "parents"


class Outpass(Base):
    __tablename__ = "outpass"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    

    College_id = _sql.Column(_sql.String)
    out_date = _sql.Column(_sql.DateTime)
    in_date = _sql.Column(_sql.DateTime)
    out_time = _sql.Column(_sql.TIME)
    reason = _sql.Column(_sql.String(length=40))
    destination = _sql.Column(_sql.String(length=30))
    luggage = _sql.Column(_sql.Enum(LuggageEnum), nullable=False)
    company = _sql.Column(_sql.Enum(CompanyEnum), nullable=False)
    
class GuardPass(Base):
    __tablename__ = "guardpass"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    College_id = _sql.Column(_sql.String)