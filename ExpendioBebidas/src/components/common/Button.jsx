import React from "react";

const variantStyles = {
  primary:
    "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-theme-xs focus:ring-4 focus:ring-brand-500/20 border border-transparent",
  secondary:
    "bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 shadow-theme-xs focus:ring-4 focus:ring-gray-200",
  success:
    "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-theme-xs focus:ring-4 focus:ring-emerald-500/20 border border-transparent",
  danger:
    "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-theme-xs focus:ring-4 focus:ring-rose-500/20 border border-transparent",
  warning:
    "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-theme-xs focus:ring-4 focus:ring-amber-500/20 border border-transparent",
  outline:
    "bg-transparent hover:bg-brand-50 text-brand-600 border border-brand-300 focus:ring-4 focus:ring-brand-500/10",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-600 active:bg-gray-200 border border-transparent",
};

const sizeStyles = {
  xs: "px-2.5 py-1.5 text-xs rounded-lg gap-1.5",
  sm: "px-3 py-2 text-xs sm:text-sm rounded-xl gap-2",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2 font-medium",
  lg: "px-5 py-3 text-base rounded-xl gap-2.5 font-semibold",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button;
