#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="foundation_pack/evidence"
mkdir -p "$OUT_DIR"
OUT_FILE="$OUT_DIR/p0_server_evidence_$(date -u +%Y%m%dT%H%M%SZ).txt"

{
  echo "GhostMind P0 Server Evidence"
  echo "Generated UTC: $(date -u --iso-8601=seconds)"
  echo

  echo "## OpenBao"
  if command -v bao >/dev/null 2>&1; then
    bao version || true
  else
    echo "bao: NOT_FOUND"
  fi
  echo

  echo "## AppArmor"
  if command -v aa-status >/dev/null 2>&1; then
    aa-status || true
  else
    echo "aa-status: NOT_FOUND"
  fi
  echo

  echo "## Containers"
  if command -v docker >/dev/null 2>&1; then
    docker info 2>/dev/null | sed -n '1,80p' || true
  elif command -v podman >/dev/null 2>&1; then
    podman info 2>/dev/null | sed -n '1,80p' || true
  else
    echo "docker/podman: NOT_FOUND"
  fi
  echo

  echo "## WireGuard"
  systemctl status wg-quick@wg0 --no-pager || true
  echo

  echo "## Prometheus"
  systemctl status prometheus --no-pager || true
  echo

  echo "## Grafana"
  systemctl status grafana-server --no-pager || true
  echo

  echo "## Loki"
  systemctl status loki --no-pager || true

} | tee "$OUT_FILE"

echo "Evidence written to $OUT_FILE"
