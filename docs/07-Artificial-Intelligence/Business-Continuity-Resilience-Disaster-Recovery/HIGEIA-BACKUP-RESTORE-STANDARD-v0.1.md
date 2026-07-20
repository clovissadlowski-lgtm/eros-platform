# Higeia — Backup and Restore Standard

## Backup inventory

| Asset | Method | Frequency | Retention | Encryption | Isolation | Owner | Restore Test |
|---|---|---|---|---|---|---|---|
| Primary database | TBD | TBD | TBD | Required | Required | TBD | TBD |
| Object storage | TBD | TBD | TBD | Required | Required | TBD | TBD |
| Vector database | TBD | TBD | TBD | Required | TBD | TBD | TBD |
| Configuration | TBD | On change | TBD | Required | Required | TBD | TBD |
| Code repository | Version control | Continuous | Repository policy | Required | Provider controls | TBD | TBD |

## Restore requirements

- Restore must be tested.
- Integrity must be verified.
- Access must be controlled.
- Personal data obligations remain applicable.
- Recovery evidence must be retained.
