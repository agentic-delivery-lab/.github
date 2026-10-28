# .github

This public repository is the canonical source for organization-wide GitHub
community-health defaults and issue forms for `agentic-delivery-lab`.

## Default inventory

The organization publishes these defaults:

- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — community standards and private
  enforcement contact.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — organization-wide contribution,
  safety, testing, documentation, and review guidance.
- [`SECURITY.md`](SECURITY.md) — private vulnerability-reporting guidance.
- [`SUPPORT.md`](SUPPORT.md) — documentation and issue-based support guidance.
- [Pull-request template](.github/pull_request_template.md) — the accepted
  organization contract for source issue, implementation plan, changes,
  verification, evidence, delivery risk, review guidance and author checklist.
- [Pull-request body workflow](.github/workflows/pull-request-body.yml) —
  validates that contract using trusted base-branch code and read-only permissions.
- [Repository ruleset definition](.github/rulesets/require-pull-request-body.json) —
  desired hosting configuration applied separately; a file is not live enforcement.
- [Issue forms and configuration](.github/ISSUE_TEMPLATE/) — the canonical
  issue forms and enabled blank-issue fallback.

The repository intentionally does not provide organization-wide licenses,
funding metadata, or discussion category forms in this inventory.

The canonical source links are:

- [`CODE_OF_CONDUCT.md`](https://raw.githubusercontent.com/agentic-delivery-lab/.github/main/CODE_OF_CONDUCT.md)
- [`CONTRIBUTING.md`](https://raw.githubusercontent.com/agentic-delivery-lab/.github/main/CONTRIBUTING.md)
- [`SECURITY.md`](https://raw.githubusercontent.com/agentic-delivery-lab/.github/main/SECURITY.md)
- [`SUPPORT.md`](https://raw.githubusercontent.com/agentic-delivery-lab/.github/main/SUPPORT.md)
- [Pull-request template](https://raw.githubusercontent.com/agentic-delivery-lab/.github/main/.github/pull_request_template.md)
- [Issue forms](https://github.com/agentic-delivery-lab/.github/tree/main/.github/ISSUE_TEMPLATE/)
- [Issue-template configuration](https://raw.githubusercontent.com/agentic-delivery-lab/.github/main/.github/ISSUE_TEMPLATE/config.yml)

## Inheritance and overrides

GitHub uses these defaults for repositories owned by the organization when the
target repository does not contain its own valid file of that type. The
`.github` repository must remain public for GitHub to use it as the source of
organization defaults.

For supported files that can be stored in several locations, GitHub checks the
target repository's `.github` folder first, then its root, then its `docs`
folder. If no local file is found, GitHub uses the corresponding default from
this repository. A repository-specific file therefore intentionally overrides
the organization default; defaults are not copied into individual clones.

Issue forms and their configuration are a special case: when a repository has
its own valid `.github/ISSUE_TEMPLATE` directory or configuration, GitHub does
not merge the organization issue-form directory with it. Keep a local issue
template set complete when a repository needs different issue intake.

These files provide shared community guidance only. Repository-specific
instructions, architecture decisions, agent skills, delivery rules, and CI
remain in each repository because GitHub community-health defaults do not
inherit those files automatically.

## Standards

- [GitHub: Creating a default community health file](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

## Ordinary requests and validation

Use **New issue → Open a blank issue** to describe an ordinary request in your
own words. Issue forms are optional; you do not need to set lifecycle fields
to submit a request.

Validation preserves `blank_issues_enabled: true`. The dependency-free check
admits one plain setting and plain `contact_links` entries; aliases, duplicate
keys and multiple YAML documents fail closed. Run
`node scripts/validate-governance.mjs` and `node --test tests/*.test.mjs`.

## Versioned workflow starter

The [quality starter](workflow-templates/agentic-delivery-quality.yml) calls one
read-only Control Plane workflow. Its adjacent
[source record](workflow-templates/agentic-delivery-quality.source.json) declares
the native source repository ID, immutable workflow commit/path/content digest,
compatible controller version/commit and exact starter digest. Workflow source
`4d7448c0d628bd591d16c57082204391f1faeffd` is separate from controller release
`0.2.0-draft.67` at `98495275481aff381180771da6eba9da95bc7816`.

The dependency-free local validator checks the declared source shape, exact
projection digest, separate job-field pins and closed read-only starter format.
It does not query GitHub or attest upstream content, release readiness, live
hosting controls or runtime admission. Review upstream content at the immutable
source before updating the record. Draft source records do not authorize a
consumer rollout. Distribution owns managed bootstrap; this repository supplies
the optional GitHub workflow starter.
