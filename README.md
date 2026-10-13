# .github

Organization-wide default community health files for `agentic-delivery-lab`.

## Available defaults

- [Issue forms](.github/ISSUE_TEMPLATE/) collect structured work requests.
- [Pull request template](.github/pull_request_template.md) records context,
  implementation-plan alignment, verification evidence, delivery risk, and
  review guidance.
- [Pull request body workflow](.github/workflows/pull-request-body.yml) checks
  the same contract with trusted base-branch code and read-only permissions.
- [Repository ruleset definition](.github/rulesets/require-pull-request-body.json)
  is applied separately because this organization uses GitHub Free.

GitHub uses these files for organization repositories that do not define a
file of the same type. A repository-specific file takes precedence over the
organization default.

## Ordinary requests

Use **New issue → Open a blank issue** to describe an ordinary request in your
own words. Issue forms are optional; you do not need to set lifecycle fields
to submit a request.

Validation preserves `blank_issues_enabled: true`. The dependency-free check
admits one plain setting and the existing plain `contact_links` entries;
aliases, duplicate keys and multiple YAML documents fail closed. Run
`node scripts/validate-governance.mjs` and `node --test tests/*.test.mjs`.
