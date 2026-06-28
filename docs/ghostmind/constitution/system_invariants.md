# GhostMind System Invariants

Status: canonical standard
Date: 2026-06-27

System invariants are architectural rules that must not be violated by implementation, automation, agents, tools or documentation.

An invariant may only be changed through a formal Architecture Decision Record.

## INV-001 — Governance Before Execution

No privileged or state-changing action may execute without a Governance decision.

Required evidence:

- Governance decision record
- policy version
- actor identity
- replay reference

Violation severity: critical.

## INV-002 — Replay Every State Change

Every state-changing operation must generate a Replay record.

Required evidence:

- replay packet
- previous hash
- event hash
- timestamp
- actor
- result state

Violation severity: critical.

## INV-003 — Knowledge Requires Provenance

Every knowledge object must include provenance metadata before it can be used by RAG or decision systems.

Required fields:

- source
- owner or source class
- timestamp
- content hash
- trust score
- classification

Violation severity: high.

## INV-004 — No Secrets Outside Vault

Secrets must not exist in source code, documentation, logs, vector stores or committed configuration files.

Allowed location:

- OpenBao / Vault

Violation severity: critical.

## INV-005 — Every Component Is Observable

Every runtime component must expose:

- health endpoint or status check
- structured logs
- operational metrics
- failure indicators

Violation severity: high.

## INV-006 — Knowledge Lives Outside the Model

Private knowledge must not be embedded into the base model through uncontrolled fine-tuning.

Canonical pattern:

```text
Knowledge -> Validation -> Retrieval -> Context -> Generation
```

Violation severity: high.

## INV-007 — Stabilize Before Expand

New runtime layers, agents, HUD modes, ontology branches and NFT runtime systems are blocked until P0 foundation is complete.

Violation severity: medium-high.
