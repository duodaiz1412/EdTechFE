import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export interface ChipProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  onRemove?: () => void;
  removable?: boolean;
}

const Chip = ({
  children,
  variant = "default",
  size = "sm",
  className,
  onClick,
  onRemove,
  removable = false,
}: ChipProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        "transition-colors duration-200",
        variants[variant],
        sizes[size],
        onClick && "cursor-pointer hover:opacity-80",
        className,
      )}
      onClick={onClick}
    >
      {children}
      {removable && onRemove && (
        <button
          type="button"
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          <svg
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Chip;
