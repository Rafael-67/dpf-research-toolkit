export function RatingScale({
  name,
  label,
  value,
  max,
  onChange,
}: {
  name: string;
  label: string;
  value: number | null;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset className="rating">
      <legend>{label}</legend>
      <div>
        {Array.from({ length: max }, (_, i) => i + 1).map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
