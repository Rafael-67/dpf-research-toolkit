import { useState } from "react";
import { RatingScale } from "../../shared/RatingScale";
import { useLanguage } from "../../i18n/LanguageContext";

const rtlx = [
  {
    label: "Mental Demand",
    low: "Low",
    high: "High",
    prompt:
      "How much mental and perceptual activity was required? Was the task easy or demanding, simple or complex, exacting or forgiving?",
    labelEs: "Exigencia mental",
    lowEs: "Baja",
    highEs: "Alta",
    promptEs:
      "¿Cuánta actividad mental y perceptiva fue necesaria? ¿Se trató de una tarea fácil o difícil, simple o compleja, ligera o exigente?",
  },
  {
    label: "Physical Demand",
    low: "Low",
    high: "High",
    prompt:
      "How much physical activity was required? Was the task easy or demanding, slack or strenuous, restful or laborious?",
    labelEs: "Exigencia física",
    lowEs: "Baja",
    highEs: "Alta",
    promptEs:
      "¿Cuánta actividad física fue necesaria? ¿Se trató de una tarea fácil o difícil, relajada o agotadora?",
  },
  {
    label: "Temporal Demand",
    low: "Low",
    high: "High",
    prompt:
      "How much time pressure did you feel due to the pace at which tasks or task elements occurred? Was the pace slow and leisurely or rapid and frantic?",
    labelEs: "Exigencia temporal",
    lowEs: "Baja",
    highEs: "Alta",
    promptEs:
      "¿Cuánta presión de tiempo sintió debido al ritmo al que sucedían las tareas o sus elementos? ¿Era el ritmo lento y pausado o rápido y frenético?",
  },
  {
    label: "Performance",
    low: "Good",
    high: "Poor",
    prompt:
      "How successful were you in accomplishing the goals set by the experimenter (or yourself)? How satisfied were you with your performance?",
    labelEs: "Rendimiento",
    lowEs: "Bueno",
    highEs: "Malo",
    promptEs:
      "¿Hasta qué punto tuvo éxito al alcanzar los objetivos establecidos por el investigador o por usted? ¿Qué satisfacción siente con su rendimiento?",
  },
  {
    label: "Effort",
    low: "Low",
    high: "High",
    prompt:
      "How hard did you have to work (mentally and physically) to accomplish your level of performance?",
    labelEs: "Esfuerzo",
    lowEs: "Bajo",
    highEs: "Alto",
    promptEs:
      "¿En qué medida tuvo que trabajar, mental y físicamente, para alcanzar su nivel de rendimiento?",
  },
  {
    label: "Frustration",
    low: "Low",
    high: "High",
    prompt:
      "How irritated, stressed, and annoyed versus content, relaxed, and complacent did you feel during the task?",
    labelEs: "Nivel de frustración",
    lowEs: "Bajo",
    highEs: "Alto",
    promptEs:
      "Durante la tarea, ¿en qué medida se sintió inseguro, desalentado, irritado, tenso o preocupado, frente a seguro, satisfecho y relajado?",
  },
] as const;
const susItems = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to be able to use this system.",
  "I found the functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
];
const susItemsEs = [
  "Creo que me gustaría usar este sistema frecuentemente.",
  "Encontré el sistema innecesariamente complejo.",
  "Pensé que el sistema era fácil de usar.",
  "Creo que necesitaría la ayuda de personal técnico para poder usar este sistema.",
  "Encontré que las diversas funciones de este sistema estaban bien integradas.",
  "Pensé que había demasiada inconsistencia en el sistema.",
  "Imagino que la mayoría de las personas podrían aprender a usar este sistema muy rápidamente.",
  "Encontré el sistema muy difícil de usar.",
  "Me sentí muy seguro usando el sistema.",
  "Necesité aprender muchas cosas antes de poder empezar a usar este sistema.",
];
export interface ClosingValues {
  rtlx: number[];
  sus: number[];
  burden: string;
  ambiguity: string;
  usefulness: string;
  confirmed: boolean;
}
interface ClosingDraft extends Omit<ClosingValues, "rtlx" | "sus"> {
  rtlx: Array<number | null>;
  sus: Array<number | null>;
}
export function ClosingSurvey({
  includeRtlx,
  includeSus,
  onSubmit,
}: {
  includeRtlx: boolean;
  includeSus: boolean;
  onSubmit: (values: ClosingValues) => void;
}) {
  const { language, t } = useLanguage();
  const [values, setValues] = useState<ClosingDraft>({
    rtlx: Array(6).fill(null),
    sus: Array(10).fill(null),
    burden: "",
    ambiguity: "",
    usefulness: "",
    confirmed: false,
  });
  const [error, setError] = useState("");
  return (
    <main>
      <p className="eyebrow">{t("Closing survey")}</p>
      <h1>{t("Reflect on this scenario evaluation")}</h1>
      <form
        className="form-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            (includeRtlx && values.rtlx.some((value) => value === null)) ||
            (includeSus && values.sus.some((value) => value === null))
          ) {
            setError(
              language === "es"
                ? "Responda todos los elementos RTLX y SUS antes de completar la evaluación."
                : "Answer every RTLX and SUS item before completing the evaluation.",
            );
            return;
          }
          setError("");
          onSubmit({
            ...values,
            rtlx: values.rtlx as number[],
            sus: values.sus as number[],
          });
        }}
      >
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
        {includeRtlx && (
          <section>
            <h2>{t("Raw Task Load Index")}</h2>
            {rtlx.map((item, index) => (
              <label key={item.label}>
                <strong>{language === "es" ? item.labelEs : item.label}</strong>
                <span>{language === "es" ? item.promptEs : item.prompt}</span>
                <span>
                  {values.rtlx[index] ??
                    (language === "es" ? "Sin responder" : "Not answered")}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={values.rtlx[index] ?? 50}
                  aria-valuetext={
                    values.rtlx[index] === null
                      ? language === "es"
                        ? "Sin responder"
                        : "Not answered"
                      : String(values.rtlx[index])
                  }
                  onChange={(e) => {
                    const next = [...values.rtlx];
                    next[index] = Number(e.target.value);
                    setValues({ ...values, rtlx: next });
                  }}
                />
                <span>
                  {language === "es" ? item.lowEs : item.low} —{" "}
                  {language === "es" ? item.highEs : item.high}
                </span>
              </label>
            ))}
          </section>
        )}
        {includeSus && (
          <section>
            <h2>{t("System Usability Scale")}</h2>
            <p className="notice">
              {t(
                "SUS is used here per scenario, a non-standard use. Interpret results as the experience of applying the six-field instrument to this task, not as a global usability score.",
              )}
            </p>
            {(language === "es" ? susItemsEs : susItems).map((item, index) => (
              <RatingScale
                key={item}
                name={`sus-${index}`}
                label={item}
                value={values.sus[index] ?? 0}
                max={5}
                onChange={(value) => {
                  const next = [...values.sus];
                  next[index] = value;
                  setValues({ ...values, sus: next });
                }}
              />
            ))}
          </section>
        )}
        <label>
          {t("Burden feedback")}
          <textarea
            value={values.burden}
            onChange={(e) => setValues({ ...values, burden: e.target.value })}
          />
        </label>
        <label>
          {t("Ambiguity feedback")}
          <textarea
            value={values.ambiguity}
            onChange={(e) =>
              setValues({ ...values, ambiguity: e.target.value })
            }
          />
        </label>
        <label>
          {t("Usefulness feedback")}
          <textarea
            value={values.usefulness}
            onChange={(e) =>
              setValues({ ...values, usefulness: e.target.value })
            }
          />
        </label>
        <label className="check">
          <input
            required
            type="checkbox"
            checked={values.confirmed}
            onChange={(e) =>
              setValues({ ...values, confirmed: e.target.checked })
            }
          />
          {t(
            "I confirm that I evaluated only the fictional scenario as written.",
          )}
        </label>
        <button type="submit">{t("Complete evaluation")}</button>
      </form>
    </main>
  );
}
