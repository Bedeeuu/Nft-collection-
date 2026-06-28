#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sys
from urllib.request import Request, urlopen

BASE_URL = os.getenv("GHOSTMIND_GATEWAY_URL", "http://localhost:8000").rstrip("/")


def get(path: str) -> dict:
    with urlopen(BASE_URL + path, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def post(path: str, payload: dict) -> dict:
    data = json.dumps(payload).encode("utf-8")
    request = Request(
        BASE_URL + path,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> int:
    print(f"Testing GhostMind Gateway at {BASE_URL}")

    health = get("/health")
    assert health.get("ok") is True, health
    print("health: PASS")

    foundation = get("/foundation/status")
    assert "foundation_status" in foundation, foundation
    print("foundation/status: PASS")

    if os.getenv("OPENAI_API_KEY"):
        chat = post(
            "/gpt/chat",
            {
                "messages": [
                    {"role": "user", "content": "Return one short GhostMind status sentence."}
                ],
                "temperature": 0.2,
            },
        )
        assert "answer" in chat, chat
        print("gpt/chat: PASS")
    else:
        print("gpt/chat: SKIPPED (OPENAI_API_KEY not set)")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"smoke test failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
