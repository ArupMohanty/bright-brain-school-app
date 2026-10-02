import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { questionFileSchema } from '../src/data/schema.ts';

const root = fileURLToPath(new URL('../src/data/questions', import.meta.url));

/** Common US spellings that must not appear in learner-facing text (British English only). */
const usPattern =
  /\b(color\w*|math|centers?|meters?|organize\w*|recognize\w*|realize\w*|analyze\w*|neighbor\w*|favorite\w*|gray|practicing)\b/i;

function findJsonFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory()
      ? findJsonFiles(path)
      : name.endsWith('.json')
        ? [path]
        : [];
  });
}

const files = findJsonFiles(root);
const seenIds = new Map<string, string>();
const errors: string[] = [];
let total = 0;

for (const file of files) {
  const label = relative(process.cwd(), file);
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${label}: invalid JSON (${(e as Error).message})`);
    continue;
  }

  const result = questionFileSchema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`${label}: ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
    continue;
  }

  for (const q of result.data) {
    total++;
    const earlier = seenIds.get(q.id);
    if (earlier) errors.push(`${label}: duplicate id ${q.id} (also in ${earlier})`);
    else seenIds.set(q.id, label);

    const text = [q.question, q.explanation, ...q.options].join(' ');
    const us = usPattern.exec(text);
    if (us) errors.push(`${label}: ${q.id}: possible US spelling "${us[0].trim()}"`);
  }
}

if (files.length === 0) errors.push(`No question files found in ${root}`);

if (errors.length > 0) {
  console.error(`Question validation failed (${errors.length} problem(s)):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Validated ${total} question(s) in ${files.length} file(s).`);
