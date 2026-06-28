# Governance Runtime Specification

Status: canonical draft
Date: 2026-06-27

## Purpose

Governance Runtime decides what the system is allowed to do.

It must stand between requests and execution.

## Scope

Included:

- authorization;
- policy evaluation;
- risk classification;
- allow / deny / restrict / escalate decisions;
- decision recording;
- replay integration.

Excluded:

- LLM generation;
- direct secret access;
- raw document indexing.

## Functional Requirements

### GOV-FR-001

Every executable action must receive a Governance decision before execution.

### GOV-FR-002

Governance must deny by default when policy is missing, invalid or unavailable.

### GOV-FR-003

Governance decisions must include:

- decision_id;
- actor;
- requested_action;
- policy_id;
- policy_version;
- decision;
- reason;
- timestamp;
- replay_id.

### GOV-FR-004

All Governance decisions must be persisted in Replay.

## Decision Types

```yaml
allow: action may execute
restrict: action may execute with constraints
deny: action must not execute
escalate: human review required
```

## Failure Modes

| Failure | Symptom | Severity | Required Response |
|---|---|---:|---|
| policy unavailable | engine cannot evaluate | critical | deny by default |
| policy conflict | multiple incompatible rules | high | escalate |
| identity unknown | actor cannot be verified | critical | deny |
| replay unavailable | decision cannot be recorded | critical | deny or pause execution |

## Monitoring

Required metrics:

- governance_coverage
- allow_count
- deny_count
- restrict_count
- escalation_count
- policy_errors
- governance_latency_ms

## Definition of Done

Governance Runtime is complete only if:

- every privileged action passes Governance;
- deny-by-default behavior is tested;
- policy conflict behavior is tested;
- replay integration is verified;
- ACM row is updated with evidence.
