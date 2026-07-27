import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "en" | "es";
type Variables = Record<string, string | number>;

const es: Record<string, string> = {
  "Phase 0 research toolkit": "Herramienta de investigación de Fase 0",
  "Collect structured expert feedback on a fictional six-field research framework. This tool does not assess biological risk or recommend laboratory decisions.":
    "Recopila comentarios estructurados de expertos sobre un marco de investigación ficticio de seis campos. Esta herramienta no evalúa el riesgo biológico ni recomienda decisiones de laboratorio.",
  Configure: "Configurar",
  "Study administrator": "Administración del estudio",
  "Create studies, rounds, and fictional scenarios.":
    "Crea estudios, rondas y escenarios ficticios.",
  Evaluate: "Evaluar",
  "Expert evaluator": "Evaluación experta",
  "Review six framework fields one at a time.":
    "Revisa los seis campos del marco uno a uno.",
  "Page not found": "Página no encontrada",
  "Return home": "Volver al inicio",
  "Main navigation": "Navegación principal",
  Administrator: "Administración",
  Evaluator: "Evaluación",
  Institutions: "Instituciones",
  "Scientific Dashboard": "Panel científico",
  Documents: "Documentos",
  Issues: "Incidencias",
  "Fictional/demo data only": "Solo datos ficticios o de demostración",
  "Research prototype.": "Prototipo de investigación.",
  "Do not use for real studies without institutional data-protection review. Use fictional/demo information only.":
    "No usar en estudios reales sin una revisión institucional de protección de datos. Utilice únicamente información ficticia o de demostración.",
  Language: "Idioma",
  English: "English",
  Spanish: "Español",
  "Administrator mode": "Modo administración",
  Studies: "Estudios",
  "Create studies, rounds, and fictional scenarios for Phase 0.":
    "Crea estudios, rondas y escenarios ficticios para la Fase 0.",
  "New study": "Nuevo estudio",
  "Merge evaluations": "Combinar evaluaciones",
  "Open study": "Abrir estudio",
  "Create study": "Crear estudio",
  Title: "Título",
  Description: "Descripción",
  "Include RTLX": "Incluir RTLX",
  "Include SUS": "Incluir SUS",
  "Study not found": "Estudio no encontrado",
  "Delete study": "Eliminar estudio",
  "Delete this study": "Eliminar este estudio",
  "The demonstration study is protected and cannot be deleted.":
    "El estudio de demostración está protegido y no se puede eliminar.",
  "This permanently deletes the study, its rounds, scenario assignments, and evaluations from this browser. Reusable scenarios are retained. Export the study first if you need a backup.":
    "Esta acción elimina permanentemente de este navegador el estudio, sus rondas, las asignaciones de casos y las evaluaciones. Los casos reutilizables se conservan. Exporte primero el estudio si necesita una copia de seguridad.",
  "round(s)": "ronda(s)",
  "evaluation(s)": "evaluación(es)",
  'Type "DELETE" to confirm': 'Escriba "DELETE" para confirmar',
  "Delete study permanently": "Eliminar estudio permanentemente",
  "← Studies": "← Estudios",
  Rounds: "Rondas",
  "No rounds yet.": "Todavía no hay rondas.",
  "New round": "Nueva ronda",
  Scenarios: "Escenarios",
  "New scenario": "Nuevo escenario",
  "Record framework change": "Registrar cambio del marco",
  "Create round": "Crear ronda",
  "Round number": "Número de ronda",
  Label: "Etiqueta",
  "Evaluator group": "Grupo evaluador",
  "Create fictional scenario": "Crear escenario ficticio",
  "Task description": "Descripción de la tarea",
  "Operating conditions": "Condiciones operativas",
  "Available information": "Información disponible",
  "Vector/material description": "Descripción del vector o material",
  "Volume or concentration": "Volumen o concentración",
  "Existing controls": "Controles existentes",
  "Contextual constraints": "Restricciones contextuales",
  "Intended evaluator group": "Grupo evaluador previsto",
  "Administrator notes": "Notas de administración",
  "Create scenario": "Crear escenario",
  "Study title": "Título del estudio",
  "Round label": "Etiqueta de la ronda",
  "Open round": "Abrir ronda",
  Version: "Versión",
  active: "activo",
  draft: "borrador",
  closed: "cerrado",
  open: "abierta",
  locked: "bloqueada",
  not_started: "no iniciada",
  in_progress: "en curso",
  in_review: "en revisión",
  abandoned: "abandonada",
  "Do not enter real protocols, institutional identifiers, or non-public agent information.":
    "No introduzca protocolos reales, identificadores institucionales ni información no pública sobre agentes.",
  "Round not found": "Ronda no encontrada",
  "← Study": "← Estudio",
  "Assigned scenarios": "Escenarios asignados",
  "Agreement summary": "Resumen de concordancia",
  "Descriptive statistics only": "Solo estadísticas descriptivas",
  "Round agreement summary": "Resumen de concordancia de la ronda",
  Field: "Campo",
  Rating: "Valoración",
  "Pairwise Cohen's κ": "κ de Cohen por pares",
  "Fleiss' κ": "κ de Fleiss",
  "Study distribution": "Distribución del estudio",
  "Export this study for the confirmed, human-mediated distribution channel.":
    "Exporte este estudio mediante el canal de distribución humano confirmado.",
  "Export study-config.json": "Exportar study-config.json",
  "Evaluation queue": "Cola de evaluación",
  "Evaluator mode": "Modo evaluación",
  "Use a study-issued pseudonym. Do not enter your real name or institutional identifier.":
    "Utilice un seudónimo asignado por el estudio. No introduzca su nombre real ni un identificador institucional.",
  "Evaluator pseudonym": "Seudónimo del evaluador",
  "Save pseudonym": "Guardar seudónimo",
  "Cases and fictional demo scenarios":
    "Casos y escenarios ficticios de demostración",
  "Five fictional examples are loaded automatically for testing. Use Import study to load additional cases from a valid study-config.json.":
    "Se cargan automáticamente cinco ejemplos ficticios para realizar pruebas. Use Importar estudio para cargar casos adicionales desde un study-config.json válido.",
  "Import study": "Importar estudio",
  "Fictional demo": "Demostración ficticia",
  "Imported case": "Caso importado",
  "Reference scenario": "Escenario de referencia",
  "Research-extension scenario": "Escenario de extensión de investigación",
  "User scenario": "Escenario de usuario",
  "Instrument version": "Versión del instrumento",
  "DPF-RP uses one structured hybrid workflow. Taxonomy 0.1-exploratory contains candidate items for validation.":
    "DPF-RP utiliza un único flujo híbrido estructurado. La taxonomía 0.1-exploratory contiene elementos candidatos para validación.",
  "Taxonomy 0.1-exploratory. Categories guide observations; they are not a mandatory checklist.":
    "Taxonomía 0.1-exploratory. Las categorías orientan las observaciones; no son una lista de comprobación obligatoria.",
  "Legacy classification defaults applied to {count} scenarios.":
    "Se aplicaron valores de clasificación heredados a {count} escenarios.",
  "Start evaluation": "Iniciar evaluación",
  "Completed evaluations": "Evaluaciones completadas",
  Completed: "Completada",
  "Import studies or cases": "Importar estudios o casos",
  "Files are processed only in this browser.":
    "Los archivos se procesan únicamente en este navegador.",
  "Required case format": "Formato requerido de los casos",
  "Download CSV template": "Descargar plantilla CSV",
  "Study or case file (JSON, CSV, DOCX, or PDF)":
    "Archivo de estudio o caso (JSON, CSV, DOCX o PDF)",
  "Import failed.": "La importación ha fallado.",
  "Imported {studies} study and {cases} cases from {file}.":
    "Se importaron {studies} estudio(s) y {cases} caso(s) desde {file}.",
  "Scenario unavailable": "Escenario no disponible",
  "Field {current} of 6": "Campo {current} de 6",
  "Do not enter select-agent information or non-public protocol details. Use only the demo/fictional scenario as written.":
    "No introduzca información sobre agentes selectos ni detalles de protocolos no públicos. Utilice únicamente el escenario ficticio o de demostración tal como está escrito.",
  "Your qualitative response": "Su respuesta cualitativa",
  "Open comment": "Comentario abierto",
  "Suggested change": "Cambio sugerido",
  "Insufficient information to rate this field":
    "Información insuficiente para valorar este campo",
  Confidence: "Confianza",
  Relevance: "Relevancia",
  Clarity: "Claridad",
  Exhaustiveness: "Exhaustividad",
  Redundancy: "Redundancia",
  Applicability: "Aplicabilidad",
  "Interpretation difficulty": "Dificultad de interpretación",
  Previous: "Anterior",
  "Review responses": "Revisar respuestas",
  "Next field": "Campo siguiente",
  "Review before submission": "Revisión antes del envío",
  "Review your six responses": "Revise sus seis respuestas",
  "Marked insufficient information": "Marcado como información insuficiente",
  "No narrative response": "Sin respuesta narrativa",
  Edit: "Editar",
  "Continue to closing survey": "Continuar a la encuesta final",
  "Closing survey": "Encuesta final",
  "Reflect on this scenario evaluation":
    "Reflexione sobre la evaluación de este escenario",
  "Raw Task Load Index": "Índice de carga de tarea sin ponderar",
  "Mental demand": "Demanda mental",
  "Physical demand": "Demanda física",
  "Temporal demand": "Demanda temporal",
  Performance: "Rendimiento",
  Effort: "Esfuerzo",
  Frustration: "Frustración",
  "System Usability Scale": "Escala de usabilidad del sistema",
  "SUS is used here per scenario, a non-standard use. Interpret results as the experience of applying the six-field instrument to this task, not as a global usability score.":
    "Aquí se utiliza SUS para cada escenario, un uso no estándar. Interprete los resultados como la experiencia de aplicar el instrumento de seis campos a esta tarea, no como una puntuación global de usabilidad.",
  "Burden feedback": "Comentarios sobre la carga",
  "Ambiguity feedback": "Comentarios sobre la ambigüedad",
  "Usefulness feedback": "Comentarios sobre la utilidad",
  "I confirm that I evaluated only the fictional scenario as written.":
    "Confirmo que evalué únicamente el escenario ficticio tal como está escrito.",
  "Complete evaluation": "Completar evaluación",
  "Delete all local data": "Eliminar todos los datos locales",
  "This permanently removes studies, scenarios, rounds, and evaluations stored in this browser.":
    "Esto elimina permanentemente los estudios, escenarios, rondas y evaluaciones almacenados en este navegador.",
  Cancel: "Cancelar",
  "Delete everything": "Eliminar todo",
  "This permanently removes every DPF Toolkit record from this browser.":
    "Esto elimina permanentemente del navegador todos los registros de DPF Toolkit.",
  "Type DELETE to confirm": "Escriba DELETE para confirmar",
  "Delete permanently": "Eliminar permanentemente",
  "Merge evaluation exports": "Combinar exportaciones de evaluación",
  "Evaluation JSON files": "Archivos JSON de evaluación",
  "Merge selected files": "Combinar archivos seleccionados",
  "Merge report": "Informe de combinación",
  "Duplicate session IDs": "Identificadores de sesión duplicados",
  "Possible duplicate attempts — human decision required":
    "Posibles intentos duplicados — se requiere una decisión humana",
  "Round pair": "Par de rondas",
  Comparable: "Comparable",
  Reason: "Motivo",
  Yes: "Sí",
  No: "No",
  "Export merged dataset": "Exportar conjunto de datos combinado",
  "Export merged JSON": "Exportar JSON combinado",
  "Export merged CSV": "Exportar CSV combinado",
  "Lock round": "Bloquear ronda",
  "Unlock round": "Desbloquear ronda",
  "completed evaluation sessions": "sesiones de evaluación completadas",
  "Framework field": "Campo del marco",
  "Previous definition version": "Versión anterior de la definición",
  "New definition version": "Nueva versión de la definición",
  "Previous text": "Texto anterior",
  "New text": "Texto nuevo",
  "Change type": "Tipo de cambio",
  Rationale: "Justificación",
  "Approved in round (round ID)": "Aprobado en la ronda (ID de ronda)",
  "Approved by pseudonym/code": "Aprobado por seudónimo o código",
  "Record change": "Registrar cambio",
  "Import individual evaluator files. Duplicate and version conflicts are always surfaced.":
    "Importe archivos individuales de evaluadores. Los conflictos de duplicados y versiones se muestran siempre.",
  "Merge import failed.": "La importación para combinar ha fallado.",
  "unique sessions loaded.": "sesiones únicas cargadas.",
  "No — kept separate": "No — se mantienen separadas",
  "No breaking change found": "No se encontraron cambios incompatibles",
  "Exports retain all sessions and the field-level comparability matrix.":
    "Las exportaciones conservan todas las sesiones y la matriz de comparabilidad por campo.",
  "Export field-response CSV": "Exportar CSV de respuestas por campo",
  "Export evaluation JSON": "Exportar evaluación JSON",
  Round: "Ronda",
  "Comparability default:": "Comparabilidad predeterminada:",
  breaking: "incompatible",
  "non-breaking": "compatible",
  "The selected file is not valid JSON.":
    "El archivo seleccionado no es un JSON válido.",
  "The JSON root must be an object.": "La raíz del JSON debe ser un objeto.",
  "The JSON is missing entities.": "Falta entities en el JSON.",
  "The CSV contains an unterminated quoted field.":
    "El CSV contiene un campo entrecomillado sin terminar.",
  "The CSV must contain a header and at least one case row.":
    "El CSV debe contener una cabecera y al menos una fila de caso.",
  "Legacy .doc files are not supported. Save the document as .docx and try again.":
    "Los archivos .doc antiguos no son compatibles. Guarde el documento como .docx e inténtelo de nuevo.",
  "Unsupported file type. Select JSON, CSV, DOCX, or PDF.":
    "Tipo de archivo no compatible. Seleccione JSON, CSV, DOCX o PDF.",
  "Answer every rating or mark insufficient information.":
    "Responda todas las valoraciones o marque que la información es insuficiente.",
  "The selected file is empty.": "El archivo seleccionado está vacío.",
  "The selected file exceeds the 10 MB limit.":
    "El archivo seleccionado supera el límite de 10 MB.",
  "The file extension and MIME type do not match.":
    "La extensión del archivo y el tipo MIME no coinciden.",
  "Biosafety officers and ergonomists":
    "Responsables de bioseguridad y especialistas en ergonomía",
  "Biosafety officers and ergonomists with viral-vector laboratory experience":
    "Responsables de bioseguridad y especialistas en ergonomía con experiencia de laboratorio en vectores virales",
  "Biosafety officers and ergonomists with experience in viral-vector laboratory practice":
    "Responsables de bioseguridad y especialistas en ergonomía con experiencia en prácticas de laboratorio con vectores virales",
  "Lock this round before statistics are calculated.":
    "Bloquee esta ronda antes de calcular las estadísticas.",
  "Values are descriptive and do not accept or reject any field, round, or framework.":
    "Los valores son descriptivos y no aceptan ni rechazan ningún campo, ronda o marco.",
  "Not enough comparable data": "No hay suficientes datos comparables",
  "Requires 3 completed sessions": "Requiere 3 sesiones completadas",
  "completed sessions; Cohen's κ requires at least 2.":
    "sesiones completadas; la κ de Cohen requiere al menos 2.",
  Poor: "Pobre",
  Slight: "Leve",
  Fair: "Aceptable",
  Moderate: "Moderada",
  Substantial: "Sustancial",
  "Almost perfect": "Casi perfecta",
  confidenceRating: "Confianza",
  relevance: "Relevancia",
  clarity: "Claridad",
  exhaustiveness: "Exhaustividad",
  redundancy: "Redundancia",
  applicability: "Aplicabilidad",
  interpretationDifficulty: "Dificultad de interpretación",
  wording: "redacción",
  "response-type": "tipo de respuesta",
  scale: "escala",
  merge: "fusión",
  split: "división",
  removal: "eliminación",
  addition: "adición",
  "Possible duplicate attempt:": "Posible intento duplicado:",
  round: "ronda",
  scenario: "escenario",
};

function translateDynamicError(key: string): string | undefined {
  if (key.startsWith("File is too large."))
    return "El archivo es demasiado grande. El tamaño máximo de importación es de 10 MB.";
  if (key.startsWith("Unsupported file type:"))
    return `Tipo de archivo no compatible: ${key.split(":")[1]?.trim() ?? "desconocido"}`;
  if (key.startsWith("File type mismatch:"))
    return "La extensión del archivo no coincide con su tipo MIME.";
  if (key.startsWith("Invalid study-config"))
    return `Configuración de estudio no válida: ${key.replace(/^Invalid study-config[^:]*:\s*/, "")}`;
  if (key.startsWith("Invalid evaluation export"))
    return `Exportación de evaluación no válida: ${key.replace(/^Invalid evaluation export[^:]*:\s*/, "")}`;
  if (key.startsWith("Wrong export type:"))
    return "El tipo de exportación no es el esperado.";
  if (key.startsWith("Duplicate sessionId"))
    return key
      .replace(/^Duplicate sessionId/, "sessionId duplicado")
      .replace(": records from ", ": los registros de ")
      .replace(" and ", " y ")
      .replace(" retained separately.", " se conservaron por separado.");
  if (key.startsWith("instrumentVersion mismatch:"))
    return key.replace(
      "instrumentVersion mismatch:",
      "instrumentVersion no coincide:",
    );
  if (/^Case \d+ must include/.test(key))
    return "Cada caso debe incluir title y taskDescription, o sus equivalentes en español.";
  return undefined;
}

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: Variables) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("dpft:language");
    if (saved === "en" || saved === "es") return saved;
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  });
  useEffect(() => {
    localStorage.setItem("dpft:language", language);
    document.documentElement.lang = language;
  }, [language]);
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string, variables: Variables = {}) => {
        let result =
          language === "es"
            ? (es[key] ?? translateDynamicError(key) ?? key)
            : key;
        for (const [name, replacement] of Object.entries(variables)) {
          result = result.replaceAll(`{${name}}`, String(replacement));
        }
        return result;
      },
    }),
    [language],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("LanguageProvider missing");
  return value;
}
