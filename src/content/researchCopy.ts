export const RESEARCH_COPY = {
  en: {
    lead: "Collect structured expert feedback on a six-field research framework using illustrative scenarios. This tool does not assess biological risk or recommend laboratory decisions.",
    ownTitle: "Try it with your own cases.",
    own: "Create your own studies, rounds and scenarios. Use invented or de-identified details only — do not enter real personal, institutional, agent, protocol or incident information. Records are stored in this browser and are not automatically transmitted. You can explicitly export them or delete them using “Delete all local data” in the page footer.",
    link: "New here? Take the 10-minute walkthrough →",
    configure: "Create studies, rounds, and illustrative scenarios.",
    title: "10-minute walkthrough",
    intro:
      "This walkthrough shows what the instrument produces. Your entries are stored in this browser unless you explicitly export and share them.",
    steps: [
      [
        "1 · Open the administrator screen (2 min).",
        "Five illustrative scenarios (E1–E5) are loaded by default. Open a study, its round and a scenario to see how the scenario is specified. These are examples for evaluating the instrument, not laboratory instructions.",
      ],
      [
        "2 · Inspect or create a round (1 min).",
        "A round records the instrument version used for evaluations. Inspect the existing round or create a new one and assign scenarios. Version control supports comparison between evaluators; it does not by itself establish validity or agreement.",
      ],
      [
        "3 · Evaluate a scenario (5 min).",
        "Switch to the evaluator screen, save a pseudonym and start an assigned scenario. Review the six fields one at a time, adding structured observations, ratings and concise reasoning where applicable, or an explicit no-observation reason. Review your responses and complete the enabled closing questionnaires. The Raw Task Load Index (RTLX) concerns the workload of using the instrument.",
      ],
      [
        "4 · Look at the output (2 min).",
        "Return to the administrator screen or Scientific Dashboard. With suitable completed evaluations, inspect descriptive distributions and agreement statistics, including raw agreement, Cohen’s, weighted and Fleiss’ kappa, Krippendorff’s alpha and the intraclass correlation coefficient. Each statistic requires an appropriate data structure and sufficient observations; multiple evaluations alone do not make every statistic applicable. The tool does not interpret these results.",
      ],
    ],
    optional:
      "Export the available datasets as JSON or CSV, or use About / Manifest to generate a reproducibility package with SHA-256 checksums. Export a backup before deleting data. “Delete all local data” is available in the page footer.",
    limits:
      "It does not calculate Delivered Protection, biological risk or containment levels, and it does not produce validated safety assessments or recommend laboratory decisions.",
    scopeTitle: "Scope and status",
    scope:
      "The DPF Research Platform supports Phase 0 content and usability validation of the Integrated Ergonomic–Biological Interaction Framework: a six-field instrument for examining the gap between the protection a control is certified to provide and the protection actually delivered during a specific task.",
    status:
      "The framework has not been empirically validated. Its fields, indicators and illustrative thresholds are expert-consensus proposals, not measurements, and the platform exists to gather the evidence needed to test them. The platform records and summarises evaluator responses; it applies no scientific acceptance threshold and draws no scientific conclusion.",
    license: "Released under the MIT licence. Source code",
  },
  es: {
    lead: "Recopila comentarios estructurados de expertos sobre un marco de investigación de seis campos utilizando escenarios ilustrativos. Esta herramienta no evalúa el riesgo biológico ni recomienda decisiones de laboratorio.",
    ownTitle: "Pruébalo con tus propios casos.",
    own: "Crea tus propios estudios, rondas y escenarios. Utiliza únicamente detalles inventados o desidentificados: no introduzcas información real de personas, instituciones, agentes, protocolos o incidentes. Los registros se guardan en este navegador y no se transmiten automáticamente. Puedes exportarlos expresamente o eliminarlos con «Eliminar todos los datos locales», en el pie de página.",
    link: "¿Es tu primera visita? Sigue el recorrido de 10 minutos →",
    configure: "Crea estudios, rondas y escenarios ilustrativos.",
    title: "Recorrido de 10 minutos",
    intro:
      "Este recorrido muestra los resultados que produce el instrumento. Lo que introduzcas se guarda en este navegador, salvo que lo exportes y compartas expresamente.",
    steps: [
      [
        "1 · Abre la pantalla de administración (2 min).",
        "Se cargan por defecto cinco escenarios ilustrativos (E1–E5). Abre un estudio, su ronda y un escenario para ver cómo se describe. Son ejemplos para evaluar el instrumento, no instrucciones de laboratorio.",
      ],
      [
        "2 · Revisa o crea una ronda (1 min).",
        "Una ronda registra la versión del instrumento utilizada en las evaluaciones. Revisa la ronda existente o crea otra y asígnale escenarios. El control de versiones facilita la comparación entre evaluadores; por sí solo no establece la validez ni el acuerdo.",
      ],
      [
        "3 · Evalúa un escenario (5 min).",
        "Cambia a la pantalla de evaluación, guarda un seudónimo e inicia un escenario asignado. Revisa los seis campos uno a uno e incorpora observaciones estructuradas, valoraciones y razonamiento breve cuando corresponda, o un motivo explícito de ausencia de observaciones. Revisa las respuestas y completa los cuestionarios finales habilitados. El Raw Task Load Index (RTLX) se refiere a la carga de trabajo que supone utilizar el instrumento.",
      ],
      [
        "4 · Examina los resultados (2 min).",
        "Vuelve a administración o al Panel científico. Con evaluaciones completadas adecuadas, consulta las distribuciones descriptivas y los estadísticos de acuerdo: acuerdo bruto, kappa de Cohen, ponderada y de Fleiss, alfa de Krippendorff y coeficiente de correlación intraclase. Cada estadístico requiere una estructura de datos apropiada y observaciones suficientes; tener varias evaluaciones no hace aplicables todos los estadísticos. La herramienta no interpreta estos resultados.",
      ],
    ],
    optional:
      "Exporta los conjuntos disponibles como JSON o CSV, o genera un paquete reproducible con sumas de comprobación SHA-256 desde Acerca de / Manifiesto. Exporta una copia de seguridad antes de eliminar datos. «Eliminar todos los datos locales» está disponible en el pie de página.",
    limits:
      "No calcula la Protección Entregada (Delivered Protection), el riesgo biológico ni los niveles de contención; tampoco produce evaluaciones de seguridad validadas ni recomienda decisiones de laboratorio.",
    scopeTitle: "Alcance y estado",
    scope:
      "La plataforma de investigación DPF facilita la validación de contenido y usabilidad en Fase 0 del Marco Integrado de Interacción Ergonómico–Biológica (Integrated Ergonomic–Biological Interaction Framework): un instrumento de seis campos para examinar la diferencia entre la protección que un control está certificado para proporcionar y la que realmente se entrega durante una tarea concreta.",
    status:
      "El marco no ha sido validado empíricamente. Sus campos, indicadores y umbrales ilustrativos son propuestas de consenso experto, no mediciones; la plataforma permite reunir la evidencia necesaria para ponerlos a prueba. Registra y resume las respuestas de los evaluadores, sin aplicar umbrales de aceptación científica ni extraer conclusiones científicas.",
    license: "Distribuido bajo la licencia MIT. Código fuente",
  },
} as const;
