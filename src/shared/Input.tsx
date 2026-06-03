import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  showLabel?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = "",
      containerClassName = "",
      id,
      required,
      onFocusChange, 
      onFocus,       
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocusChange?.(true);
      onFocus?.(event);      
    };
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocusChange?.(false); 
      onBlur?.(event);       
    };
    return (
      <div className={`w-full ${containerClassName}`} >
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="mr-1 text-red-500">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          className={`w-full rounded-xl border px-4 py-3 outline-none transition text-right
            placeholder:text-gray-400 focus:ring-2
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }
            ${props.disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            ${className}`}
          {...props}
        />

        {error ? (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;