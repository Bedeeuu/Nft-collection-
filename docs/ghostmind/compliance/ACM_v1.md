# GhostMind Architecture Compliance Matrix — ACM v1.0

Status: canonical draft
Date: 2026-06-27

ACM links architectural promises to evidence.

A requirement is incomplete until it is connected to:

```text
Requirement -> Invariant -> ADR -> GES -> Schema -> Implementation -> Test -> Metric -> Runbook -> Evidence
```

## Core Matrix

| Requirement ID | Requirement | Invariant | GES | Schema | Implementation | Test | Metric | Runbook | ORL | Status |
|---|---|---|---|---|---|---|---|---|---:|---|
| REQ-RPL-001 | Replay every state-changing action | INV-002 | GES-500 | replay_packet.schema.json | replay_engine | replay_validation | replay_coverage | replay_recovery.md | 4 | planned |
| REQ-GOV-001 | Govern before execute | INV-001 | GES-300/GES-400 | governance_decision.schema.json | governance_engine | policy_tests | governance_coverage | incident_response.md | 3 | planned |
| REQ-PRV-001 | Provenance for every knowledge object | INV-003 | GES-500 | provenance_record.schema.json | provenance_runtime | provenance_tests | provenance_coverage | knowledge_recovery.md | 3 | planned |
| REQ-SEC-001 | No secrets outside Vault | INV-004 | GES-400 | security_policy.yaml | openbao_runtime | secret_scan | secrets_found | vault_recovery.md | 4 | planned |
| REQ-OBS-001 | Every component is observable | INV-005 | GES-700 | runtime_health.schema.json | telemetry_runtime | health_tests | service_health | runtime_recovery.md | 3 | planned |
| REQ-RAG-001 | No direct indexing of unvalidated documents | INV-003/INV-006 | GES-500 | provenance_record.schema.json | rag_quarantine | rag_security_tests | quarantined_docs | rag_recovery.md | 3 | planned |

## Completion Rule

A row may move from `planned` to `complete` only when:

1. Schema exists.
2. Implementation exists.
3. Automated verification exists.
4. Operational metric exists.
5. Runbook exists.
6. Evidence is linked.
7. ORL is updated.

## Evidence Rule

Evidence must be factual, not declarative.

Valid evidence examples:

- test result
- CI output
- metric screenshot or exported value
- commit hash
- schema validation output
- runbook execution record

Invalid evidence examples:

- intention
- roadmap item
- conceptual description
- unsupported claim
