// components/TextInput.tsx
import type { InputHTMLAttributes } from "react";
import { toEnglishDigits } from "../../hooks/pubFunc/formatNumber";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onValueChange?: (value: string) => void;
  error?: string;
}

export default function TextInput({
  onValueChange,
  error,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className="flex flex-col">
      <input
        {...props}
        
        onChange={(e) => onValueChange?.(toEnglishDigits(e.target.value))}
        aria-invalid={!!error}
        className={`bg-gray-700 text-white text-sm px-3 py-2 rounded outline-none
          border transition-colors
          ${
            error
              ? "border-red-400 focus:border-red-400"
              : "border-transparent focus:border-blue-500"
          }
          ${className}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
