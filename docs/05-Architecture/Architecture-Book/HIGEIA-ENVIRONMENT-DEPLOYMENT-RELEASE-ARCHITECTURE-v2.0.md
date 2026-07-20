# Higeia — Environment, Deployment and Release Architecture

## Environments

- Local
- Development
- Staging
- Controlled Alpha

## Release requirements

- reviewed code;
- automated tests;
- migration review;
- security checks;
- prompt/model version lock;
- feature flag plan;
- rollback plan;
- monitoring plan;
- approval.

## Rollback units

- application;
- configuration;
- prompt;
- model route;
- feature;
- database migration.

## Prohibited

- direct unreviewed production change;
- shared secrets between environments;
- unversioned prompts;
- silent model change.
