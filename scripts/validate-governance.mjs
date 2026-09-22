import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'README.md',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'SUPPORT.md',
  'profile/README.md',
  '.github/CODEOWNERS',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/pull_request_template.md',
  '.github/workflows/validate-governance.yml',
];
const requiredForms = [
  'architecture-decision.yml',
  'bug.yml',
  'feature.yml',
  'idea.yml',
  'implementation.yml',
  'requirements.yml',
  'research.yml',
  'task.yml',
  'validation.yml',
];
const FORBIDDEN_PATHS = [
  /^\.agents(?:\/|$)/,
  /^\.claude(?:\/|$)/,
  /^api(?:\/|$)/,
  /^src(?:\/|$)/,
  /^config(?:\/|$)/,
  /^sessions?(?:\/|$)/,
  /^runtime(?:\/|$)/,
  /^secrets?(?:\/|$)/,
];
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----/i,
  /(?:gh[pousr]_|github_pat_|sk-[A-Za-z0-9_-]{15,})/,
];

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function files(directory, prefix = '') {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), `${relative}/`));
    else result.push(relative);
  }
  return result;
}

const errors = [];
for (const relativePath of requiredFiles) {
  if (!(await exists(relativePath))) errors.push(`missing required public surface: ${relativePath}`);
}
const issueForms = (await files('.github/ISSUE_TEMPLATE')).filter((file) => file.endsWith('.yml'));
for (const form of requiredForms) if (!issueForms.includes(form)) errors.push(`missing issue form: ${form}`);
for (const relativePath of await files('.')) {
  if (relativePath === 'scripts/validate-governance.mjs') continue;
  if (FORBIDDEN_PATHS.some((pattern) => pattern.test(relativePath))) errors.push(`public governance contains a forbidden runtime path: ${relativePath}`);
  const contents = await readFile(path.join(root, relativePath), 'utf8');
  if (SECRET_PATTERNS.some((pattern) => pattern.test(contents))) errors.push(`public governance contains a credential-like value: ${relativePath}`);
}
const workflow = await readFile(path.join(root, '.github/workflows/validate-governance.yml'), 'utf8').catch(() => '');
if (!workflow.includes('actions/checkout@fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09')) errors.push('governance workflow must pin checkout by SHA');
if (workflow.includes('secrets: inherit')) errors.push('governance workflow must not inherit secrets');

if (errors.length) {
  process.stderr.write(`Public governance check failed:\n${errors.map((error) => `- ${error}`).join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Public governance check passed: ${requiredFiles.length} required files and ${requiredForms.length} issue forms.\n`);
}
