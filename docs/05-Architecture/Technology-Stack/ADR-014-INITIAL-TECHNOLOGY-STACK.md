# ADR-014 — Initial Technology Stack

**Status:** Proposed  
**Decision:** Use TypeScript, Next.js, NestJS, PostgreSQL and AWS-managed infrastructure for the MVP and Controlled Alpha.

## Context

Higeia requires a maintainable, auditable and secure stack suitable for a small initial team and sensitive health-related data.

## Decision

- TypeScript end-to-end.
- Next.js frontend.
- NestJS backend.
- Modular monolith.
- PostgreSQL primary database.
- AWS sa-east-1 as primary region.
- Managed infrastructure where practical.
- AI providers accessed only through an internal adapter.

## Consequences

### Positive

- reduced language fragmentation;
- strong hiring market;
- modular architecture;
- managed services;
- local AWS region;
- clear migration path.

### Negative

- AWS complexity;
- need for experienced technical ownership;
- Cognito UX work;
- potentially higher initial cost than low-code platforms.

## Review triggers

- inability to hire;
- unacceptable cost;
- region limitations;
- Alpha requirements change;
- security assessment failure.
