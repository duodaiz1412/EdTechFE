import {ButtonHTMLAttributes, forwardRef} from "react";
import {cn} from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-gray-900 text-white hover:bg-gray-800/80",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-200/70",
      ghost: "bg-transparent text-gray-500 hover:bg-gray-100/70",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50/70",
      danger: "bg-red-600 text-white hover:bg-red-700/70",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    const iconSizes = {
      sm: 14,
      md: 16,
      lg: 18,
      icon: 18,
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        ref={ref}
        onClick={onClick}
        {...props}
      >
        {loading && (
          <span className="loading loading-spinner loading-sm mr-2"></span>
        )}

        {!loading && leftIcon && (
          <span className="mr-2" style={{fontSize: iconSizes[size]}}>
            {leftIcon}
          </span>
        )}

        {children}

        {!loading && rightIcon && (
          <span className="ml-2" style={{fontSize: iconSizes[size]}}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
