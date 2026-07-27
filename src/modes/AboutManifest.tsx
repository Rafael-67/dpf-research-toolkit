import {
  APPLICATION_MANIFEST,
  makeReproduciblePackage,
} from "../reproducibility/manifest";
import { downloadJson } from "../storage/exportImport";
import { useApp } from "../state/AppContext";
import { useLanguage } from "../i18n/LanguageContext";
import {
  isSimulatedEvaluation,
  simulatedEvaluationIds,
} from "../framework/simulatedEvaluations";
import { createStoredZip } from "../reproducibility/zip";
import { BackupRestore } from "./BackupRestore";

export function AboutManifest() {
  const { state } = useApp();
  const { language } = useLanguage();
  const es = language === "es";
  const exportPackage = async () => {
    const scientificSessions = state.sessions.filter(
      ({ sessionId }) => !isSimulatedEvaluation(sessionId),
    );
    const datasets = {
      studies: state.studies,
      rounds: state.rounds,
      roundScenarios: state.roundScenarios,
      scenarios: state.scenarios,
      evaluationSessions: scientificSessions,
      institutions: state.institutions,
      evaluatorProfiles: state.profiles,
      evaluatorAssignments: state.assignments,
      consensusRecords: state.consensusRecords,
      auditEvents: state.auditEvents,
      documents: state.documents,
      documentLinks: state.documentLinks,
      issues: state.issues,
      issueHistory: state.issueHistory,
      simulatedEvaluationIds: simulatedEvaluationIds(),
    };
    const bundle = await makeReproduciblePackage(datasets);
    const blob = createStoredZip({
      "manifest.json": JSON.stringify(bundle.manifest, null, 2),
      "hashes.json": JSON.stringify(bundle.hashes, null, 2),
      "datasets.json": JSON.stringify(bundle.datasets, null, 2),
      "package-metadata.json": JSON.stringify(
        {
          packageType: bundle.packageType,
          generatedAt: bundle.generatedAt,
          hashAlgorithm: bundle.hashAlgorithm,
        },
        null,
        2,
      ),
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dpf-reproducibility-package.zip";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <main>
      <p className="eyebrow">DPF-RP</p>
      <h1>{es ? "Acerca de / Manifiesto" : "About / Manifest"}</h1>
      <p>
        {es
          ? "Registro consultable de las versiones, conjuntos y límites científicos implementados por esta compilación."
          : "Inspectable record of the versions, sets and scientific boundaries implemented by this build."}
      </p>
      <dl className="manifest-grid">
        <div>
          <dt>Release</dt>
          <dd>{APPLICATION_MANIFEST.release}</dd>
        </div>
        <div>
          <dt>Core</dt>
          <dd>{APPLICATION_MANIFEST.coreVersion}</dd>
        </div>
        <div>
          <dt>Platform</dt>
          <dd>{APPLICATION_MANIFEST.platformVersion}</dd>
        </div>
        <div>
          <dt>Schema</dt>
          <dd>{APPLICATION_MANIFEST.schemaVersion}</dd>
        </div>
        <div>
          <dt>Instrument</dt>
          <dd>{APPLICATION_MANIFEST.instrumentVersion}</dd>
        </div>
        <div>
          <dt>Taxonomy</dt>
          <dd>{APPLICATION_MANIFEST.taxonomyVersion}</dd>
        </div>
        <div>
          <dt>Framework</dt>
          <dd>{APPLICATION_MANIFEST.frameworkVersion}</dd>
        </div>
        <div>
          <dt>Build</dt>
          <dd>{APPLICATION_MANIFEST.buildId}</dd>
        </div>
      </dl>
      <section>
        <h2>{es ? "Conjuntos de escenarios" : "Scenario sets"}</h2>
        <p>
          <strong>{es ? "Referencia" : "Reference"}:</strong> E1–E5 (
          {es ? "análisis primario" : "primary analysis"}).
        </p>
        <p>
          <strong>
            {es ? "Extensión exploratoria" : "Research extension"}:
          </strong>{" "}
          ORG-01, INC-01 (
          {es
            ? "carga explícita y análisis separado"
            : "explicit load and separate analysis"}
          ).
        </p>
      </section>
      <section>
        <h2>{es ? "Límites científicos" : "Scientific boundaries"}</h2>
        <ul>
          {APPLICATION_MANIFEST.scientificBoundary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <div className="toolbar">
        <button
          onClick={() =>
            downloadJson("dpf-application-manifest.json", APPLICATION_MANIFEST)
          }
        >
          {es ? "Descargar manifiesto" : "Download manifest"}
        </button>
        <button className="secondary" onClick={() => void exportPackage()}>
          {es
            ? "Exportar paquete reproducible"
            : "Export reproducibility package"}
        </button>
      </div>
      <p className="notice">
        {es
          ? "El paquete incluye los datos locales y hashes SHA-256 para verificación independiente. Revíselo antes de compartirlo."
          : "The package includes local data and SHA-256 hashes for independent verification. Review it before sharing."}
      </p>
      <BackupRestore />
    </main>
  );
}
