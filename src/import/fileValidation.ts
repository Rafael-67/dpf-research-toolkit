export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;

const mimeTypes: Record<string, Set<string>> = {
  json: new Set(["application/json", "text/json"]),
  csv: new Set(["text/csv", "application/csv", "application/vnd.ms-excel"]),
  docx: new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
  pdf: new Set(["application/pdf"]),
};

export function validateImportFile(
  file: File,
  allowedExtensions: string[],
): string {
  if (file.size > MAX_IMPORT_BYTES) {
    throw new Error(
      `File is too large. Maximum import size is ${MAX_IMPORT_BYTES / 1024 / 1024} MB.`,
    );
  }
  if (file.size === 0) throw new Error("The selected file is empty.");
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Unsupported file type: .${extension || "unknown"}.`);
  }
  const genericMime =
    file.type === "" || file.type === "application/octet-stream";
  if (!genericMime && !mimeTypes[extension]?.has(file.type.toLowerCase())) {
    throw new Error(
      `File type mismatch: .${extension} does not match ${file.type}.`,
    );
  }
  return extension;
}
