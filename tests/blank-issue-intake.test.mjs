import assert from 'node:assert/strict';
import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const [name, config, expected] of [
  ['enabled', 'blank_issues_enabled: true\n', 0],
  ['disabled', 'blank_issues_enabled: false\n', 1],
  ['missing', '# no blank entry setting\n', 1],
  ['duplicate', 'blank_issues_enabled: true\nblank_issues_enabled: false\n', 1],
  ['quoted duplicate', 'blank_issues_enabled: true\n"blank_issues_enabled": false\n', 1],
  ['alias', 'blank_issues_enabled: *enabled\n', 1],
  ['second document', 'blank_issues_enabled: true\n---\nblank_issues_enabled: false\n', 1],
]) {
  test(`public validator checks blank Issue intake: ${name}`, async (t) => {
    const scratch = await mkdtemp(path.join(os.tmpdir(), 'adl-public-intake-'));
    t.after(() => rm(scratch, { recursive: true, force: true }));
    await cp(root, scratch, { recursive: true, filter: (source) => path.basename(source) !== '.git' });
    await writeFile(path.join(scratch, '.github/ISSUE_TEMPLATE/config.yml'), config);
    const result = spawnSync(process.execPath, ['scripts/validate-governance.mjs'], { cwd: scratch, encoding: 'utf8' });
    assert.equal(result.status, expected, result.stdout + result.stderr);
    if (expected) assert.match(result.stderr, /blank Issues/);
  });
}
