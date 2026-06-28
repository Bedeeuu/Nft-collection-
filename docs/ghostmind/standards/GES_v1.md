# GhostMind Engineering Standard — GES v1.0

Status: canonical draft
Date: 2026-06-27

GES defines mandatory engineering rules for GhostMind components.

## GES-100 — Architecture Principles

Rules:

1. Every component must have a documented purpose.
2. Every component must declare inputs, outputs and dependencies.
3. Every architectural change must reference an ADR.
4. Every critical requirement must be traceable in ACM.

Acceptance criteria:

- component appears in registry;
- specification exists;
- owner is defined;
- ORL is assigned.

## GES-200 — Data and Schema Standards

Rules:

1. Schema-first development is mandatory.
2. Every schema must have a version.
3. Breaking schema changes require migration notes.
4. Runtime events, replay packets and provenance records require validation.

Acceptance criteria:

- JSON/YAML schema exists;
- validation test exists;
- migration policy exists for breaking changes.

## GES-300 — Runtime Services

Rules:

1. Every service must expose health, metrics and structured logs.
2. Every state-changing operation must create Replay.
3. Every privileged operation must pass Governance.

Acceptance criteria:

- health check works;
- metrics visible;
- replay coverage measured;
- governance coverage measured.

## GES-400 — Security

Rules:

1. Secrets only in OpenBao/Vault.
2. Authorization must deny by default.
3. External calls require policy approval.
4. Sensitive actions require audit evidence.

Acceptance criteria:

- secret scan passes;
- policy test passes;
- incident runbook exists.

## GES-500 — Replay and Provenance

Rules:

1. Replay is append-only.
2. Replay hash chain must be verifiable.
3. Provenance is mandatory for knowledge objects.
4. RAG must not index unvalidated documents.

Acceptance criteria:

- replay validation passes;
- provenance coverage measured;
- quarantine pipeline exists.

## GES-600 — Agent Standards

Rules:

1. Every agent must have a manifest.
2. Agents are executors, not authorities.
3. Agents cannot bypass Governance.
4. Agents cannot access Vault directly.

Acceptance criteria:

- agent manifest exists;
- allowed tools declared;
- replay coverage for agent actions.

## GES-700 — Observability

Rules:

1. Metrics, logs and traces are mandatory for critical services.
2. Runtime health must be visible.
3. Security and Governance events must be visible.

Acceptance criteria:

- Prometheus target exists;
- Grafana dashboard exists;
- Loki log stream exists.

## GES-800 — Compliance

Rules:

1. Every critical requirement must map to ADR, schema, code, test, metric and runbook.
2. Broken traceability means incomplete implementation.

Acceptance criteria:

- ACM row exists;
- evidence links are current;
- verification status is not stale.

## GES-900 — Release Management

Rules:

1. Release requires architecture review.
2. Release requires security review.
3. Release requires rollback plan.
4. Release requires post-release verification.

Acceptance criteria:

- release notes exist;
- migration notes exist;
- rollback tested;
- health confirmed after deploy.
