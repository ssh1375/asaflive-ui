// components/Checkbox.tsx
interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export default function Checkbox({ checked, onToggle }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-6 h-6 rounded border flex items-center justify-center transition-colors cursor-pointer
        ${
          checked
            ? "bg-blue-500 border-blue-500"
            : "border-gray-600 hover:border-gray-400 bg-transparent"
        }`}
    >
      {checked && (
        <svg viewBox="0 0 12 10" className="w-3 h-3">
          <path
            d="M1 5l3 4L11 1"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
