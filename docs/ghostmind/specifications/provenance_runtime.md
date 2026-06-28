# Provenance Runtime Specification

Status: canonical draft
Date: 2026-06-27

## Purpose

Provenance Runtime preserves the origin, integrity and trust state of knowledge objects.

Knowledge without provenance is treated as noise.

## Scope

Included:

- source identification;
- ownership metadata;
- content hashing;
- classification;
- trust score;
- version tracking;
- RAG integration.

Excluded:

- semantic interpretation;
- LLM generation;
- permanent storage of secrets.

## Functional Requirements

### PRV-FR-001

Every knowledge object must have a provenance record before retrieval.

### PRV-FR-002

A provenance record must include:

- provenance_id;
- object_id;
- source;
- owner;
- timestamp;
- content_hash;
- classification;
- trust_score;
- schema_version.

### PRV-FR-003

Documents may not enter vector storage before provenance validation.

### PRV-FR-004

Hash mismatch must quarantine the object.

## Classification Levels

```yaml
public: safe for general use
internal: project internal
confidential: restricted access
restricted: requires explicit authorization
```

## Failure Modes

| Failure | Symptom | Severity | Required Response |
|---|---|---:|---|
| missing provenance | object has no source record | high | quarantine |
| hash mismatch | content changed | critical | block retrieval |
| unknown source | source cannot be verified | medium-high | reduce trust score or quarantine |
| classification mismatch | unauthorized retrieval risk | high | deny retrieval |

## Monitoring

Required metrics:

- provenance_coverage
- unverified_objects
- quarantined_objects
- hash_mismatch_count
- retrieval_denied_count

## Definition of Done

Provenance Runtime is complete only if:

- all knowledge objects have provenance;
- RAG retrieval enforces classification;
- hash validation is tested;
- quarantine path is tested;
- ACM row is updated with evidence.
