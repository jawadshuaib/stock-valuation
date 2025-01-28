import React from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
        type="number"
      />
    </div>
  );
};

export default InputField;
// import React, { ChangeEvent } from 'react';

// interface InputFieldProps {
//   label: string;
//   id: string;
//   name: string;
//   value: number | string;
//   placeholder?: string;
//   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
// }

// // Reusable Input Component
// function InputField({
//   label,
//   id,
//   name,
//   value,
//   placeholder,
//   onChange,
// }: InputFieldProps) {
//   return (
//     <div>
//       <label
//         htmlFor={id}
//         className="block text-sm font-medium text-gray-700 mb-2"
//       >
//         {label}:
//       </label>
//       <div className="relative">
//         <input
//           type="number"
//           id={id}
//           name={name}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder && placeholder}
//           className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
//         />
//       </div>
//     </div>
//   );
// }

// export default InputField;
