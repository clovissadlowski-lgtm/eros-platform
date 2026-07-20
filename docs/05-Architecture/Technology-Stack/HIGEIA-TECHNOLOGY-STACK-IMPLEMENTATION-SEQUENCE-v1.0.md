# Higeia — Technology Stack Implementation Sequence

## Phase 1 — Approve

- review recommendation;
- approve or reject each component;
- create accepted ADRs;
- appoint technical owner.

## Phase 2 — Local PoC

- create monorepo;
- create Next.js app;
- create NestJS API;
- configure PostgreSQL;
- create mock authentication where necessary;
- create AI Adapter contract;
- add tests.

## Phase 3 — AWS Foundation

- AWS account governance;
- IAM;
- budgets;
- CloudTrail;
- KMS;
- Secrets Manager;
- network baseline;
- RDS;
- S3;
- Cognito;
- ECS staging.

## Phase 4 — Delivery

- GitHub Actions;
- image registry;
- deployment;
- logs;
- metrics;
- rollback.

## Phase 5 — AI Provider

- vendor review;
- project access;
- retention configuration;
- synthetic-data test;
- structured outputs;
- cost limit;
- kill switch.

## Phase 6 — Sprint 0 Gate

- execute PoC;
- collect evidence;
- update readiness review;
- decide readiness for Sprint 1.
