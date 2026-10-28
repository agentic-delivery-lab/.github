import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  DEPENDABOT_LOGIN,
  validatePullRequestBody,
} from '../scripts/validate-pull-request-body.mjs';

const completeBody = `## Summary

Implement the organization pull request contract.

## Source

- Source issue: #5

## Plan

- Implementation plan: Add a trusted workflow and validator.
- Plan deviations: None

## Changes

The workflow and validator are added.

## Verification

Node tests pass.

## Evidence

Not applicable.

## Risk and delivery

- Risk level and impact: Low.
- Security and privacy: No secrets are used.
- Breaking changes and compatibility: PR descriptions become required.
- Deployment or migration: Merge before activating the ruleset.
- Rollback: Disable the repository ruleset.
- Dependencies and follow-up work: Apply the ruleset after the check reports.

## Review guidance

- Review focus: Workflow trust boundary.
- Suggested review order: Workflow, validator, documentation.
- Out of scope: Organization plan changes.

## Author checklist

- [x] I reviewed my own diff.
- [x] Verification evidence is complete.
`;

test('accepts the organization template contract', () => {
  assert.equal(validatePullRequestBody({ body: completeBody, author: 'octocat' }).valid, true);
});

test('keeps Dependabot as the only body exemption', () => {
  assert.equal(validatePullRequestBody({ body: '', author: DEPENDABOT_LOGIN }).exempt, true);
  assert.equal(validatePullRequestBody({ body: '', author: 'release-bot[bot]' }).valid, false);
});

test('requires Source and Plan separately', () => {
  const combined = completeBody.replace('## Source', '## Source and plan').replace('\n## Plan', '');
  const result = validatePullRequestBody({ body: combined, author: 'octocat' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Missing required section: ## Source'));
  assert.ok(result.errors.includes('Missing required section: ## Plan'));
});
