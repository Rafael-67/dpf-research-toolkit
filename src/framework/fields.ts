import type { FrameworkFieldDefinition } from "../domain/types";

export const FRAMEWORK_VERSION = "0.1.0-draft";
export const INSTRUMENT_VERSION = "1.0.0" as const;

export const frameworkFields: FrameworkFieldDefinition[] = [
  [
    "F1",
    "Critical task",
    "Describe the operation as it is actually performed, not the procedure category it belongs to.",
  ],
  [
    "F2",
    "Physical and cognitive performance demands",
    "Describe the specific postural, repetitive, force-related, or attentional demand.",
  ],
  [
    "F3",
    "Biological hazard / release consequence",
    "Describe the material that could be released or transferred following a performance deviation, the release mechanism, and the plausible exposure route.",
  ],
  [
    "F4",
    "Critical vector / material",
    "Describe the specific agent and, where relevant, its titer, vector design, transgene, concentration, volume, and plausible exposure route.",
  ],
  [
    "F5",
    "Integrated control strategy",
    "Describe the layered response across elimination or substitution, engineering, procedural, organizational, and PPE controls, together with recovery and emergency measures.",
  ],
  [
    "F6",
    "Candidate performance-degradation indicators",
    "Describe observable precursors that precede, rather than record, an incident. Treat these as candidate signals to be validated, not confirmed indicators of decline.",
  ],
].map(([fieldId, name, promptText]) => ({
  fieldId: fieldId as FrameworkFieldDefinition["fieldId"],
  name,
  promptText,
  responseType: "narrative",
  frameworkVersion: FRAMEWORK_VERSION,
  fieldDefinitionVersion: "1.0",
}));

const spanishFields: Record<string, { name: string; promptText: string }> = {
  F1: {
    name: "Tarea crítica",
    promptText:
      "Describa la operación tal como se realiza realmente, no la categoría de procedimiento a la que pertenece.",
  },
  F2: {
    name: "Demandas físicas y cognitivas del desempeño",
    promptText:
      "Describa la demanda postural, repetitiva, relacionada con la fuerza o atencional específica.",
  },
  F3: {
    name: "Peligro biológico y consecuencias de una liberación",
    promptText:
      "Describa el material que podría liberarse o transferirse tras una desviación del desempeño, el mecanismo de liberación y la vía de exposición plausible.",
  },
  F4: {
    name: "Vector o material crítico",
    promptText:
      "Describa el agente específico y, cuando corresponda, su título, diseño del vector, transgén, concentración, volumen y vía de exposición plausible.",
  },
  F5: {
    name: "Estrategia integrada de control",
    promptText:
      "Describa la respuesta por capas mediante eliminación o sustitución, controles técnicos, procedimentales, organizativos y EPI, junto con medidas de recuperación y emergencia.",
  },
  F6: {
    name: "Posibles indicadores de degradación del desempeño",
    promptText:
      "Describa precursores observables que precedan a un incidente, en lugar de registrarlo. Trátelos como señales candidatas que deben validarse, no como indicadores confirmados de deterioro.",
  },
};

export function getFrameworkFields(language: "en" | "es") {
  if (language === "en") return frameworkFields;
  return frameworkFields.map((field) => ({
    ...field,
    ...spanishFields[field.fieldId],
  }));
}
