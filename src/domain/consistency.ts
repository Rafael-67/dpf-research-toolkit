import type { StoredObservation } from "./types";

export interface ConsistencyFinding {
  code: string;
  path: string;
  message: "Please review this combination.";
}

export function checkObservationConsistency(
  observation: StoredObservation,
): ConsistencyFinding[] {
  if (!("observationId" in observation)) return [];
  const findings: ConsistencyFinding[] = [];
  const add = (code: string, path: string) =>
    findings.push({
      code,
      path,
      message: "Please review this combination.",
    });
  if (!observation.evidenceSources.length)
    add("missing_evidence", "evidenceSources");
  if (!observation.reasoningSummary.trim())
    add("missing_reasoning", "reasoningSummary");
  const allSelections = Object.entries(observation).flatMap(([key, value]) => {
    if (Array.isArray(value))
      return value
        .filter(
          (item): item is { value: string; otherText?: string } =>
            !!item && typeof item === "object" && "value" in item,
        )
        .map((item) => ({ key, ...item }));
    if (value && typeof value === "object" && "value" in value)
      return [{ key, ...(value as { value: string; otherText?: string }) }];
    return [];
  });
  allSelections.forEach(({ key, value, otherText }) => {
    if ((value === "other" || value.startsWith("other_")) && !otherText?.trim())
      add("other_without_text", `${key}.otherText`);
  });
  if (
    allSelections.some(({ value }) => value === "not_applicable") &&
    allSelections.some(
      ({ value }) =>
        !["not_applicable", "not_observed", "not_determinable"].includes(value),
    )
  )
    add("not_applicable_with_substantive_selection", "selections");
  return findings;
}
