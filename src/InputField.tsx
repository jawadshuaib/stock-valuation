import { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: number | string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

// Reusable Input Component
function InputField({ label, id, name, value, onChange }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
