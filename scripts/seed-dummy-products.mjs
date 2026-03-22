#!/usr/bin/env node
/**
 * Seeds dummy products via POST /products (requires a valid Bearer JWT).
 *
 * Usage:
 *   BEARER_JWT="<your-jwt>" node scripts/seed-dummy-products.mjs
 *   node scripts/seed-dummy-products.mjs --token="<your-jwt>"
 *
 * Optional:
 *   API_BASE_URL   Base URL (default: http://127.0.0.1:5001)
 *   --base-url=    Override base URL for this run
 */

const DEFAULT_BASE_URL = "http://127.0.0.1:5001";

const DUMMY_PRODUCTS = [
  {
    name: "Wireless Mouse",
    description: "Ergonomic 2.4GHz wireless mouse with long battery life.",
    price: 29.99,
  },
  {
    name: "Mechanical Keyboard",
    description: "Tenkeyless RGB mechanical keyboard, tactile switches.",
    price: 119.5,
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 hub: HDMI, USB-A, SD, microSD, pass-through charging.",
    price: 45.0,
  },
  {
    name: "Laptop Stand",
    description: "Aluminum adjustable stand for 13–17 inch laptops.",
    price: 39.95,
  },
  {
    name: "Webcam HD",
    description: "1080p autofocus webcam with privacy shutter.",
    price: 79.99,
  },
];

function parseArgs(argv) {
  let token = process.env.BEARER_JWT || process.env.JWT_TOKEN;
  let baseUrl = process.env.API_BASE_URL || DEFAULT_BASE_URL;

  for (const arg of argv) {
    if (arg.startsWith("--token=")) {
      token = arg.slice("--token=".length);
    } else if (arg.startsWith("--base-url=")) {
      baseUrl = arg.slice("--base-url=".length);
    }
  }

  return { token, baseUrl: baseUrl.replace(/\/$/, "") };
}

async function createProduct(baseUrl, token, product) {
  const res = await fetch(`${baseUrl}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { ok: res.ok, status: res.status, body };
}

async function main() {
  const { token, baseUrl } = parseArgs(process.argv.slice(2));

  if (!token || !token.trim()) {
    console.error(
      "Missing JWT. Set BEARER_JWT or JWT_TOKEN, or pass --token=<jwt>."
    );
    process.exit(1);
  }

  const bearer = token.trim();

  console.error(`Seeding ${DUMMY_PRODUCTS.length} products → ${baseUrl}/products`);

  let failed = 0;
  for (const product of DUMMY_PRODUCTS) {
    const { ok, status, body } = await createProduct(baseUrl, bearer, product);
    if (ok) {
      console.error(`  OK  ${status}  ${product.name}`);
    } else {
      failed += 1;
      console.error(`  FAIL ${status}  ${product.name}`, body);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
