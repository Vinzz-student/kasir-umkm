type SelectOption = {
  label: string;
  value: string | number;
};

type SelectProps = {
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
  className = "",
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      required={required}
      className={`form-input ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
