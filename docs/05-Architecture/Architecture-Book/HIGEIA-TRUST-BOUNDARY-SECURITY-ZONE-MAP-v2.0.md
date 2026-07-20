# Higeia — Trust Boundary and Security Zone Map

## Zone 1 — Public Edge

- web traffic;
- rate limiting;
- TLS;
- WAF where applicable.

## Zone 2 — Application

- authenticated APIs;
- business rules;
- tenant authorization.

## Zone 3 — Sensitive Data

- database;
- object storage;
- backup;
- restricted access.

## Zone 4 — AI Integration

- minimized context;
- provider abstraction;
- output validation;
- cost tracking.

## Zone 5 — Operations

- logs;
- monitoring;
- incident tools;
- restricted telemetry.

## Mandatory controls

- no direct public database access;
- no raw secrets in code;
- no unrestricted support access;
- no AI provider call without trace and policy;
- no cross-tenant query.
