# Replay Runtime Specification

Status: canonical draft
Date: 2026-06-27

## Purpose

Replay Runtime guarantees reconstruction of every state-changing operation.

If an action cannot be replayed, it cannot be fully trusted.

## Scope

Included:

- replay packet capture;
- schema validation;
- hash chain generation;
- append-only persistence;
- replay retrieval;
- integrity verification.

Excluded:

- primary business logic;
- direct policy decisions;
- raw secret storage.

## Functional Requirements

### RPL-FR-001

Every state-changing operation must create a Replay Packet.

### RPL-FR-002

Every Replay Packet must include:

- event_id;
- timestamp;
- actor;
- action;
- input_state;
- decision_state;
- result_state;
- previous_hash;
- event_hash;
- schema_version.

### RPL-FR-003

Replay storage must be append-only.

### RPL-FR-004

Replay hash chain must be verifiable.

### RPL-FR-005

Replay must preserve the policy decision used at execution time.

## Failure Modes

| Failure | Symptom | Severity | Required Response |
|---|---|---:|---|
| missing packet | state changed but no replay entry | critical | create incident, block P1 |
| broken hash chain | previous_hash mismatch | critical | freeze writes, run integrity check |
| schema mismatch | invalid replay packet | high | reject packet, log violation |
| storage corruption | unreadable replay history | critical | restore from backup, verify chain |

## Recovery Procedure

1. Stop new write operations if integrity is uncertain.
2. Export last valid hash checkpoint.
3. Validate replay chain from last trusted checkpoint.
4. Identify missing or corrupted packets.
5. Restore from replay backup if required.
6. Recompute indexes.
7. Generate incident report.

## Monitoring

Required metrics:

- replay_coverage
- replay_write_latency_ms
- replay_validation_failures
- replay_hash_chain_status
- replay_storage_errors

## Definition of Done

Replay Runtime is complete only if:

- 100% of state-changing actions produce replay;
- schema validation passes;
- hash chain validation passes;
- corruption test passes;
- recovery runbook has been executed at least once;
- ACM row is updated with evidence.
