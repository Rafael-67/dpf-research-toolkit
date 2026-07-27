import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type {
  AuditEvent,
  ConsensusRecord,
  EvaluatorAssignment,
  EvaluationSession,
  Institution,
  SupportingDocument,
  DocumentLink,
  ReviewIssue,
  IssueHistoryEntry,
  Round,
  RoundScenario,
  Scenario,
  Study,
  UserProfile,
} from "../domain/types";
import { normalizeEvaluationSession } from "../domain/sessionCompatibility";
import { abandonStaleSession } from "../domain/sessionLifecycle";
import {
  demoRound,
  demoRoundScenarios,
  demoScenarios,
  builtInScenarios,
  researchExtensionRound,
  researchExtensionRoundScenarios,
  researchExtensionScenarios,
  researchExtensionStudy,
  demoStudy,
} from "../framework/demo";
import {
  deleteRecord,
  deleteStudyRecords,
  listRecords,
  PREFIX,
  saveRecord,
} from "../storage/localStore";

interface State {
  studies: Study[];
  rounds: Round[];
  roundScenarios: RoundScenario[];
  scenarios: Scenario[];
  sessions: EvaluationSession[];
  profiles: UserProfile[];
  assignments: EvaluatorAssignment[];
  consensusRecords: ConsensusRecord[];
  auditEvents: AuditEvent[];
  institutions: Institution[];
  documents: SupportingDocument[];
  documentLinks: DocumentLink[];
  issues: ReviewIssue[];
  issueHistory: IssueHistoryEntry[];
}
type Action =
  | { type: "study"; value: Study }
  | { type: "round"; value: Round }
  | { type: "roundScenario"; value: RoundScenario }
  | { type: "scenario"; value: Scenario }
  | { type: "session"; value: EvaluationSession }
  | { type: "profile"; value: UserProfile }
  | { type: "assignment"; value: EvaluatorAssignment }
  | { type: "consensus"; value: ConsensusRecord }
  | { type: "audit"; value: AuditEvent }
  | { type: "institution"; value: Institution }
  | { type: "document"; value: SupportingDocument }
  | { type: "documentLink"; value: DocumentLink }
  | { type: "issue"; value: ReviewIssue }
  | { type: "issueHistory"; value: IssueHistoryEntry }
  | { type: "deleteStudy"; studyId: string };
const initial: State = {
  studies: [],
  rounds: [],
  roundScenarios: [],
  scenarios: [],
  sessions: [],
  profiles: [],
  assignments: [],
  consensusRecords: [],
  auditEvents: [],
  institutions: [],
  documents: [],
  documentLinks: [],
  issues: [],
  issueHistory: [],
};
const ALIGNED_DEMO_MIGRATION = `${PREFIX}migration:aligned-demo-e1-e5`;

function normalizeStudy(study: Study): Study {
  return {
    ...study,
    config: {
      ...study.config,
      instrumentVersion: "1.1.0",
    },
  };
}

function normalizeRound(round: Round): Round {
  return {
    ...round,
    instrumentVersion: "1.1.0",
  };
}

function migrateToAlignedDemoCases(): void {
  if (localStorage.getItem(ALIGNED_DEMO_MIGRATION)) return;
  const legacyStudyIds = new Set(["demo-study"]);
  const legacyRoundIds = new Set(["demo-round-1"]);
  const legacyScenarioIds = new Set([
    "demo-1",
    "demo-2",
    "demo-3",
    "demo-4",
    "demo-5",
  ]);
  listRecords<Study>("study").forEach(({ studyId }) => {
    if (legacyStudyIds.has(studyId)) deleteRecord("study", studyId);
  });
  listRecords<Round>("round").forEach(({ roundId }) => {
    if (legacyRoundIds.has(roundId)) deleteRecord("round", roundId);
  });
  listRecords<Scenario>("scenario").forEach(
    ({ scenarioId, scenarioVersion }) => {
      if (legacyScenarioIds.has(scenarioId)) {
        deleteRecord("scenario", `${scenarioId}:${scenarioVersion}`);
      }
    },
  );
  localStorage.setItem(ALIGNED_DEMO_MIGRATION, "1");
}

function upsert<T>(items: T[], value: T, key: keyof T): T[] {
  return [...items.filter((item) => item[key] !== value[key]), value];
}
function reducer(state: State, action: Action): State {
  if (action.type === "deleteStudy") {
    const roundIds = new Set(
      state.rounds
        .filter((round) => round.studyId === action.studyId)
        .map(({ roundId }) => roundId),
    );
    return {
      ...state,
      studies: state.studies.filter(
        (study) => study.studyId !== action.studyId,
      ),
      rounds: state.rounds.filter((round) => !roundIds.has(round.roundId)),
      roundScenarios: state.roundScenarios.filter(
        (assignment) => !roundIds.has(assignment.roundId),
      ),
      sessions: state.sessions.filter(
        (session) => session.studyId !== action.studyId,
      ),
      assignments: state.assignments.filter(
        (assignment) => assignment.studyId !== action.studyId,
      ),
      consensusRecords: state.consensusRecords.filter(
        (record) => record.studyId !== action.studyId,
      ),
    };
  }
  if (action.type === "study")
    return {
      ...state,
      studies: upsert(state.studies, action.value, "studyId"),
    };
  if (action.type === "round")
    return { ...state, rounds: upsert(state.rounds, action.value, "roundId") };
  if (action.type === "roundScenario")
    return {
      ...state,
      roundScenarios: [
        ...state.roundScenarios.filter(
          (value) =>
            value.roundId !== action.value.roundId ||
            value.scenarioId !== action.value.scenarioId,
        ),
        action.value,
      ],
    };
  if (action.type === "scenario")
    return {
      ...state,
      scenarios: upsert(state.scenarios, action.value, "scenarioId"),
    };
  if (action.type === "profile")
    return {
      ...state,
      profiles: upsert(state.profiles, action.value, "profileId"),
    };
  if (action.type === "assignment")
    return {
      ...state,
      assignments: upsert(state.assignments, action.value, "assignmentId"),
    };
  if (action.type === "consensus")
    return {
      ...state,
      consensusRecords: upsert(
        state.consensusRecords,
        action.value,
        "consensusId",
      ),
    };
  if (action.type === "audit")
    return {
      ...state,
      auditEvents: upsert(state.auditEvents, action.value, "auditEventId"),
    };
  if (action.type === "institution")
    return {
      ...state,
      institutions: upsert(state.institutions, action.value, "institutionId"),
    };
  if (action.type === "document")
    return {
      ...state,
      documents: upsert(state.documents, action.value, "documentId"),
    };
  if (action.type === "documentLink")
    return {
      ...state,
      documentLinks: upsert(
        state.documentLinks,
        action.value,
        "documentLinkId",
      ),
    };
  if (action.type === "issue")
    return {
      ...state,
      issues: upsert(state.issues, action.value, "issueId"),
    };
  if (action.type === "issueHistory")
    return {
      ...state,
      issueHistory: upsert(state.issueHistory, action.value, "historyId"),
    };
  return {
    ...state,
    sessions: upsert(state.sessions, action.value, "sessionId"),
  };
}

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  deleteStudy: (studyId: string) => void;
  loadResearchExtension: () => void;
} | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial, () => {
    migrateToAlignedDemoCases();
    const studies = listRecords<Study>("study").map(normalizeStudy);
    const scenarios = listRecords<Scenario>("scenario").map((scenario) => {
      const canonical = [...demoScenarios, ...researchExtensionScenarios].find(
        ({ scenarioId, scenarioVersion }) =>
          scenarioId === scenario.scenarioId &&
          scenarioVersion === scenario.scenarioVersion,
      );
      if (canonical && JSON.stringify(canonical) !== JSON.stringify(scenario))
        saveRecord(
          "scenario",
          `${canonical.scenarioId}:${canonical.scenarioVersion}`,
          canonical,
        );
      return canonical ?? scenario;
    });
    return {
      studies,
      rounds: listRecords<Round>("round").map(normalizeRound),
      roundScenarios: listRecords<RoundScenario>("roundScenario"),
      scenarios,
      sessions: listRecords<EvaluationSession>("evaluation").map((session) => {
        const normalized = normalizeEvaluationSession(session);
        const migrated = abandonStaleSession(normalized);
        if (!session.instrumentVersion || migrated !== normalized)
          saveRecord("evaluation", migrated.sessionId, migrated);
        return migrated;
      }),
      profiles: listRecords<UserProfile>("profile"),
      assignments: listRecords<EvaluatorAssignment>("assignment"),
      consensusRecords: listRecords<ConsensusRecord>("consensus"),
      auditEvents: listRecords<AuditEvent>("audit"),
      institutions: listRecords<Institution>("institution"),
      documents: listRecords<SupportingDocument>("document"),
      documentLinks: listRecords<DocumentLink>("documentLink"),
      issues: listRecords<ReviewIssue>("issue"),
      issueHistory: listRecords<IssueHistoryEntry>("issueHistory"),
    };
  });
  useEffect(() => {
    if (!state.studies.some(({ studyId }) => studyId === demoStudy.studyId)) {
      saveRecord("study", demoStudy.studyId, demoStudy);
      dispatch({ type: "study", value: demoStudy });
    }
    if (!state.rounds.some(({ roundId }) => roundId === demoRound.roundId)) {
      saveRecord("round", demoRound.roundId, demoRound);
      dispatch({ type: "round", value: demoRound });
    }
    builtInScenarios.forEach((scenario) => {
      if (
        !state.scenarios.some(
          ({ scenarioId, scenarioVersion }) =>
            scenarioId === scenario.scenarioId &&
            scenarioVersion === scenario.scenarioVersion,
        )
      ) {
        saveRecord(
          "scenario",
          `${scenario.scenarioId}:${scenario.scenarioVersion}`,
          scenario,
        );
        dispatch({ type: "scenario", value: scenario });
      }
    });
    demoRoundScenarios.forEach((assignment) => {
      if (
        !state.roundScenarios.some(
          (value) =>
            value.roundId === assignment.roundId &&
            value.scenarioId === assignment.scenarioId,
        )
      ) {
        saveRecord(
          "roundScenario",
          `${assignment.roundId}:${assignment.scenarioId}`,
          assignment,
        );
        dispatch({ type: "roundScenario", value: assignment });
      }
    });
  }, [state.roundScenarios, state.rounds, state.scenarios, state.studies]);
  const loadResearchExtension = () => {
    saveRecord("study", researchExtensionStudy.studyId, researchExtensionStudy);
    dispatch({ type: "study", value: researchExtensionStudy });
    saveRecord("round", researchExtensionRound.roundId, researchExtensionRound);
    dispatch({ type: "round", value: researchExtensionRound });
    researchExtensionScenarios.forEach((scenario) => {
      saveRecord(
        "scenario",
        `${scenario.scenarioId}:${scenario.scenarioVersion}`,
        scenario,
      );
      dispatch({ type: "scenario", value: scenario });
    });
    researchExtensionRoundScenarios.forEach((assignment) => {
      saveRecord(
        "roundScenario",
        `${assignment.roundId}:${assignment.scenarioId}`,
        assignment,
      );
      dispatch({ type: "roundScenario", value: assignment });
    });
  };
  const deleteStudy = (studyId: string) => {
    if (studyId === demoStudy.studyId)
      throw new Error("The demonstration study cannot be deleted.");
    deleteStudyRecords(studyId);
    dispatch({ type: "deleteStudy", studyId });
  };
  return (
    <AppContext.Provider
      value={{ state, dispatch, deleteStudy, loadResearchExtension }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("AppProvider missing");
  return value;
}
