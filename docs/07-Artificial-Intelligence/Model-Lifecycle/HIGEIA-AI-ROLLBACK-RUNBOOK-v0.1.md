# Higeia — AI Rollback Runbook

## Before rollback

- [ ] Incident or trigger identified.
- [ ] Severity classified.
- [ ] Current versions captured.
- [ ] Evidence preserved.
- [ ] Rollback target confirmed.
- [ ] Owners notified.
- [ ] User exposure assessed.

## Execute

- [ ] Disable current feature flag.
- [ ] Activate approved previous version.
- [ ] Revert model configuration.
- [ ] Revert prompt.
- [ ] Revert schema if safe.
- [ ] Disable affected tools.
- [ ] Clear incompatible cache.
- [ ] Validate health checks.

## Validate

- [ ] Baseline restored.
- [ ] Safety checks pass.
- [ ] Schema checks pass.
- [ ] Latency acceptable.
- [ ] Cost normal.
- [ ] No cross-user issue.
- [ ] Logs and alerts active.

## After rollback

- [ ] Monitor.
- [ ] Open or update incident.
- [ ] Communicate.
- [ ] Create regression test.
- [ ] Investigate cause.
- [ ] Decide re-release or deprecation.
