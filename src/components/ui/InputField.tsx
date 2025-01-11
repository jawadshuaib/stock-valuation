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
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}:
      </label>
      <div className="relative">
        <input
          type="number"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
        />
      </div>
    </div>
  );
}

export default InputField;
