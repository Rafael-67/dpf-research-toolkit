import type { AuditAction, AuditEvent } from "./types";

export function makeAuditEvent(
  action: AuditAction,
  entityType: string,
  entityId: string,
  details: AuditEvent["details"] = {},
  actorProfileId: string | null = null,
): AuditEvent {
  return {
    auditEventId: crypto.randomUUID(),
    action,
    entityType,
    entityId,
    actorProfileId,
    occurredAt: new Date().toISOString(),
    details,
  };
}
