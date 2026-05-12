from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestException, UnauthorizedException
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user import create_user, get_user_by_email
from app.schemas.auth import LoginRequest, RegisterRequest


def register_user(
    db: Session,
    user_data: RegisterRequest,
) -> User:
    existing_user = get_user_by_email(
        db,
        user_data.email,
    )

    if existing_user:
        raise BadRequestException(
            "Email already registered"
        )

    hashed_password = hash_password(
        user_data.password
    )

    user = create_user(
        db=db,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
    )

    return user


def authenticate_user(
    db: Session,
    login_data: LoginRequest,
) -> str:
    user = get_user_by_email(
        db,
        login_data.email,
    )

    if not user:
        raise UnauthorizedException(
            "Invalid email or password"
        )

    valid_password = verify_password(
        login_data.password,
        user.hashed_password,
    )

    if not valid_password:
        raise UnauthorizedException(
            "Invalid email or password"
        )

    access_token = create_access_token(
        subject=str(user.id),
    )

    return access_token