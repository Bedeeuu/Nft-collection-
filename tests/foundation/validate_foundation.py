#!/usr/bin/env python3
"""GhostMind Foundation Pack validation.

This script checks the presence and basic parseability of canonical P0 artifacts.
It intentionally avoids external services so it can run in CI.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

ROOT = Path(__file__).resolve().parents[2]

REQUIRED_FILES = [
    "schemas/module_manifest.schema.json",
    "schemas/replay_packet.schema.json",
    "schemas/provenance_record.schema.json",
    "governance/security_policy.yaml",
    "maps/dependency_graph.json",
    "registry/services_registry.yaml",
    "registry/agents_registry.yaml",
    "registry/canonical_terms.yaml",
]

REQUIRED_SECURITY_POLICY_KEYS = [
    "schema_version",
    "policy_id",
    "principles",
    "defaults",
    "vault",
    "rag",
    "execution",
    "observability",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"invalid JSON {path}: {exc}")


def load_yaml(path: Path) -> dict:
    if yaml is None:
        fail("PyYAML is required for YAML validation")
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            fail(f"YAML root must be object: {path}")
        return data
    except Exception as exc:
        fail(f"invalid YAML {path}: {exc}")


def main() -> int:
    for rel in REQUIRED_FILES:
        path = ROOT / rel
        if not path.exists():
            fail(f"missing required file: {rel}")

    for rel in [
        "schemas/module_manifest.schema.json",
        "schemas/replay_packet.schema.json",
        "schemas/provenance_record.schema.json",
        "maps/dependency_graph.json",
    ]:
        load_json(ROOT / rel)

    policy = load_yaml(ROOT / "governance/security_policy.yaml")
    for key in REQUIRED_SECURITY_POLICY_KEYS:
        if key not in policy:
            fail(f"security_policy.yaml missing key: {key}")

    services = load_yaml(ROOT / "registry/services_registry.yaml")
    agents = load_yaml(ROOT / "registry/agents_registry.yaml")
    terms = load_yaml(ROOT / "registry/canonical_terms.yaml")

    if not services.get("services"):
        fail("services_registry.yaml contains no services")
    if not agents.get("agents"):
        fail("agents_registry.yaml contains no agents")
    if not terms.get("terms"):
        fail("canonical_terms.yaml contains no terms")

    print("GhostMind Foundation Pack validation: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
