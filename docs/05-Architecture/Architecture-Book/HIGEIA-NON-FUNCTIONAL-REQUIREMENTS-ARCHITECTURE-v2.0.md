# Higeia — Non-Functional Requirements Architecture

| NFR ID | Requirement | Initial Target | Evidence |
|---|---|---|---|
| NFR-001 | Tenant isolation | No cross-tenant access | Isolation tests |
| NFR-002 | Encryption in transit | TLS | Configuration evidence |
| NFR-003 | Encryption at rest | Enabled for sensitive stores | Provider/config evidence |
| NFR-004 | Auditability | Critical actions logged | Audit event test |
| NFR-005 | Rollback | Tested before Alpha | Rollback record |
| NFR-006 | Backup restore | Tested | Restore evidence |
| NFR-007 | AI traceability | Prompt/model/trace recorded | AI trace samples |
| NFR-008 | Cost visibility | Cost by use case | Dashboard |
| NFR-009 | Availability | Target TBD | Monitoring |
| NFR-010 | Privacy deletion | Workflow tested | Deletion test |
