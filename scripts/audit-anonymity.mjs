import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "test-results",
  "playwright-report",
]);
const textExtensions = new Set([
  ".md",
  ".txt",
  ".json",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".yml",
  ".yaml",
  ".html",
  ".css",
  ".cff",
]);
const findings = [];
const rules = [
  {
    label: "local user path",
    expression: /[A-Za-z]:[\\/]Users[\\/][^\\/\s]+/gi,
  },
  {
    label: "private key",
    expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    label: "probable access token",
    expression: /\b(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{16,}\b/g,
  },
  {
    label: "email address",
    expression: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
];

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
      continue;
    }
    if (!textExtensions.has(extname(entry.name).toLowerCase())) continue;
    const text = await readFile(path, "utf8");
    for (const rule of rules) {
      for (const match of text.matchAll(rule.expression)) {
        const value = match[0];
        if (
          rule.label === "email address" &&
          /@(example\.(?:com|org)|local\.invalid)$/i.test(value)
        )
          continue;
        const line = text.slice(0, match.index).split(/\r?\n/).length;
        findings.push(
          `${relative(root, path)}:${line} — ${rule.label}: ${value}`,
        );
      }
    }
  }
}

await visit(root);
if (findings.length) {
  process.stderr.write(
    `Anonymous-review audit found ${findings.length} item(s):\n${findings.join("\n")}\n`,
  );
  process.exitCode = 1;
} else {
  process.stdout.write(
    "Anonymous-review text audit passed. Manual metadata and Git-history review is still required.\n",
  );
}
