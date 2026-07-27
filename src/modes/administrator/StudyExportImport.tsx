import type {
  AuditEvent,
  ConsensusRecord,
  EvaluatorAssignment,
  FrameworkChangeLogEntry,
  Round,
  RoundScenario,
  Scenario,
  Study,
  UserProfile,
} from "../../domain/types";
import { downloadJson, makeEnvelope } from "../../storage/exportImport";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { makeAuditEvent } from "../../domain/audit";
import { saveRecord } from "../../storage/localStore";

export interface StudyConfigEntities {
  studies: Study[];
  rounds: Round[];
  roundScenarios: RoundScenario[];
  scenarios: Scenario[];
  changelog: FrameworkChangeLogEntry[];
  profiles: UserProfile[];
  assignments: EvaluatorAssignment[];
  consensusRecords: ConsensusRecord[];
  auditEvents: AuditEvent[];
}

export function StudyExportImport({ studyId }: { studyId: string }) {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();
  const exportStudy = () => {
    const entities: StudyConfigEntities = {
      studies: state.studies.filter((study) => study.studyId === studyId),
      rounds: state.rounds.filter((round) => round.studyId === studyId),
      roundScenarios: state.roundScenarios.filter((assignment) =>
        state.rounds.some(
          (round) =>
            round.studyId === studyId && round.roundId === assignment.roundId,
        ),
      ),
      scenarios: state.scenarios.filter((scenario) =>
        state.roundScenarios.some(
          (assignment) =>
            assignment.scenarioId === scenario.scenarioId &&
            state.rounds.some(
              (round) =>
                round.studyId === studyId &&
                round.roundId === assignment.roundId,
            ),
        ),
      ),
      changelog: [],
      profiles: state.profiles,
      assignments: state.assignments.filter(
        (assignment) => assignment.studyId === studyId,
      ),
      consensusRecords: state.consensusRecords.filter(
        (record) => record.studyId === studyId,
      ),
      auditEvents: state.auditEvents.filter(
        (event) =>
          event.entityId === studyId || event.details.studyId === studyId,
      ),
    };
    downloadJson("study-config.json", makeEnvelope("study-config", entities));
    const audit = makeAuditEvent("export", "study", studyId);
    saveRecord("audit", audit.auditEventId, audit);
    dispatch({ type: "audit", value: audit });
  };
  return (
    <section className="card">
      <h2>{t("Study distribution")}</h2>
      <p>
        {t(
          "Export this study for the confirmed, human-mediated distribution channel.",
        )}
      </p>
      <button onClick={exportStudy}>{t("Export study-config.json")}</button>
    </section>
  );
}
