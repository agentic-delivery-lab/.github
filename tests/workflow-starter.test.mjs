import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateWorkflowStarter } from '../scripts/validate-workflow-starter.mjs';

const root = path.resolve(import.meta.dirname, '..');
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
async function fixture(t) {
  const target = await mkdtemp(path.join(os.tmpdir(), 'public-starter-data-'));
  t.after(() => rm(target, { recursive: true, force: true }));
  await mkdir(path.join(target, 'workflow-templates'));
  const stem = 'workflow-templates/agentic-delivery-quality';
  const workflow = await readFile(path.join(root, `${stem}.yml`), 'utf8');
  const provenance = JSON.parse(await readFile(path.join(root, `${stem}.source.json`), 'utf8'));
  return { target, workflow, provenance, stem };
}
async function check(f, workflow = f.workflow, provenance = f.provenance) {
  await writeFile(path.join(f.target, `${f.stem}.yml`), workflow);
  await writeFile(path.join(f.target, `${f.stem}.source.json`), JSON.stringify(provenance));
  return validateWorkflowStarter(f.target);
}

test('current public starter binds separate immutable workflow and runtime roles', async (t) => {
  const f = await fixture(t);
  assert.deepEqual(await check(f), []);
  assert.notEqual(f.provenance.workflow.commit, f.provenance.controller.commit);
});
for (const role of ['workflow', 'controller']) {
  test(`wrong actual ${role} pin cannot hide in a matching comment`, async (t) => {
    const f = await fixture(t);const pin=f.provenance[role].commit;
    const wrong=f.workflow.replace(pin, '0'.repeat(40))+`\n# ${pin}\n`;
    f.provenance.projectionSha256=sha256(wrong);
    assert.match((await check(f, wrong)).join('\n'), /supported read-only starter/);
  });
}
test('changed starter bytes require matching projection digest', async (t) => {
  const f=await fixture(t);
  assert.match((await check(f, f.workflow+'# drift\n')).join('\n'), /projection digest/);
});
for (const [name, mutate] of [
  ['wrong native repository ID', (p) => { p.repositoryId=1; }],
  ['unapproved repository', (p) => { p.repository='someone/other'; }],
  ['moving workflow branch', (p) => { p.workflow.commit='main'; }],
  ['array workflow commit', (p) => { p.workflow.commit=[p.workflow.commit]; }],
  ['array controller version', (p) => { p.controller.version=[p.controller.version]; }],
  ['missing upstream content digest', (p) => { delete p.workflow.contentSha256; }],
]) test(`starter provenance rejects ${name}`, async (t) => {
  const f=await fixture(t);mutate(f.provenance);
  assert.match((await check(f)).join('\n'), /source provenance/);
});
for (const [name, change] of [
  ['write permissions', (w) => w.replace('contents: read','contents: write')],
  ['inherited credentials', (w) => w+'    secrets: inherit\n'],
  ['extra executable job', (w) => w+'  extra:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo unexpected\n'],
]) test(`starter rejects ${name} even if projection digest is updated`, async (t) => {
  const f=await fixture(t);const changed=change(f.workflow);f.provenance.projectionSha256=sha256(changed);
  assert.match((await check(f,changed)).join('\n'), /supported read-only starter/);
});
