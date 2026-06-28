# GhostMind P0 Completion Gate

Status: canonical gate
Date: 2026-06-27

P0 cannot be closed by intention. It requires evidence.

## Required Gates

| Gate | Requirement | Evidence |
|---|---|---|
| G1 | OpenBao operational | version, init/seal status, access policy |
| G2 | n8n upgraded / controlled | version, access policy, public exposure status |
| G3 | AppArmor enabled | aa-status output |
| G4 | Rootless containers | docker/podman rootless evidence |
| G5 | WireGuard admin access | service status, allowed peers |
| G6 | Foundation Pack exists | files and schemas committed |
| G7 | Observability active | Prometheus, Grafana, Loki evidence |

## Foundation Pack Minimum

```text
schemas/module_manifest.schema.json
schemas/replay_packet.schema.json
schemas/provenance_record.schema.json
governance/security_policy.yaml
maps/dependency_graph.json
```

## P0 Completion Formula

```yaml
P0_COMPLETE:
  openbao: PASS
  n8n: PASS
  apparmor: PASS
  rootless: PASS
  wireguard: PASS
  foundation_pack: PASS
  observability: PASS
```

## P1 Unlock

P1 may open only after P0 passes.

P1 includes:

- Runtime Testing
- Replay Verification
- Provenance Validation
- Reliability Metrics
- Semantic Drift Dashboard

## Freeze Rule

Until P0 is complete, the following remain blocked:

- new agents
- new runtime layers
- new HUD modes
- new ontology branches
- new NFT runtime systems
