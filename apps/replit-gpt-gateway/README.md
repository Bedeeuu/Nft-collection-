# GhostMind Replit GPT Gateway

Status: MVP scaffold
Target: Replit
Server dependency: none

## Purpose

This app is a lightweight Replit-hosted gateway for connecting GPT-facing workflows to GhostMind Foundation Pack logic before the full Ubuntu server runtime is active.

It provides:

- health endpoint;
- foundation status endpoint;
- GPT chat bridge endpoint;
- safe environment-variable based secrets;
- no secrets committed to GitHub.

## Why Replit First

Replit is used as a temporary application runtime:

```text
GPT -> Replit Gateway -> GhostMind Logic
```

Later migration path:

```text
GPT -> Ubuntu API Gateway -> Governance -> Replay -> RAG -> LLM
```

## Required Secret

Set in Replit Secrets:

```text
OPENAI_API_KEY
```

Optional:

```text
GHOSTMIND_MODE=development
GHOSTMIND_MODEL=gpt-4.1-mini
```

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Endpoints

```text
GET  /health
GET  /foundation/status
POST /gpt/chat
```

## Security Rule

No API key, token, private URL or OAuth secret may be committed to this folder.
