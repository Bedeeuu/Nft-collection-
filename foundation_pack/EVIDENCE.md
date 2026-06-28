# GhostMind Foundation Pack Evidence

Date: 2026-06-28

This file tracks factual evidence for P0 completion.

## Evidence Rules

Valid evidence:

- commit SHA
- test output
- CI run
- command output
- metric export
- runbook execution note

Invalid evidence:

- intention
- roadmap item
- undocumented claim

## Current Evidence

### Documentation

Status: PASS

Evidence: canonical documentation exists under `docs/ghostmind/`.

### Schemas

Status: PASS

Evidence:

- `schemas/module_manifest.schema.json`
- `schemas/replay_packet.schema.json`
- `schemas/provenance_record.schema.json`

### Governance Policy

Status: PASS

Evidence:

- `governance/security_policy.yaml`

### Dependency Graph

Status: PASS

Evidence:

- `maps/dependency_graph.json`

### Registry

Status: PASS

Evidence:

- `registry/services_registry.yaml`
- `registry/agents_registry.yaml`
- `registry/canonical_terms.yaml`

### Validation Script

Status: PASS

Evidence:

- `tests/foundation/validate_foundation.py`

### CI Workflow

Status: ADDED_UNVERIFIED

Evidence:

- `.github/workflows/foundation.yml`
- commit: `a0feba4a0969701087bf809d3e83af86380e6adf`

Note: GitHub status-check confirmation was not available through the connected API at the time of this update.

### Runtime Infrastructure Gates

Status: PENDING

Required command evidence from the target server:

- `bao version`
- `aa-status`
- `docker info` or `podman info`
- `systemctl status wg-quick@wg0`
- `systemctl status prometheus`
- `systemctl status grafana-server`
- `systemctl status loki`

These gates must not be marked PASS without real command output.
