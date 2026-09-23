from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.auth import (
    clear_session_cookie,
    create_session,
    destroy_session,
    set_session_cookie,
    verify_password,
)
from app.config import get_settings
from app.database import get_db
from app.models import Admin, SessionToken
from app.schemas import AdminOut, LoginRequest, LoginResponse, SessionResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


def _read_session_token(request: Request) -> str | None:
    return request.cookies.get(settings.session_cookie_name)


@router.post("/login", response_model=LoginResponse)
def login(
    body: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> LoginResponse:
    email = body.email.strip().lower()
    admin = db.query(Admin).filter(Admin.email == email).first()
    if admin is None or not verify_password(body.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_session(db, admin.id)
    set_session_cookie(response, token)
    return LoginResponse(admin=AdminOut(id=admin.id, email=admin.email))


@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> dict:
    token = _read_session_token(request)
    destroy_session(db, token)
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/session", response_model=SessionResponse)
def session(request: Request, db: Session = Depends(get_db)) -> SessionResponse:
    token = _read_session_token(request)
    if not token:
        return SessionResponse(authenticated=False)

    row = db.get(SessionToken, token)
    if not row or row.expires_at < datetime.utcnow():
        if row:
            db.delete(row)
            db.commit()
        return SessionResponse(authenticated=False)

    admin = db.get(Admin, row.admin_id)
    if not admin:
        return SessionResponse(authenticated=False)

    return SessionResponse(
        authenticated=True,
        admin=AdminOut(id=admin.id, email=admin.email),
    )
