import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Cookie, Depends, HTTPException, Response, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Admin, SessionToken

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def set_session_cookie(response: Response, token: str) -> None:
    max_age = settings.session_days * 24 * 60 * 60
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=max_age,
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
    )


def create_session(db: Session, admin_id: str) -> str:
    token = secrets.token_hex(32)
    expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(
        days=settings.session_days
    )
    db.add(
        SessionToken(
            id=token,
            admin_id=admin_id,
            expires_at=expires_at,
        )
    )
    db.commit()
    return token


def destroy_session(db: Session, token: str | None) -> None:
    if not token:
        return
    row = db.get(SessionToken, token)
    if row:
        db.delete(row)
        db.commit()


def get_session_admin(
    db: Session = Depends(get_db),
    skyra_session: str | None = Cookie(default=None, alias="skyra_session"),
) -> Admin | None:
    cookie_name = settings.session_cookie_name
    # FastAPI Cookie alias is fixed; also accept configured name via raw cookie if renamed
    token = skyra_session
    if cookie_name != "skyra_session" and token is None:
        return None
    if not token:
        return None

    row = db.get(SessionToken, token)
    if not row:
        return None
    if row.expires_at < datetime.utcnow():
        db.delete(row)
        db.commit()
        return None
    return db.get(Admin, row.admin_id)


def require_admin(admin: Admin | None = Depends(get_session_admin)) -> Admin:
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )
    return admin
