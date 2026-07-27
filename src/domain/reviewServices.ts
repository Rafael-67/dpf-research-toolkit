import type {
  IssueHistoryEntry,
  IssueStatus,
  ReviewIssue,
  SupportingDocument,
} from "./types";

export function createDocumentVersion(
  previous: SupportingDocument,
  version: string,
  uri: string,
  checksum: string,
): SupportingDocument {
  if (version === previous.version)
    throw new Error("A new document version is required.");
  validateDocumentReference(previous.accessMode, uri, checksum);
  return {
    ...previous,
    documentId: crypto.randomUUID(),
    version,
    uri,
    checksum,
    active: true,
    createdAt: new Date().toISOString(),
    supersedesDocumentId: previous.documentId,
  };
}

export function validateDocumentReference(
  accessMode: SupportingDocument["accessMode"],
  uri: string,
  checksum: string,
): void {
  if (accessMode !== "metadata-only" && !uri.trim())
    throw new Error("A URI is required for an available document.");
  if (checksum && !/^sha256:[a-f0-9]{64}$/i.test(checksum))
    throw new Error(
      "Checksum must use sha256 followed by 64 hexadecimal digits.",
    );
}

export function createIssueHistory(issue: ReviewIssue): IssueHistoryEntry {
  return {
    historyId: crypto.randomUUID(),
    issueId: issue.issueId,
    fromStatus: null,
    toStatus: issue.status,
    changedBy: issue.createdBy,
    changedAt: issue.createdAt,
    note: "Issue created.",
  };
}

export function transitionIssue(
  issue: ReviewIssue,
  status: IssueStatus,
  changedBy: string,
  resolution: string | null,
): { issue: ReviewIssue; history: IssueHistoryEntry } {
  const changedAt = new Date().toISOString();
  return {
    issue: {
      ...issue,
      status,
      resolution,
      resolvedAt: status === "resolved" ? changedAt : issue.resolvedAt,
    },
    history: {
      historyId: crypto.randomUUID(),
      issueId: issue.issueId,
      fromStatus: issue.status,
      toStatus: status,
      changedBy,
      changedAt,
      note: resolution ?? "Manual status change.",
    },
  };
}
