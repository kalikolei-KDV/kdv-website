#!/usr/bin/env node
// Pushes this repo's content models (customtypes/*/index.json,
// app/slices/*/model.json) to the Prismic repository, replacing what Slice
// Machine's "Push changes" button used to do — there is no Slice Machine
// adapter for React Router, so this is the supported replacement.
//
// Usage:
//   npm run push-models            # push for real
//   npm run push-models -- --dry-run   # preview only, no network calls

import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient, ConflictError } from "@prismicio/custom-types-client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

// dotenv's default only looks for a plain ".env" file — this repo only has
// ".env.local".
loadEnv({ path: path.join(rootDir, ".env.local") });

const sm = JSON.parse(
  fs.readFileSync(path.join(rootDir, "slicemachine.config.json"), "utf8"),
);
const repositoryName = process.env.PRISMIC_ENVIRONMENT || sm.repositoryName;
const token = process.env.PRISMIC_WRITE_TOKEN;

if (!dryRun && !token) {
  console.error(
    "Missing PRISMIC_WRITE_TOKEN in .env.local — required to push models.\n" +
      "(Run with --dry-run to preview without a token.)",
  );
  process.exit(1);
}

const client = dryRun ? null : createClient({ repositoryName, token });

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findModelFiles(dir, fileName) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .map((name) => path.join(dir, name, fileName))
    .filter((p) => fs.existsSync(p));
}

async function pushOne({ kind, model, insert, update }) {
  if (dryRun) {
    console.log(`  would push ${kind}: ${model.id}`);
    return;
  }
  try {
    await insert(model);
    console.log(`  + inserted ${kind}: ${model.id}`);
  } catch (err) {
    if (err instanceof ConflictError) {
      await update(model);
      console.log(`  ~ updated ${kind}: ${model.id}`);
    } else {
      throw new Error(`Failed to push ${kind} "${model.id}": ${err.message}`, {
        cause: err,
      });
    }
  }
}

async function main() {
  console.log(
    `${dryRun ? "[dry run] " : ""}Pushing content models to Prismic repo "${repositoryName}"...`,
  );

  // Slices first — custom types reference them by id, so they must exist first.
  console.log("Shared slices:");
  const sliceFiles = findModelFiles(
    path.join(rootDir, "app", "slices"),
    "model.json",
  );
  for (const filePath of sliceFiles) {
    const model = readJSON(filePath);
    await pushOne({
      kind: "slice",
      model,
      insert: (m) => client.insertSharedSlice(m),
      update: (m) => client.updateSharedSlice(m),
    });
  }

  console.log("Custom types:");
  const customTypeFiles = findModelFiles(
    path.join(rootDir, "customtypes"),
    "index.json",
  );
  for (const filePath of customTypeFiles) {
    const model = readJSON(filePath);
    await pushOne({
      kind: "custom type",
      model,
      insert: (m) => client.insertCustomType(m),
      update: (m) => client.updateCustomType(m),
    });
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
