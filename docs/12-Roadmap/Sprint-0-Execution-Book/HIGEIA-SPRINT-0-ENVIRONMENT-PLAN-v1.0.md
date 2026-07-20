# Higeia — Sprint 0 Environment Plan

| Environment | Purpose | Data | Access | External Providers | Deployment |
|---|---|---|---|---|---|
| Local | Development | Synthetic only | Developer | Mock/sandbox | Manual |
| Development | Integration | Synthetic/test | Team | Sandbox | Automated where possible |
| Staging | Release verification | Synthetic or approved test | Restricted | Sandbox/staging | Controlled |
| Controlled Alpha | Limited real operation | Approved real data | Restricted | Production-approved | Approval gate |

## Rules

- No real patient data in local.
- No shared production secrets.
- No unrestricted developer production access.
- Every environment has an owner.
- Configuration differences are documented.
