# Replay Flow

1. Operation starts.
2. Input state captured.
3. Governance decision captured.
4. Action state captured.
5. Result state captured.
6. Previous hash read.
7. Event hash calculated.
8. Replay packet validated against schema.
9. Replay packet persisted append-only.
10. Replay ID returned.
11. Metrics updated.

Failure handling:

- Missing packet: incident.
- Hash mismatch: integrity failure.
- Schema mismatch: reject packet.
- Storage failure: pause state-changing operations.
