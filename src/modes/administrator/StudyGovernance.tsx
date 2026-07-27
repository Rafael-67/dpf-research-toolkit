import { useState } from "react";
import type {
  AuditAction,
  AuditEvent,
  ConsensusRecord,
  EvaluatorAssignment,
  FieldId,
  FunctionalRole,
  Study,
  UserProfile,
} from "../../domain/types";
import { saveRecord } from "../../storage/localStore";
import { useApp } from "../../state/AppContext";
import { scenariosAssignedToRound } from "../../domain/roundAssignments";

const roles: FunctionalRole[] = [
  "system_administrator",
  "study_coordinator",
  "evaluator",
  "consensus_reviewer",
  "read_only_analyst",
];

export function StudyGovernance({ study }: { study: Study }) {
  const { state, dispatch } = useApp();
  const rounds = state.rounds.filter(
    ({ studyId }) => studyId === study.studyId,
  );
  const sessions = state.sessions.filter(
    ({ studyId }) => studyId === study.studyId,
  );
  const [pseudonym, setPseudonym] = useState("");
  const [role, setRole] = useState<FunctionalRole>("evaluator");
  const [assignmentRound, setAssignmentRound] = useState(
    rounds[0]?.roundId ?? "",
  );
  const [assignmentScenario, setAssignmentScenario] = useState(
    state.scenarios[0]?.scenarioId ?? "",
  );
  const [assignmentProfile, setAssignmentProfile] = useState("");
  const [consensusField, setConsensusField] = useState<FieldId>("F1");
  const [consensusRationale, setConsensusRationale] = useState("");
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");
  const selectedAssignmentRound = rounds.some(
    ({ roundId }) => roundId === assignmentRound,
  )
    ? assignmentRound
    : (rounds[0]?.roundId ?? "");
  const assignmentScenarios = scenariosAssignedToRound(
    state.scenarios,
    state.roundScenarios,
    selectedAssignmentRound,
  );
  const selectedAssignmentScenario = assignmentScenarios.some(
    ({ scenarioId }) => scenarioId === assignmentScenario,
  )
    ? assignmentScenario
    : (assignmentScenarios[0]?.scenarioId ?? "");

  const audit = (
    action: AuditAction,
    entityType: string,
    entityId: string,
    details: AuditEvent["details"] = {},
  ) => {
    const event: AuditEvent = {
      auditEventId: crypto.randomUUID(),
      action,
      entityType,
      entityId,
      actorProfileId: null,
      occurredAt: new Date().toISOString(),
      details,
    };
    saveRecord("audit", event.auditEventId, event);
    dispatch({ type: "audit", value: event });
  };
  const updateStudy = (value: Study, action: AuditAction) => {
    saveRecord("study", value.studyId, value);
    dispatch({ type: "study", value });
    audit(action, "study", value.studyId);
  };

  return (
    <section>
      <h2>Study management and traceability</h2>
      <div className="toolbar">
        <button
          className="secondary"
          onClick={() => {
            const duplicate: Study = {
              ...study,
              studyId: crypto.randomUUID(),
              title: `${study.title} — copy`,
              status: "draft",
              createdAt: new Date().toISOString(),
              duplicatedFromStudyId: study.studyId,
              archivedAt: null,
            };
            saveRecord("study", duplicate.studyId, duplicate);
            dispatch({ type: "study", value: duplicate });
            audit("duplication", "study", duplicate.studyId, {
              sourceStudyId: study.studyId,
            });
          }}
        >
          Duplicate study configuration
        </button>
        <button
          className="secondary"
          disabled={study.status === "archived"}
          onClick={() =>
            updateStudy(
              {
                ...study,
                status: "archived",
                archivedAt: new Date().toISOString(),
              },
              "archive",
            )
          }
        >
          Archive study
        </button>
      </div>
      <details>
        <summary>Study metadata</summary>
        <label>
          Metadata key
          <input
            value={metadataKey}
            onChange={(event) => setMetadataKey(event.target.value)}
          />
        </label>
        <label>
          Metadata value
          <input
            value={metadataValue}
            onChange={(event) => setMetadataValue(event.target.value)}
          />
        </label>
        <button
          disabled={!metadataKey.trim()}
          onClick={() => {
            updateStudy(
              {
                ...study,
                metadata: {
                  ...study.metadata,
                  [metadataKey.trim()]: metadataValue.trim(),
                },
              },
              "editing",
            );
            setMetadataKey("");
            setMetadataValue("");
          }}
        >
          Save metadata
        </button>
        <dl>
          {Object.entries(study.metadata ?? {}).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </details>

      <details>
        <summary>Functional profiles (local; no authentication)</summary>
        <label>
          Pseudonym
          <input
            value={pseudonym}
            onChange={(event) => setPseudonym(event.target.value)}
          />
        </label>
        <label>
          Functional role
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as FunctionalRole)}
          >
            {roles.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <button
          disabled={!pseudonym.trim()}
          onClick={() => {
            const profile: UserProfile = {
              profileId: crypto.randomUUID(),
              pseudonym: pseudonym.trim(),
              role,
              active: true,
              createdAt: new Date().toISOString(),
            };
            saveRecord("profile", profile.profileId, profile);
            dispatch({ type: "profile", value: profile });
            audit("role_change", "profile", profile.profileId, { role });
            setPseudonym("");
          }}
        >
          Add profile
        </button>
        <ul>
          {state.profiles.map((profile) => (
            <li key={profile.profileId}>
              {profile.pseudonym} · {profile.role}
            </li>
          ))}
        </ul>
      </details>

      <details>
        <summary>Evaluator assignments</summary>
        <label>
          Round
          <select
            value={selectedAssignmentRound}
            onChange={(event) => setAssignmentRound(event.target.value)}
          >
            {rounds.map((round) => (
              <option key={round.roundId} value={round.roundId}>
                {round.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Scenario
          <select
            value={selectedAssignmentScenario}
            onChange={(event) => setAssignmentScenario(event.target.value)}
          >
            {assignmentScenarios.map((scenario) => (
              <option key={scenario.scenarioId} value={scenario.scenarioId}>
                {scenario.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Evaluator
          <select
            value={assignmentProfile}
            onChange={(event) => setAssignmentProfile(event.target.value)}
          >
            <option value="">Select</option>
            {state.profiles
              .filter(({ role }) => role === "evaluator")
              .map((profile) => (
                <option key={profile.profileId} value={profile.profileId}>
                  {profile.pseudonym}
                </option>
              ))}
          </select>
        </label>
        <button
          disabled={
            !selectedAssignmentRound ||
            !selectedAssignmentScenario ||
            !assignmentProfile
          }
          onClick={() => {
            const assignment: EvaluatorAssignment = {
              assignmentId: crypto.randomUUID(),
              studyId: study.studyId,
              roundId: selectedAssignmentRound,
              scenarioId: selectedAssignmentScenario,
              evaluatorProfileId: assignmentProfile,
              createdAt: new Date().toISOString(),
              status: "assigned",
            };
            saveRecord("assignment", assignment.assignmentId, assignment);
            dispatch({ type: "assignment", value: assignment });
            audit("editing", "assignment", assignment.assignmentId);
          }}
        >
          Create assignment
        </button>
        <p>
          {
            state.assignments.filter(({ studyId }) => studyId === study.studyId)
              .length
          }{" "}
          assignment(s)
        </p>
      </details>

      <details>
        <summary>Consensus records</summary>
        <p>
          Consensus is a documented human decision. The software does not
          resolve discrepancies automatically.
        </p>
        <label>
          Field
          <select
            value={consensusField}
            onChange={(event) =>
              setConsensusField(event.target.value as FieldId)
            }
          >
            {(["F1", "F2", "F3", "F4", "F5", "F6"] as FieldId[]).map(
              (field) => (
                <option key={field}>{field}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Consensus rationale
          <textarea
            value={consensusRationale}
            onChange={(event) => setConsensusRationale(event.target.value)}
          />
        </label>
        <button
          disabled={!consensusRationale.trim() || sessions.length < 2}
          onClick={() => {
            const first = sessions[0];
            const record: ConsensusRecord = {
              consensusId: crypto.randomUUID(),
              studyId: study.studyId,
              roundId: first.roundId,
              scenarioId: first.scenarioId,
              fieldId: consensusField,
              sourceSessionIds: sessions.map(({ sessionId }) => sessionId),
              reviewerProfileId:
                state.profiles.find(({ role }) => role === "consensus_reviewer")
                  ?.profileId ?? "unassigned-local-reviewer",
              decision: "unresolved",
              rationale: consensusRationale.trim(),
              createdAt: new Date().toISOString(),
              lockedAt: null,
            };
            saveRecord("consensus", record.consensusId, record);
            dispatch({ type: "consensus", value: record });
            audit("consensus_decision", "consensus", record.consensusId);
            setConsensusRationale("");
          }}
        >
          Record unresolved consensus item
        </button>
      </details>

      <details>
        <summary>Audit trail</summary>
        <ul>
          {state.auditEvents
            .filter(
              (event) =>
                event.entityId === study.studyId ||
                event.details.studyId === study.studyId,
            )
            .map((event) => (
              <li key={event.auditEventId}>
                {event.occurredAt} · {event.action} · {event.entityType}
              </li>
            ))}
        </ul>
      </details>
    </section>
  );
}
