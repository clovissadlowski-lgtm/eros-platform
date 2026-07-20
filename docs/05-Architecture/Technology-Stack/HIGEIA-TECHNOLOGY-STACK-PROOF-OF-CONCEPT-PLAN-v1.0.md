# Higeia — Technology Stack Proof of Concept Plan

## Goal

Demonstrate that the proposed stack works end to end without using real patient data.

## Scenario

1. User authenticates.
2. Backend validates tenant.
3. Synthetic check-in is stored.
4. AI Adapter uses a mock provider.
5. Draft summary is created.
6. Review status is recorded.
7. Logs and trace are visible.
8. Feature flag disables AI.
9. Deployment reaches staging.
10. Rollback is demonstrated.

## Acceptance criteria

- [ ] Next.js app runs.
- [ ] NestJS API runs.
- [ ] PostgreSQL migration runs.
- [ ] Cognito authentication works.
- [ ] Tenant negative test passes.
- [ ] Mock AI adapter works.
- [ ] Trace ID is recorded.
- [ ] No sensitive raw data appears in logs.
- [ ] GitHub Actions passes.
- [ ] Staging deployment works.
- [ ] Rollback is demonstrated.
- [ ] Cost estimate is documented.
