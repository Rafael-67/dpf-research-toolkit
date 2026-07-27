interface BarDatum {
  key: string;
  label: string;
  value: number;
}

export function AccessibleBarChart({
  title,
  description,
  data,
  emptyLabel,
}: {
  title: string;
  description: string;
  data: BarDatum[];
  emptyLabel: string;
}) {
  const titleId = useId();
  const visible = data.filter(({ value }) => value > 0);
  const maximum = Math.max(1, ...visible.map(({ value }) => value));
  return (
    <figure className="chart-card" aria-labelledby={titleId}>
      <figcaption id={titleId}>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
      {visible.length ? (
        <div
          className="bar-chart"
          role="img"
          aria-label={`${title}. ${visible
            .map(({ label, value }) => `${label}: ${value}`)
            .join("; ")}`}
        >
          {visible.map(({ key, label, value }) => (
            <div className="bar-row" key={key}>
              <span className="bar-label">{label}</span>
              <span className="bar-track" aria-hidden="true">
                <span
                  className="bar-fill"
                  style={{ width: `${(value / maximum) * 100}%` }}
                />
              </span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p role="status">{emptyLabel}</p>
      )}
    </figure>
  );
}

export function CompletionChart({
  value,
  title,
  description,
}: {
  value: number;
  title: string;
  description: string;
}) {
  const bounded = Math.max(0, Math.min(100, value));
  const formatted = bounded.toFixed(1);
  return (
    <figure className="chart-card completion-chart">
      <figcaption>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
      <div
        className="completion-ring"
        role="img"
        aria-label={`${title}: ${formatted}%`}
        style={{ "--chart-value": `${bounded * 3.6}deg` } as CSSProperties}
      >
        <span>{formatted}%</span>
      </div>
    </figure>
  );
}
import { useId, type CSSProperties } from "react";
