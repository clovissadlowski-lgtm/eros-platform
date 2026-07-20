# ADR-016 — AI Provider Abstraction and Initial Provider

**Status:** Proposed

## Decision

Create an internal AI Provider Adapter.

Use OpenAI API as the first experimental implementation, subject to vendor, privacy, security and retention review.

## Prohibited

- direct SDK calls from business modules;
- unversioned prompts;
- raw production health data during PoC;
- output publication without validation and review;
- provider-specific data model in core domains.

## Exit strategy

A second adapter must be possible without rewriting business modules.
