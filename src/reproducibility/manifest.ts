import {
  CORE_VERSION,
  PLATFORM_VERSION,
  SCHEMA_VERSION,
  TAXONOMY_VERSION,
} from "../config/versions";

export const APPLICATION_MANIFEST = {
  product: "Delivered Protection Framework Research Platform",
  release: "0.1.0-rc.2",
  coreVersion: CORE_VERSION,
  platformVersion: PLATFORM_VERSION,
  schemaVersion: SCHEMA_VERSION,
  instrumentVersion: "1.1.0",
  taxonomyVersion: TAXONOMY_VERSION,
  frameworkVersion: "0.1.0-draft",
  buildId: "local-working-tree",
  scenarioSets: {
    reference: {
      ids: ["demo-E1", "demo-E2", "demo-E3", "demo-E4", "demo-E5"],
      primaryAnalysis: true,
    },
    researchExtension: {
      ids: ["ORG-01", "INC-01"],
      primaryAnalysis: false,
      loadPolicy: "explicit-administrator-action",
    },
  },
  scientificBoundary: [
    "No biological-risk calculation",
    "No containment or BSL recommendation",
    "No automatic scientific acceptance or rejection",
    "Research prototype pending validation",
  ],
  storage: "local-browser-only",
  telemetry: false,
} as const;

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value))
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export async function sha256(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalJson(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function makeReproduciblePackage(
  datasets: Record<string, unknown>,
) {
  const hashes = Object.fromEntries(
    await Promise.all(
      Object.entries(datasets).map(async ([name, data]) => [
        name,
        await sha256(data),
      ]),
    ),
  );
  return {
    packageType: "dpf-reproducibility-package",
    generatedAt: new Date().toISOString(),
    hashAlgorithm: "SHA-256",
    manifest: APPLICATION_MANIFEST,
    hashes,
    datasets,
  };
}
