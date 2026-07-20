# ADR-015 — AWS São Paulo as Primary Cloud Region

**Status:** Proposed

## Decision

Use AWS `sa-east-1` as the primary region for staging and Controlled Alpha.

## Conditions

- service availability confirmed;
- cost estimated;
- backups and restore designed;
- provider data flows mapped;
- contractual and LGPD review completed.

## Consequences

Data may remain in Brazilian infrastructure for core AWS services, but external AI or communication providers may still create international data flows that require separate governance.
