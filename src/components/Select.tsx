import {SelectHTMLAttributes, forwardRef} from "react";
import {cn} from "@/lib/utils";

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      placeholder,
      size = "md",
      options,
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full border border-gray-300 bg-white text-gray-900 rounded-lg",
            "focus:ring-2 focus:ring-gray-500 focus:border-transparent",
            "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            sizes[size],
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-xs text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
