import { describe, expect, it } from "vitest";
import {
  createDocumentVersion,
  transitionIssue,
} from "../../src/domain/reviewServices";
import type { ReviewIssue, SupportingDocument } from "../../src/domain/types";

describe("Documents and Issues independence", () => {
  it("creates a new document record and preserves the prior version", () => {
    const first = {
      documentId: "D1",
      title: "Protocol",
      documentType: "reference",
      version: "1.0",
      uri: "v1.pdf",
      checksum: `sha256:${"a".repeat(64)}`,
      accessMode: "external",
      scope: "instrument",
      createdAt: "2026-01-01T00:00:00.000Z",
      active: true,
    } as SupportingDocument;
    expect(
      createDocumentVersion(
        first,
        "2.0",
        "v2.pdf",
        `sha256:${"b".repeat(64)}`,
      ),
    ).toMatchObject({ version: "2.0", supersedesDocumentId: "D1" });
    expect(first.version).toBe("1.0");
  });
  it("transitions an Issue without mutating the source", () => {
    const issue = {
      issueId: "I1",
      status: "open",
      resolvedAt: null,
    } as ReviewIssue;
    expect(
      transitionIssue(issue, "resolved", "EV1", "Reviewed").issue.status,
    ).toBe("resolved");
    expect(issue.status).toBe("open");
  });
});
