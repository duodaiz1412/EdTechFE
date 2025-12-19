import Select, {components, OptionProps} from "react-select";
import {Check} from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface CommonSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CommonSelect({
  value,
  options,
  onChange,
  placeholder = "Select...",
  isDisabled = false,
  isSearchable = false,
  className = "",
  size = "md",
}: CommonSelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select
      value={selectedOption}
      onChange={(option) => {
        onChange((option as SelectOption)?.value || "");
      }}
      options={options}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      closeMenuOnSelect
      closeMenuOnScroll
      menuPlacement="auto"
      className={`w-full ${className}`}
      styles={{
        control: (base) => ({
          ...base,
          "minHeight": size === "sm" ? "36px" : size === "lg" ? "56px" : "48px",
          "fontSize": size === "sm" ? "14px" : size === "lg" ? "18px" : "16px",
          "border": "1px solid #d1d5db",
          "borderRadius": "8px",
          "boxShadow": "none",
          "&:hover": {
            borderColor: "#9ca3af",
          },
          "&:focus-within": {
            borderColor: "#3b82f6",
            boxShadow: "0 0 0 1px #3b82f6",
          },
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9ca3af",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#111827",
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }),
        menuList: (base) => ({
          ...base,
          padding: "4px",
        }),
        option: (base, state) => ({
          ...base,
          "borderRadius": "6px",
          "margin": "2px 0",
          "padding": "8px 12px",
          "backgroundColor": state.isSelected
            ? "#3b82f6"
            : state.isFocused
              ? "#f3f4f6"
              : "transparent",
          "color": state.isSelected ? "white" : "#111827",
          "cursor": "pointer",
          "&:hover": {
            backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
          },
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          "color": "#6b7280",
          "&:hover": {
            color: "#374151",
          },
        }),
      }}
      components={{
        Option: (props: OptionProps<SelectOption>) => {
          return (
            <components.Option {...props}>
              <div className="flex justify-between items-center gap-2">
                <span>{props.children}</span>
                {props.isSelected && (
                  <div className="w-4 h-4 flex justify-center items-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            </components.Option>
          );
        },
      }}
    />
  );
}
