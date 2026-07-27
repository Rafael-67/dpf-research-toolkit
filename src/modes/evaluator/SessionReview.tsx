import type { FieldResponse } from "../../domain/types";
import { getFrameworkFields } from "../../framework/fields";
import { useLanguage } from "../../i18n/LanguageContext";

export function SessionReview({
  responses,
  onEdit,
  onContinue,
}: {
  responses: FieldResponse[];
  onEdit: (index: number) => void;
  onContinue: () => void;
}) {
  const { language, t } = useLanguage();
  const frameworkFields = getFrameworkFields(language);
  return (
    <main>
      <p className="eyebrow">{t("Review before submission")}</p>
      <h1>{t("Review your six responses")}</h1>
      <p>
        {language === "es"
          ? "Puede volver a cualquier campo antes de continuar a la encuesta final."
          : "You can return to any field before continuing to the closing survey."}
      </p>
      <div className="review-list">
        {frameworkFields.map((field, index) => {
          const response = responses[index];
          return (
            <article className="card" key={field.fieldId}>
              <h2>{field.name}</h2>
              <p>
                {response.insufficientInformation ? (
                  <em>{t("Marked insufficient information")}</em>
                ) : (
                  <>
                    {response.observations?.length ?? 0} structured
                    observation(s)
                    {response.fieldSummary?.reasoningSummary && (
                      <> · {response.fieldSummary.reasoningSummary}</>
                    )}
                  </>
                )}
              </p>
              <button className="secondary" onClick={() => onEdit(index)}>
                {language === "es" ? "Editar este campo" : "Edit this field"}
              </button>
            </article>
          );
        })}
      </div>
      <button onClick={onContinue}>{t("Continue to closing survey")}</button>
    </main>
  );
}
