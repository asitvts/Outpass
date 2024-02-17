from auth import SECRET_KEY,ALGORITHM
from jose import jwt,JWTError
from fastapi import HTTPException
from starlette import status

def validate_token(token: str, email:str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        if username is None:
            return False
        elif email == username:
            return True
        else:
            return False
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail = 'Could not validate user')

