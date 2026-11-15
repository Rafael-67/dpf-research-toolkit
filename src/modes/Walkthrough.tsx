import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { RESEARCH_COPY } from "../content/researchCopy";
export function Walkthrough() {
  const { language } = useLanguage();
  const es = language === "es";
  const copy = RESEARCH_COPY[es ? "es" : "en"];
  return (
    <main>
      <p className="eyebrow">DPF-RP</p>
      <h1>{copy.title}</h1>
      <p className="lead">{copy.intro}</p>
      {copy.steps.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
      <section>
        <h2>{es ? "Opcional" : "Optional"}</h2>
        <p>{copy.optional}</p>
      </section>
      <section className="notice">
        <h2>
          {es
            ? "Lo que esta herramienta no hace"
            : "What this tool does not do"}
        </h2>
        <p>{copy.limits}</p>
      </section>
      <div className="actions">
        <Link to="/admin">
          {es ? "Abrir administración" : "Open administrator"}
        </Link>
        <Link to="/evaluator">
          {es ? "Abrir evaluación" : "Open evaluator"}
        </Link>
        <Link to="/about">
          {es ? "Acerca de / Manifiesto" : "About / Manifest"}
        </Link>
      </div>
    </main>
  );
}
