#!/usr/bin/env bun
import { readFile, writeFile, mkdir, stat } from "fs/promises";
import { join } from "path";

const ROOT = process.cwd();
const METHODS_PATH = join(ROOT, "all-methods.json");
const OUTPUT_ROOT = join(ROOT, "collections");
const BASE_URL = "https://eth-mainnet.g.alchemy.com/v2/{{api_key}}";

// Load JSON mapping
let methods: Record<string, { params: any; description: string }> = {};
try {
  const raw = await readFile(METHODS_PATH, "utf8");
  methods = JSON.parse(raw);
} catch (err) {
  console.error("Could not read all-methods.json:", err);
  process.exit(1);
}

// Helpers
async function ensureDir(dir: string) {
  try {
    const s = await stat(dir);
    if (!s.isDirectory()) throw new Error();
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

function groupFor(method: string): string {
  if (method.startsWith("eth_")) return "eth";
  if (method.startsWith("debug_")) return "debug";
  if (method.startsWith("trace_")) return "trace";
  if (method.startsWith("alchemy_")) return "alchemy";
  return "misc";
}

function collectionName(group: string): string {
  switch (group) {
    case "eth": return "Ethereum Core RPC";
    case "debug": return "Debug Tracing API";
    case "trace": return "Transaction Trace API";
    case "alchemy": return "Alchemy Enhanced APIs";
    default: return "Miscellaneous RPCs";
  }
}

function collectionDocs(group: string): string {
  switch (group) {
    case "eth": return "Core Ethereum JSON-RPC methods.";
    case "debug": return "Debug and tracing methods for Geth/Erigon clients.";
    case "trace": return "Execution tracing API for transactions and blocks.";
    case "alchemy": return "Alchemy-specific API extensions, including Gas Manager and AA helpers.";
    default: return "Miscellaneous RPC endpoints.";
  }
}

function bruTemplate(method: string, params: any, description: string): string {
  const jsonBody = JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }, null, 2);
  return `meta {
  name: ${method}
  type: http
}

post {
  url: ${BASE_URL}
  body: json
  auth: inherit
}

body:json {
${jsonBody.split("\n").map(l => "  " + l).join("\n")}
}

settings {
  encodeUrl: true
}

docs {
${description.trim().split("\n").map(l => "  " + l).join("\n")}
}
`;
}

function collectionTemplate(group: string): string {
  return `meta {
  name: ${collectionName(group)}
  type: collection
  version: 1
}

settings {
  baseUrl: ${BASE_URL}
  auth: inherit
}

env {
  api_key:
}

docs {
  ${collectionDocs(group)}
}
`;
}

function brunoJsonTemplate(group: string): string {
  return JSON.stringify(
    {
      version: "1",
      name: collectionName(group),
      type: "collection",
      ignore: ["node_modules", ".git"]
    },
    null,
    2
  );
}

// Generate files
for (const [method, { params, description }] of Object.entries(methods)) {
  const group = groupFor(method);
  const dir = join(OUTPUT_ROOT, group);
  await ensureDir(dir);

  // Ensure collection.bru exists
  const collPath = join(dir, "collection.bru");
  try {
    await stat(collPath);
  } catch {
    const collContent = collectionTemplate(group);
    await writeFile(collPath, collContent, "utf8");
    console.log(`Created collection.bru for ${group}`);
  }

  // Ensure bruno.json exists
  const brunoPath = join(dir, "bruno.json");
  try {
    await stat(brunoPath);
  } catch {
    const brunoJson = brunoJsonTemplate(group);
    await writeFile(brunoPath, brunoJson, "utf8");
    console.log(`Created bruno.json for ${group}`);
  }

  // Write request file
  const filePath = join(dir, `${method}.bru`);
  const content = bruTemplate(method, params, description || "No description.");
  await writeFile(filePath, content, "utf8");
  console.log(`Wrote ${filePath}`);
}

console.log("\nAll .bru files, collection.bru, and bruno.json generated.");