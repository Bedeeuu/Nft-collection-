# Replit Setup Checklist

## 1. Import GitHub repository

Import:

```text
Bedeeuu/Nft-collection-
```

Use app folder:

```text
apps/replit-gpt-gateway
```

## 2. Add Replit Secret

Add this secret in Replit Secrets:

```text
OPENAI_API_KEY
```

Optional secrets:

```text
GHOSTMIND_MODE=development
GHOSTMIND_MODEL=gpt-4.1-mini
```

## 3. Run app

Expected command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 4. Verify endpoints

```text
GET /health
GET /foundation/status
POST /gpt/chat
```

## 5. GPT Action setup

Use:

```text
apps/replit-gpt-gateway/openapi/gpt_action_openapi.yaml
```

Replace server URL:

```text
https://YOUR-REPLIT-APP-URL
```

with your actual deployed Replit URL.

## 6. Smoke test

Local or Replit shell:

```bash
python scripts/smoke_test.py
```

For deployed URL:

```bash
GHOSTMIND_GATEWAY_URL=https://YOUR-REPLIT-APP-URL python scripts/smoke_test.py
```

## Security

Never commit API keys or OAuth tokens.
Use Replit Secrets only.
