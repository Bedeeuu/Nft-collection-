from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None

APP_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = APP_ROOT.parents[1]

DEFAULT_MODEL = os.getenv("GHOSTMIND_MODEL", "gpt-4.1-mini")
MODE = os.getenv("GHOSTMIND_MODE", "development")

app = FastAPI(
    title="GhostMind Replit GPT Gateway",
    version="0.1.0",
    description="Temporary Replit gateway for GPT-connected GhostMind workflows.",
)


class ChatMessage(BaseModel):
    role: str = Field(..., description="system, user, assistant")
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    temperature: float = 0.2


class ChatResponse(BaseModel):
    model: str
    answer: str
    mode: str


def _load_yaml(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {"status": "missing", "path": str(path)}
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def _foundation_status() -> Dict[str, Any]:
    status = _load_yaml(REPO_ROOT / "foundation_pack" / "STATUS.yaml")
    security = _load_yaml(REPO_ROOT / "governance" / "security_policy.yaml")
    return {
        "gateway": "replit-gpt-gateway",
        "mode": MODE,
        "foundation_status": status,
        "security_policy_loaded": bool(security and security.get("policy_id")),
    }


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "ok": True,
        "service": "ghostmind-replit-gpt-gateway",
        "mode": MODE,
    }


@app.get("/foundation/status")
def foundation_status() -> Dict[str, Any]:
    return _foundation_status()


@app.post("/gpt/chat", response_model=ChatResponse)
def gpt_chat(req: ChatRequest) -> ChatResponse:
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured. Set it in Replit Secrets.",
        )
    if OpenAI is None:
        raise HTTPException(status_code=500, detail="openai package is not installed")

    model = req.model or DEFAULT_MODEL
    client = OpenAI()

    system_context = (
        "You are connected to GhostMind Replit Gateway. "
        "Follow GhostMind doctrine: Govern Before Executing, Replay Every Action, "
        "Knowledge Lives Outside the Model, Stabilize Before Scaling. "
        "Do not claim server-side P0 gates are complete without evidence."
    )

    messages = [{"role": "system", "content": system_context}]
    messages.extend([m.model_dump() for m in req.messages])

    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=req.temperature,
    )
    answer = completion.choices[0].message.content or ""
    return ChatResponse(model=model, answer=answer, mode=MODE)
