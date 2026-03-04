import type { ChangeEvent } from "react";

interface LocationInputProps {
  value: string;
  isSubbed: boolean;
  onChange: (newValue: string) => void;
}

export function LocationInput({ value, isSubbed, onChange }: LocationInputProps) {
  const className = isSubbed ? "inputContainer subbed" : "inputContainer";

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <div className={className}>
      <label htmlFor="location-input">Where are they?</label>
      <input
        id="location-input"
        value={value}
        onChange={handleChange}
        placeholder="City"
        autoComplete="off"
        aria-label="Location"
      />
    </div>
  );
}
