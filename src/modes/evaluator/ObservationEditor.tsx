import { useId, useState } from "react";
import type {
  FieldId,
  EvidenceSource,
  EvidenceSourceSelection,
  Observation,
  OrdinalRating5,
  QuantitativeObservationRatings,
  Selection,
  TaskPhase,
} from "../../domain/types";
import {
  evidenceSources,
  fieldTaxonomies,
  structuredCatalogues,
  taskPhases,
} from "../../framework/structuredTaxonomy";

const selections = (values: string[]): Selection<string>[] =>
  values.map((value) => ({ value }));
const phaseSelections = (values: string[]): Selection<TaskPhase>[] =>
  values.map((value) => ({ value: value as TaskPhase }));
const evidenceSelections = (values: string[]): EvidenceSourceSelection[] =>
  values.map((value) => ({ value: value as EvidenceSource }));

function SearchableMulti({
  label,
  values,
  selected,
  onChange,
  required,
}: {
  label: string;
  values: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const filtered = values.filter((value) =>
    value.replaceAll("_", " ").includes(query.toLowerCase()),
  );
  return (
    <fieldset className="taxonomy-selector">
      <legend>
        {label}
        {required ? " *" : ""}
      </legend>
      <label htmlFor={`${id}-search`}>Search/filter</label>
      <input
        id={`${id}-search`}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value.toLowerCase())}
      />
      {selected.length > 0 && (
        <div className="selected-chips" aria-label={`Selected ${label}`}>
          {selected.map((value) => (
            <button
              type="button"
              className="chip"
              key={value}
              onClick={() =>
                onChange(selected.filter((item) => item !== value))
              }
              aria-label={`Remove ${value}`}
            >
              {value} ×
            </button>
          ))}
        </div>
      )}
      <div className="taxonomy-options">
        {filtered.map((value) => (
          <label className="check" key={value}>
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...selected, value]
                    : selected.filter((item) => item !== value),
                )
              }
            />
            {value.replaceAll("_", " ")}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Rating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: OrdinalRating5;
  onChange: (value: OrdinalRating5) => void;
}) {
  return (
    <label>
      {label}
      <select
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value) as OrdinalRating5)
        }
        aria-label={`${label}, 1 to 5`}
      >
        {[1, 2, 3, 4, 5].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ObservationEditor({
  fieldId,
  onSave,
}: {
  fieldId: FieldId;
  onSave: (value: Observation) => void;
}) {
  const [category, setCategory] = useState(fieldTaxonomies[fieldId][0]);
  const [categoryOther, setCategoryOther] = useState("");
  const [selectionOtherText, setSelectionOtherText] = useState("");
  const [phases, setPhases] = useState<string[]>(["whole_task"]);
  const [evidence, setEvidence] = useState<string[]>(["scenario_information"]);
  const [ratings, setRatings] = useState<QuantitativeObservationRatings>({
    analyticalRelevance: 3,
    evidenceStrength: 3,
    expectedInfluenceOnDeliveredProtection: 3,
    evaluatorCertainty: 3,
  });
  const [reasoningSummary, setReasoningSummary] = useState("");
  const [extendedComments, setExtendedComments] = useState("");
  const [values, setValues] = useState<
    Record<string, string | string[] | number>
  >({});
  const [error, setError] = useState("");
  const multi = (key: string) => (value: string[]) =>
    setValues((current) => ({ ...current, [key]: value }));
  const scalar = (key: string) => (value: string | number) =>
    setValues((current) => ({ ...current, [key]: value }));
  const withOtherText = <T extends string>(items: Selection<T>[]) =>
    items.map((item) =>
      item.value === "other" || item.value.startsWith("other_")
        ? { ...item, otherText: selectionOtherText.trim() || undefined }
        : item,
    );
  const list = (key: string, fallback: string) =>
    withOtherText(
      selections((values[key] as string[] | undefined) ?? [fallback]),
    );
  const one = (key: string, fallback: string): Selection<string> => ({
    value: (values[key] as string | undefined) ?? fallback,
  });

  const save = () => {
    const isOther = category === "other" || category.startsWith("other_");
    const hasOtherSelection = [
      ...phases,
      ...evidence,
      ...Object.values(values).flatMap((value) =>
        Array.isArray(value) ? value : [String(value)],
      ),
    ].some((value) => value === "other" || value.startsWith("other_"));
    if (
      !phases.length ||
      !evidence.length ||
      !reasoningSummary.trim() ||
      (isOther && !categoryOther.trim()) ||
      (hasOtherSelection && !selectionOtherText.trim())
    ) {
      setError(
        "Complete the required selections and reasoning summary; specify any Other value.",
      );
      return;
    }
    const base = {
      observationId: crypto.randomUUID(),
      fieldId,
      category: {
        value: category,
        ...(isOther ? { otherText: categoryOther.trim() } : {}),
      },
      taskPhases: withOtherText(phaseSelections(phases)),
      evidenceSources: withOtherText(evidenceSelections(evidence)),
      ratings,
      reasoningSummary: reasoningSummary.trim(),
      extendedComments: extendedComments.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    let observation: Observation;
    if (fieldId === "F1")
      observation = {
        ...base,
        fieldId,
        taskFamily: one("taskFamily", "preparation"),
        taskOperations: list("taskOperations", "inspect"),
        workMode: one("workMode", "manual"),
        systemOpenness: one("systemOpenness", "not_determinable"),
        materialPhysicalState: list(
          "materialPhysicalState",
          "not_determinable",
        ),
        vesselOrDevice: list("vesselOrDevice", "not_determinable"),
        taskCriticality:
          (values.taskCriticality as OrdinalRating5) || undefined,
      };
    else if (fieldId === "F2")
      observation = {
        ...base,
        fieldId,
        demandDomains: list("demandDomains", "not_determinable"),
        demandFactors: list("demandFactors", "not_determinable"),
        bodyRegions: list("bodyRegions", "not_applicable"),
        demandIntensity: (values.demandIntensity as OrdinalRating5) ?? 3,
        exposureDuration: (values.exposureDuration as string) ?? "unknown",
        frequencyPattern: (values.frequencyPattern as string) ?? "unknown",
        variabilityPattern: (values.variabilityPattern as string) ?? "unknown",
        recoveryAvailability:
          (values.recoveryAvailability as string) ?? "unknown",
        temporalLocation: phaseSelections(phases),
        coincidesWithMaterialHandling:
          (values.coincidesWithMaterialHandling as
            "yes" | "no" | "partial" | "unknown") ?? "unknown",
        coincidesWithOpenHandling:
          (values.coincidesWithOpenHandling as
            "yes" | "no" | "partial" | "unknown") ?? "unknown",
        ppeContributors: list("ppeContributors", "not_applicable"),
      };
    else if (fieldId === "F3") {
      const initiatingConditions = list(
        "initiatingConditions",
        "not_determinable",
      );
      const deviationTypes = list("deviationTypes", "not_determinable");
      const operationalOutcomes = list(
        "operationalOutcomes",
        "not_determinable",
      );
      const releasePathways = list("releasePathways", "not_determinable");
      observation = {
        ...base,
        fieldId,
        initiatingConditions,
        deviationTypes,
        operationalOutcomes,
        releasePathways,
        exposureRoutes: list("exposureRoutes", "not_applicable"),
        causalChain: {
          initiatingConditionIds: initiatingConditions.map(
            ({ value }) => value,
          ),
          deviationTypeIds: deviationTypes.map(({ value }) => value),
          operationalOutcomeIds: operationalOutcomes.map(({ value }) => value),
          releasePathwayIds: releasePathways.map(({ value }) => value),
          chainSummary:
            (values.chainSummary as string) || reasoningSummary.trim(),
        },
        detectability: (values.detectability as OrdinalRating5) ?? 3,
        reversibility: (values.reversibility as OrdinalRating5) ?? 3,
      };
    } else if (fieldId === "F4")
      observation = {
        ...base,
        fieldId,
        materialCategories: list("materialCategories", "not_determinable"),
        biologicalMaterialStatus: list(
          "biologicalMaterialStatus",
          "unknown_or_unverified",
        ),
        volumeBand: one("volumeBand", "unknown"),
        concentrationComparison:
          (values.concentrationComparison as string) ?? "not_comparable",
        volumeComparison:
          (values.volumeComparison as string) ?? "not_comparable",
        containerState: one("containerState", "unknown"),
        manipulationCharacteristics: list(
          "manipulationCharacteristics",
          "not_determinable",
        ),
        vectorOrConstructFeatures: list(
          "vectorOrConstructFeatures",
          "not_applicable",
        ),
        informationSufficiency:
          (values.informationSufficiency as string) ?? "insufficient",
        missingInformation: list("missingInformation", "not_determinable"),
      };
    else if (fieldId === "F5")
      observation = {
        ...base,
        fieldId,
        controlLayer: one("controlLayer", "not_determinable"),
        controls: list("controls", "not_determinable"),
        controlFunctions: list("controlFunctions", "not_determinable"),
        humanPerformanceDependencies: list(
          "humanPerformanceDependencies",
          "not_determinable",
        ),
        failureConditions: list("failureConditions", "not_determinable"),
        gapStatus: (values.gapStatus as string) ?? "unknown",
        gapTypes: list("gapTypes", "not_determinable"),
        recoveryControlStatus:
          (values.recoveryControlStatus as string) ?? "unknown",
      };
    else
      observation = {
        ...base,
        fieldId: "F6",
        indicatorName:
          (values.indicatorName as string) || category.replaceAll("_", " "),
        constructTypes: list("constructTypes", "not_determinable"),
        measurementForms: list("measurementForms", "not_determinable"),
        expectedDirection: one("expectedDirection", "unknown"),
        interpretationAmbiguity: one(
          "interpretationAmbiguity",
          "not_determinable",
        ),
        observationMethods: list("observationMethods", "not_determinable"),
        feasibility: (values.feasibility as OrdinalRating5) ?? 3,
        disambiguationCriterion:
          (values.disambiguationCriterion as string) ||
          "Requires validation against the stated observation method.",
      };
    setError("");
    onSave(observation);
    setReasoningSummary("");
    setExtendedComments("");
  };

  return (
    <fieldset className="card">
      <legend>Taxonomy 0.1-exploratory · Add structured observation</legend>
      <p>
        Categories guide characterisation; they are not a mandatory checklist
        and do not produce a biological-risk or containment score.
      </p>
      {error && <p role="alert">{error}</p>}
      <label>
        Primary category *
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {fieldTaxonomies[fieldId].map((value) => (
            <option key={value} value={value}>
              {value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>
      {(category === "other" || category.startsWith("other_")) && (
        <label>
          Other — specify *
          <input
            value={categoryOther}
            onChange={(event) => setCategoryOther(event.target.value)}
          />
        </label>
      )}
      <SearchableMulti
        label="Task phases"
        values={taskPhases}
        selected={phases}
        onChange={setPhases}
        required
      />
      {(phases.some((value) => value.startsWith("other")) ||
        evidence.some((value) => value.startsWith("other")) ||
        Object.values(values)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .some(
            (value) => typeof value === "string" && value.startsWith("other"),
          )) && (
        <label>
          Other selected value — specify *
          <input
            value={selectionOtherText}
            onChange={(event) => setSelectionOtherText(event.target.value)}
          />
        </label>
      )}
      <SearchableMulti
        label="Evidence sources"
        values={evidenceSources}
        selected={evidence}
        onChange={setEvidence}
        required
      />
      <details open>
        <summary>Field-specific structured characterisation</summary>
        {fieldId === "F1" && (
          <>
            <Single
              label="Task family"
              values={structuredCatalogues.F1.taskFamily}
              onChange={scalar("taskFamily")}
            />
            <SearchableMulti
              label="Task operations"
              values={structuredCatalogues.F1.taskOperations}
              selected={(values.taskOperations as string[]) ?? []}
              onChange={multi("taskOperations")}
              required
            />
            <Single
              label="Work mode"
              values={structuredCatalogues.F1.workMode}
              onChange={scalar("workMode")}
            />
            <Single
              label="System openness"
              values={structuredCatalogues.F1.systemOpenness}
              onChange={scalar("systemOpenness")}
            />
            <SearchableMulti
              label="Material physical states"
              values={structuredCatalogues.F1.materialPhysicalState}
              selected={(values.materialPhysicalState as string[]) ?? []}
              onChange={multi("materialPhysicalState")}
              required
            />
            <SearchableMulti
              label="Vessels or devices"
              values={structuredCatalogues.F1.vesselOrDevice}
              selected={(values.vesselOrDevice as string[]) ?? []}
              onChange={multi("vesselOrDevice")}
              required
            />
          </>
        )}
        {fieldId === "F2" && (
          <>
            <SearchableMulti
              label="Demand domains"
              values={structuredCatalogues.F2.demandDomains}
              selected={(values.demandDomains as string[]) ?? []}
              onChange={multi("demandDomains")}
              required
            />
            <SearchableMulti
              label="Demand factors"
              values={structuredCatalogues.F2.demandFactors}
              selected={(values.demandFactors as string[]) ?? []}
              onChange={multi("demandFactors")}
              required
            />
            <SearchableMulti
              label="Body regions"
              values={structuredCatalogues.F2.bodyRegions}
              selected={(values.bodyRegions as string[]) ?? []}
              onChange={multi("bodyRegions")}
            />
            <SearchableMulti
              label="PPE contributors"
              values={structuredCatalogues.F2.ppeContributors}
              selected={(values.ppeContributors as string[]) ?? []}
              onChange={multi("ppeContributors")}
            />
            <Rating
              label="Demand intensity"
              value={(values.demandIntensity as OrdinalRating5) ?? 3}
              onChange={scalar("demandIntensity")}
            />
          </>
        )}
        {fieldId === "F3" && (
          <>
            <SearchableMulti
              label="Initiating conditions"
              values={structuredCatalogues.F3.initiatingConditions}
              selected={(values.initiatingConditions as string[]) ?? []}
              onChange={multi("initiatingConditions")}
              required
            />
            <SearchableMulti
              label="Deviation types"
              values={structuredCatalogues.F3.deviationTypes}
              selected={(values.deviationTypes as string[]) ?? []}
              onChange={multi("deviationTypes")}
              required
            />
            <SearchableMulti
              label="Operational outcomes"
              values={structuredCatalogues.F3.operationalOutcomes}
              selected={(values.operationalOutcomes as string[]) ?? []}
              onChange={multi("operationalOutcomes")}
              required
            />
            <SearchableMulti
              label="Release pathways"
              values={structuredCatalogues.F3.releasePathways}
              selected={(values.releasePathways as string[]) ?? []}
              onChange={multi("releasePathways")}
              required
            />
            <SearchableMulti
              label="Exposure routes"
              values={structuredCatalogues.F3.exposureRoutes}
              selected={(values.exposureRoutes as string[]) ?? []}
              onChange={multi("exposureRoutes")}
            />
            <Rating
              label="Detectability"
              value={(values.detectability as OrdinalRating5) ?? 3}
              onChange={scalar("detectability")}
            />
            <Rating
              label="Reversibility"
              value={(values.reversibility as OrdinalRating5) ?? 3}
              onChange={scalar("reversibility")}
            />
          </>
        )}
        {fieldId === "F4" && (
          <>
            <SearchableMulti
              label="Material categories"
              values={structuredCatalogues.F4.materialCategories}
              selected={(values.materialCategories as string[]) ?? []}
              onChange={multi("materialCategories")}
              required
            />
            <SearchableMulti
              label="Biological material status"
              values={structuredCatalogues.F4.biologicalMaterialStatus}
              selected={(values.biologicalMaterialStatus as string[]) ?? []}
              onChange={multi("biologicalMaterialStatus")}
              required
            />
            <Single
              label="Volume band"
              values={structuredCatalogues.F4.volumeBands}
              onChange={scalar("volumeBand")}
            />
            <Single
              label="Container state"
              values={structuredCatalogues.F4.containerStates}
              onChange={scalar("containerState")}
            />
            <SearchableMulti
              label="Manipulation characteristics"
              values={structuredCatalogues.F4.manipulationCharacteristics}
              selected={(values.manipulationCharacteristics as string[]) ?? []}
              onChange={multi("manipulationCharacteristics")}
              required
            />
            <SearchableMulti
              label="Vector or construct features"
              values={structuredCatalogues.F4.vectorFeatures}
              selected={(values.vectorOrConstructFeatures as string[]) ?? []}
              onChange={multi("vectorOrConstructFeatures")}
            />
          </>
        )}
        {fieldId === "F5" && (
          <>
            <Single
              label="Control layer"
              values={structuredCatalogues.F5.controlLayers}
              onChange={scalar("controlLayer")}
            />
            <SearchableMulti
              label="Controls"
              values={structuredCatalogues.F5.controls}
              selected={(values.controls as string[]) ?? []}
              onChange={multi("controls")}
              required
            />
            <SearchableMulti
              label="Control functions"
              values={structuredCatalogues.F5.controlFunctions}
              selected={(values.controlFunctions as string[]) ?? []}
              onChange={multi("controlFunctions")}
              required
            />
            <SearchableMulti
              label="Human-performance dependencies"
              values={structuredCatalogues.F5.humanPerformanceDependencies}
              selected={(values.humanPerformanceDependencies as string[]) ?? []}
              onChange={multi("humanPerformanceDependencies")}
              required
            />
            <SearchableMulti
              label="Failure conditions"
              values={structuredCatalogues.F5.failureConditions}
              selected={(values.failureConditions as string[]) ?? []}
              onChange={multi("failureConditions")}
              required
            />
          </>
        )}
        {fieldId === "F6" && (
          <>
            <label>
              Indicator name *
              <input
                value={(values.indicatorName as string) ?? ""}
                onChange={(event) =>
                  scalar("indicatorName")(event.target.value)
                }
              />
            </label>
            <SearchableMulti
              label="Construct types"
              values={structuredCatalogues.F6.constructTypes}
              selected={(values.constructTypes as string[]) ?? []}
              onChange={multi("constructTypes")}
              required
            />
            <SearchableMulti
              label="Measurement forms"
              values={structuredCatalogues.F6.measurementForms}
              selected={(values.measurementForms as string[]) ?? []}
              onChange={multi("measurementForms")}
              required
            />
            <SearchableMulti
              label="Observation methods"
              values={structuredCatalogues.F6.observationMethods}
              selected={(values.observationMethods as string[]) ?? []}
              onChange={multi("observationMethods")}
              required
            />
            <Rating
              label="Feasibility"
              value={(values.feasibility as OrdinalRating5) ?? 3}
              onChange={scalar("feasibility")}
            />
            <label>
              Disambiguation criterion *
              <textarea
                value={(values.disambiguationCriterion as string) ?? ""}
                onChange={(event) =>
                  scalar("disambiguationCriterion")(event.target.value)
                }
              />
            </label>
          </>
        )}
      </details>
      <fieldset>
        <legend>Independent quantitative ratings (1–5)</legend>
        <Rating
          label="Analytical relevance"
          value={ratings.analyticalRelevance}
          onChange={(value) =>
            setRatings({ ...ratings, analyticalRelevance: value })
          }
        />
        <small>
          1 negligible · 2 limited · 3 moderate · 4 high · 5 central
        </small>
        <Rating
          label="Evidence strength"
          value={ratings.evidenceStrength}
          onChange={(value) =>
            setRatings({ ...ratings, evidenceStrength: value })
          }
        />
        <small>
          1 very weak · 2 weak · 3 adequate · 4 strong · 5 very strong
        </small>
        <Rating
          label="Expected influence on delivered protection"
          value={ratings.expectedInfluenceOnDeliveredProtection}
          onChange={(value) =>
            setRatings({
              ...ratings,
              expectedInfluenceOnDeliveredProtection: value,
            })
          }
        />
        <small>
          Descriptive influence only; not risk severity or exposure probability.
        </small>
        <Rating
          label="Evaluator certainty"
          value={ratings.evaluatorCertainty}
          onChange={(value) =>
            setRatings({ ...ratings, evaluatorCertainty: value })
          }
        />
        <small>
          Combines confidence, evidence, documentation, observation and
          applicable expertise.
        </small>
        <Rating
          label="Consensus priority"
          value={ratings.consensusPriority ?? 3}
          onChange={(value) =>
            setRatings({ ...ratings, consensusPriority: value })
          }
        />
      </fieldset>
      <label>
        Reasoning summary * (80–300 characters recommended; maximum 500)
        <textarea
          required
          maxLength={500}
          value={reasoningSummary}
          onChange={(event) => setReasoningSummary(event.target.value)}
        />
      </label>
      <small>{reasoningSummary.length}/500</small>
      <details>
        <summary>Extended comments (optional)</summary>
        <textarea
          maxLength={2000}
          value={extendedComments}
          onChange={(event) => setExtendedComments(event.target.value)}
        />
        <small>{extendedComments.length}/2000</small>
      </details>
      <button type="button" onClick={save}>
        Save observation
      </button>
    </fieldset>
  );
}

function Single({
  label,
  values,
  onChange,
}: {
  label: string;
  values: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <select onChange={(event) => onChange(event.target.value)}>
        {values.map((value) => (
          <option key={value} value={value}>
            {value.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
