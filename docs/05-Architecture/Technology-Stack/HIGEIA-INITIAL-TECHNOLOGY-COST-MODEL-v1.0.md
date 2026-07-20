# Higeia — Initial Technology Cost Model

## Cost categories

- compute;
- database;
- storage;
- data transfer;
- authentication;
- logs and metrics;
- secrets and keys;
- email;
- AI tokens;
- backups;
- security tooling;
- engineering labor;
- external reviews.

## Required estimates before Alpha

| Cost ID | Category | Unit | Assumption | Monthly Estimate | Owner |
|---|---|---|---|---|---|
| COST-001 | ECS | service/hour | TBD | TBD | Technical |
| COST-002 | RDS | instance/storage | TBD | TBD | Technical |
| COST-003 | S3 | GB/requests | TBD | TBD | Technical |
| COST-004 | CloudWatch | logs/metrics | TBD | TBD | Operations |
| COST-005 | Cognito | active users | TBD | TBD | Product |
| COST-006 | AI | tokens/use case | TBD | TBD | AI Owner |
| COST-007 | Backup | retained storage | TBD | TBD | Operations |

## Rule

Do not approve infrastructure based solely on free-tier assumptions.

Pricing must be checked at the time of deployment.
