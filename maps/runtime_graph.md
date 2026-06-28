# GhostMind Runtime Graph

User Operator -> API Gateway -> Authentication -> Governance Engine -> Policy Decision -> Execution Layer

Execution Layer -> RAG Runtime -> Document Quarantine -> Provenance Runtime -> Vector Database

RAG Runtime -> Local LLM Runtime

Execution Layer -> Replay Engine
Governance Engine -> Replay Engine
RAG Runtime -> Replay Engine

Replay Engine -> PostgreSQL
Provenance Runtime -> PostgreSQL

API Gateway -> Prometheus
Governance Engine -> Prometheus
Replay Engine -> Prometheus
Prometheus -> Grafana

API Gateway -> Loki
Governance Engine -> Loki
Replay Engine -> Loki

Vault Service -> API Gateway
