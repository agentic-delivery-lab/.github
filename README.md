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
