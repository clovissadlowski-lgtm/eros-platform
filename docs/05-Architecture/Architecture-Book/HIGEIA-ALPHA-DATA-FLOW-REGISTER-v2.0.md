# Higeia — Alpha Data Flow Register

| Flow ID | Source | Destination | Data | Purpose | Classification | Provider | Retention | Control |
|---|---|---|---|---|---|---|---|---|
| FLOW-001 | Patient Web | Application API | Anamnesis answers | Intake | Sensitive Health | Internal | Policy-defined | Auth, validation |
| FLOW-002 | Application API | Database | Structured answers | Persistence | Sensitive Health | Internal | Policy-defined | Encryption, tenant filter |
| FLOW-003 | API | AI Adapter | Minimized context | Summary | Sensitive Health | AI Vendor | Minimal | Redaction, terms |
| FLOW-004 | AI Adapter | API | Draft summary | Professional review | Confidential | AI Vendor | Minimal | Validation, logging |
| FLOW-005 | Patient Web | Object Storage | Photo | Progress tracking | Sensitive Health | Storage Vendor | Limited | Signed URL, consent |
| FLOW-006 | Application | Monitoring | Metadata and telemetry | Operations | Internal/Confidential | Monitoring Vendor | Limited | No raw health text |
