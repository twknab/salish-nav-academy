// Turns the single-file build into an Artifact page body: the Artifact host supplies its own
// doctype/html/head/body skeleton, so we keep only the title, styles, root element and script.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const pick = (re) => [...html.matchAll(re)].map((m) => m[0]);
const title = pick(/<title>[\s\S]*?<\/title>/g);
const meta = pick(/<meta name="description"[^>]*>/g);
const styles = pick(/<style[\s\S]*?<\/style>/g);
const scripts = pick(/<script[\s\S]*?<\/script>/g);
if (!title.length || !styles.length || !scripts.length) throw new Error('unexpected build output');
const out = [...title, ...meta, ...styles, '<div id="root"></div>', ...scripts].join('\n');
writeFileSync('dist/artifact.html', out);
console.log(`dist/artifact.html ${(out.length / 1024).toFixed(0)} KB`);
