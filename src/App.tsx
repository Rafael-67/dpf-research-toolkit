import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { RoundAgreementSummary } from "./modes/administrator/RoundAgreementSummary";
import { ChangeLogEntryForm } from "./modes/administrator/ChangeLogEntryForm";
import { MergeImport } from "./modes/admin/merge/MergeImport";
import { RoundDetail } from "./modes/administrator/RoundDetail";
import { RoundForm } from "./modes/administrator/RoundForm";
import { ScenarioForm } from "./modes/administrator/ScenarioForm";
import { StudyDetail } from "./modes/administrator/StudyDetail";
import { StudyForm } from "./modes/administrator/StudyForm";
import { StudyList } from "./modes/administrator/StudyList";
import { EvaluationFlow } from "./modes/evaluator/EvaluationFlow";
import { PseudonymEntry } from "./modes/evaluator/PseudonymEntry";
import { StudyImport } from "./modes/evaluator/StudyImport";
import { DeleteAllData } from "./shared/DeleteAllData";
import { PrototypeBanner } from "./shared/PrototypeBanner";
import { AppProvider } from "./state/AppContext";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { LanguageSelector } from "./i18n/LanguageSelector";
import { ScientificDashboard } from "./modes/ScientificDashboard";
import { SupportingDocuments } from "./modes/SupportingDocuments";
import { IssueTracking } from "./modes/IssueTracking";
import { InstitutionRegistry } from "./modes/InstitutionRegistry";
import {
  CORE_VERSION,
  PLATFORM_VERSION,
  SCHEMA_VERSION,
} from "./config/versions";
import { AboutManifest } from "./modes/AboutManifest";

function Landing() {
  const { t } = useLanguage();
  return (
    <main className="landing">
      <p className="eyebrow">Delivered Protection Framework</p>
      <h1>{t("Phase 0 research toolkit")}</h1>
      <p className="lead">
        {t(
          "Collect structured expert feedback on a fictional six-field research framework. This tool does not assess biological risk or recommend laboratory decisions.",
        )}
      </p>
      <div className="mode-grid">
        <Link className="mode-card" to="/admin">
          <span>{t("Configure")}</span>
          <h2>{t("Study administrator")}</h2>
          <p>{t("Create studies, rounds, and fictional scenarios.")}</p>
        </Link>
        <Link className="mode-card" to="/evaluator">
          <span>{t("Evaluate")}</span>
          <h2>{t("Expert evaluator")}</h2>
          <p>{t("Review six framework fields one at a time.")}</p>
        </Link>
      </div>
    </main>
  );
}
function NotFound() {
  const { t } = useLanguage();
  return (
    <main>
      <h1>{t("Page not found")}</h1>
      <Link to="/">{t("Return home")}</Link>
    </main>
  );
}
function AppContent() {
  const { t } = useLanguage();
  return (
    <HashRouter>
      <AppProvider>
        <PrototypeBanner />
        <header className="site-header">
          <Link className="brand" to="/">
            DPF-RP <small>Platform {PLATFORM_VERSION}</small>
          </Link>
          <nav aria-label={t("Main navigation")}>
            <Link to="/admin">{t("Administrator")}</Link>
            <Link to="/evaluator">{t("Evaluator")}</Link>
            <Link to="/scientific-dashboard">{t("Scientific Dashboard")}</Link>
            <Link to="/institutions">{t("Institutions")}</Link>
            <Link to="/documents">{t("Documents")}</Link>
            <Link to="/issues">{t("Issues")}</Link>
            <Link to="/about">{t("About / Manifest")}</Link>
            <LanguageSelector />
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<StudyList />} />
          <Route
            path="/admin/import"
            element={<StudyImport mode="administrator" />}
          />
          <Route path="/admin/merge" element={<MergeImport />} />
          <Route path="/admin/study/new" element={<StudyForm />} />
          <Route path="/admin/study/:studyId" element={<StudyDetail />} />
          <Route
            path="/admin/study/:studyId/round/new"
            element={<RoundForm />}
          />
          <Route
            path="/admin/study/:studyId/round/:roundId"
            element={<RoundDetail />}
          />
          <Route
            path="/admin/study/:studyId/round/:roundId/summary"
            element={<RoundAgreementSummary />}
          />
          <Route
            path="/admin/study/:studyId/scenario/new"
            element={<ScenarioForm />}
          />
          <Route
            path="/admin/study/:studyId/changelog/new"
            element={<ChangeLogEntryForm />}
          />
          <Route path="/evaluator" element={<PseudonymEntry />} />
          <Route
            path="/scientific-dashboard"
            element={<ScientificDashboard />}
          />
          <Route path="/documents" element={<SupportingDocuments />} />
          <Route path="/institutions" element={<InstitutionRegistry />} />
          <Route path="/issues" element={<IssueTracking />} />
          <Route path="/about" element={<AboutManifest />} />
          <Route path="/evaluator/import" element={<StudyImport />} />
          <Route
            path="/evaluator/session/:scenarioId"
            element={<EvaluationFlow />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer>
          <p>
            DPF-RP · Core {CORE_VERSION} · Platform {PLATFORM_VERSION} · Schema{" "}
            {SCHEMA_VERSION} · {t("Fictional/demo data only")}
          </p>
          <DeleteAllData />
        </footer>
      </AppProvider>
    </HashRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
