import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// This public adapter checks its declared source binding and closed starter
// shape. Native source acceptance/release and runtime admission remain separate.
export async function validateWorkflowStarter(root) {
  try {
    const stem = path.join(root, 'workflow-templates/agentic-delivery-quality');
    const source = JSON.parse(await readFile(`${stem}.source.json`, 'utf8'));
    const workflow = await readFile(`${stem}.yml`, 'utf8');
    const sha = /^[0-9a-f]{40}$/;
    const digest = /^[0-9a-f]{64}$/;
    if (source.schemaVersion !== 1 || source.repository !== 'agentic-delivery-lab/agentic-delivery'
      || source.repositoryId !== 1358455028
      || [source.workflow?.commit, source.controller?.commit, source.workflow?.contentSha256,
        source.projectionSha256, source.controller?.version].some((value) => typeof value !== 'string')
      || !sha.test(source.workflow?.commit ?? '') || !sha.test(source.controller?.commit ?? '')
      || source.workflow?.path !== '.github/workflows/agentic-delivery-quality.yml'
      || !digest.test(source.workflow?.contentSha256 ?? '') || !digest.test(source.projectionSha256 ?? '')
      || !/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(source.controller?.version ?? '')) {
      return ['public workflow starter source provenance is missing or unsupported'];
    }
    const errors = [];
    if (createHash('sha256').update(workflow).digest('hex') !== source.projectionSha256) {
      errors.push('public workflow starter projection digest differs');
    }
    // A deliberately closed format: no YAML aliases, hidden jobs, credentials
    // or arbitrary executable steps. These are source roles, not branch names.
    const expected = `name: Agentic Delivery quality

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  control-plane-contract:
    uses: ${source.repository}/${source.workflow.path}@${source.workflow.commit}
    with:
      controller_commit: ${source.controller.commit}
`;
    if (workflow !== expected) errors.push('public workflow must use the supported read-only starter with its declared source pins');
    return errors;
  } catch {
    return ['public workflow starter source provenance or projection is unavailable'];
  }
}
