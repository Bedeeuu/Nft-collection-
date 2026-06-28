# Governance Flow

1. Request received.
2. Actor identity checked.
3. Requested action extracted.
4. Policy matched.
5. Risk level calculated.
6. Decision produced: allow, restrict, deny, or escalate.
7. Decision written to Replay.
8. Execution starts only after positive Governance decision.
9. Result written to Replay.

Default behavior: deny when policy is missing, unavailable, invalid, or conflicted.
