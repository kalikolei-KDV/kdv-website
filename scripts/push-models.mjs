#!/usr/bin/env node
// Pushes this repo's content models (customtypes/*/index.json,
// app/slices/*/model.json) to the Prismic repository, replacing what Slice
// Machine's "Push changes" button used to do — there is no Slice Machine
// adapter for React Router, so this is the supported replacement.
//
// Usage:
//   npm run push-models                 # preview, then confirm before pushing
//   npm run push-models -- --dry-run    # preview only, no network calls, no confirmation needed
//   npm run push-models -- --yes        # skip the confirmation prompt (non-interactive use)

import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import {
  createClient,
  ConflictError,
  NotFoundError,
} from "@prismicio/custom-types-client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");
const skipConfirmation = dryRun || process.argv.includes("--yes");

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

// Determines insert-vs-update ahead of time (rather than trying insert and
// falling back to update on ConflictError) so the full plan can be printed
// and confirmed *before* any write happens.
async function planOne({ kind, model, getByID }) {
  if (dryRun) return { kind, model, action: "insert-or-update" };

  try {
    await getByID(model.id);
    return { kind, model, action: "update" };
  } catch (err) {
    if (err instanceof NotFoundError) {
      return { kind, model, action: "insert" };
    }
    throw new Error(`Failed to check ${kind} "${model.id}": ${err.message}`, {
      cause: err,
    });
  }
}

async function applyOne({ kind, model, action, insert, update }) {
  if (dryRun) {
    console.log(`  would push ${kind}: ${model.id}`);
    return;
  }
  try {
    if (action === "insert") {
      await insert(model);
      console.log(`  + inserted ${kind}: ${model.id}`);
    } else {
      await update(model);
      console.log(`  ~ updated ${kind}: ${model.id}`);
    }
  } catch (err) {
    // The plan can go stale between planOne() and here (e.g. a concurrent
    // push) — a race is the only realistic way an "insert" ends up
    // conflicting, so fall back to update rather than failing the whole run.
    if (action === "insert" && err instanceof ConflictError) {
      await update(model);
      console.log(`  ~ updated ${kind}: ${model.id}`);
    } else {
      throw new Error(`Failed to push ${kind} "${model.id}": ${err.message}`, {
        cause: err,
      });
    }
  }
}

async function confirm(plan) {
  if (skipConfirmation) return true;

  console.log('\nAbout to push to Prismic repo "' + repositoryName + '":');
  for (const { kind, model, action } of plan) {
    const marker = action === "insert" ? "+" : "~";
    console.log(`  ${marker} ${action} ${kind}: ${model.id}`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question('\nType "yes" to continue: ');
  rl.close();
  return answer.trim().toLowerCase() === "yes";
}

async function main() {
  const sliceFiles = findModelFiles(
    path.join(rootDir, "app", "slices"),
    "model.json",
  );
  const slicePlans = [];
  for (const filePath of sliceFiles) {
    slicePlans.push(
      await planOne({
        kind: "slice",
        model: readJSON(filePath),
        getByID: (id) => client.getSharedSliceByID(id),
      }),
    );
  }

  const customTypeFiles = findModelFiles(
    path.join(rootDir, "customtypes"),
    "index.json",
  );
  const customTypePlans = [];
  for (const filePath of customTypeFiles) {
    customTypePlans.push(
      await planOne({
        kind: "custom type",
        model: readJSON(filePath),
        getByID: (id) => client.getCustomTypeByID(id),
      }),
    );
  }

  const proceed = await confirm([...slicePlans, ...customTypePlans]);
  if (!proceed) {
    console.log("Aborted — nothing was pushed.");
    return;
  }

  console.log(
    `\n${dryRun ? "[dry run] " : ""}Pushing content models to Prismic repo "${repositoryName}"...`,
  );

  // Slices first — custom types reference them by id, so they must exist first.
  console.log("Shared slices:");
  for (const plan of slicePlans) {
    await applyOne({
      ...plan,
      insert: (m) => client.insertSharedSlice(m),
      update: (m) => client.updateSharedSlice(m),
    });
  }

  console.log("Custom types:");
  for (const plan of customTypePlans) {
    await applyOne({
      ...plan,
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
