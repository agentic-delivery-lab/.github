# Public organization governance

## Mission

Provide GitHub-supported public organization defaults and contribution UX for
`agentic-delivery-lab`.

## Owns

- the public organization profile;
- default community-health files and issue forms;
- the organization pull-request template;
- deterministic validation of those public surfaces; and
- thin, explicitly pinned workflow starters.

## Must not own

- lifecycle state, issue-field values, Projects state, or runner state;
- Architecture Authority content;
- Control Plane runtime or credentials;
- canonical agents, skills, hooks, or MCP contracts; or
- private member/Copilot publication content.

## Validation

Run `node scripts/validate-governance.mjs`. The check is intentionally
dependency-free and must remain bounded to this repository's public surfaces.
Workflow starters may call versioned Control Plane workflows, but they must
not copy lifecycle, routing, orchestration, or agent-selection logic.
