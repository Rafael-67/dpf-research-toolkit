import { useState } from "react";
import {
  deleteSimulatedEvaluations,
  loadSimulatedEvaluations,
  simulatedEvaluationIds,
} from "../framework/simulatedEvaluations";
import { useLanguage } from "../i18n/LanguageContext";

export function SimulatedDataManager() {
  const { language } = useLanguage();
  const [count] = useState(simulatedEvaluationIds().length);
  const es = language === "es";
  return (
    <section className="card">
      <h2>{es ? "Datos simulados para pruebas" : "Simulated test data"}</h2>
      <p>
        {es
          ? "Tres evaluaciones completas y ficticias de E1 permiten probar gráficos y concordancia. Están identificadas como SIMULATED."
          : "Three complete fictional E1 evaluations exercise charts and agreement. They are identified as SIMULATED."}
      </p>
      <p>
        <strong>{count}</strong>{" "}
        {es
          ? "evaluaciones simuladas cargadas"
          : "simulated evaluations loaded"}
      </p>
      <div className="toolbar">
        <button
          type="button"
          disabled={count > 0}
          onClick={() => {
            loadSimulatedEvaluations();
            location.reload();
          }}
        >
          {es ? "Cargar evaluaciones simuladas" : "Load simulated evaluations"}
        </button>
        <button
          className="secondary"
          type="button"
          disabled={!count}
          onClick={() => {
            deleteSimulatedEvaluations();
            location.reload();
          }}
        >
          {es ? "Eliminar solo datos simulados" : "Delete simulated data only"}
        </button>
      </div>
    </section>
  );
}
