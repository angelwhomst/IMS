from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import httpx
import logging
import database
from routers.auth import role_required

router = APIRouter()


