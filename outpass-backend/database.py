from sqlalchemy import create_engine
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm
from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session

DATABASE_URL = "mysql+pymysql://root:7970809880@localhost:3306/user"

engine = create_engine(DATABASE_URL)

SessionLocal = _orm.sessionmaker(autocommit=False, autoflush=False, bind = engine)

Base = _declarative.declarative_base()


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
