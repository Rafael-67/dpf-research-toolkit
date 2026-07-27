import type { Language } from "./LanguageContext";
import type { Scenario, Study } from "../domain/types";

const demoCasesEs: Record<
  string,
  Pick<Scenario, "title" | "taskDescription">
> = {
  "demo-E1": {
    title: "E1: Pipeteo repetitivo y alicuotado lentiviral",
    taskDescription:
      "Alicuotado repetido de un stock lentiviral concentrado ficticio en 20-30 crioviales, con micropipeta P200 dentro de una cabina de seguridad biológica de clase II y doble guante. La sesión no puede interrumpirse; los últimos viales exigen inclinar el tubo y recolocar la punta al disminuir el volumen.",
  },
  "demo-E2": {
    title:
      "E2: Concentración de vector lentiviral mediante ultracentrifugación",
    taskDescription:
      "Concentración de un sobrenadante lentiviral ficticio mediante ultracentrifugación: transferencia en cabina, equilibrado por masa, carga del rotor, centrifugación, decantación, resuspensión del pellet y alicuotado final. El tiempo activo aproximado es de 45 minutos en dos periodos de contacto.",
  },
  "demo-E3": {
    title:
      "E3: Transducción de neuronas primarias con AAV bajo presión temporal",
    taskDescription:
      "Transducción de neuronas corticales primarias ficticias con un AAV recombinante de título alto dentro de una ventana temporal estrecha. El operador retira medio de 12 pocillos, prepara la dilución desde un stock congelado, la añade en orden, devuelve la placa al incubador y actualiza el registro en unos 35 minutos.",
  },
  "demo-E4": {
    title: "E4: Preparación, etiquetado e inventario de criostocks",
    taskDescription:
      "Preparación de una biblioteca de criostocks desde un lote lentiviral concentrado ficticio: alicuotado de 20-30 crioviales, cierre, etiquetado, ordenación, congelación controlada y registro de posiciones. La práctica ficticia exige retirar un guante para manipular las etiquetas.",
  },
  "demo-E5": {
    title: "E5: Microscopía estática e imagen de fluorescencia",
    taskDescription:
      "Microscopía de fluorescencia sostenida de muestras celulares fijadas y no infecciosas tras un trabajo previo con un vector viral ficticio. Incluye postura estática ante el ocular o monitor durante una reserva fija de 90 minutos en condiciones de iluminación tenue.",
  },
};

export function localizeScenario(
  scenario: Scenario,
  language: Language,
): Scenario {
  const translated =
    language === "es" && scenario.isDemo
      ? demoCasesEs[scenario.scenarioId]
      : undefined;
  return translated ? { ...scenario, ...translated } : scenario;
}

export function localizeDemoStudy(study: Study, language: Language): Study {
  if (language !== "es" || study.studyId !== "study-demo-aligned") return study;
  return {
    ...study,
    title: "DPF-RP v1.1 - Cinco escenarios de demostración alineados (E1-E5)",
    description:
      "Cinco escenarios ficticios: E1, pipeteo repetitivo; E2, ultracentrifugación lentiviral; E3, transducción con AAV bajo presión temporal; E4, preparación de criostocks; y E5, microscopía estática. No aptos para uso operativo.",
  };
}

export function localizeDemoRound(label: string, language: Language): string {
  return language === "es" &&
    label === "Demo round — all five aligned scenarios (E1–E5)"
    ? "Ronda de demostración - cinco escenarios alineados (E1-E5)"
    : label;
}
