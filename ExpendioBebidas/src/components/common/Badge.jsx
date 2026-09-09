import React from "react";

const colorStyles = {
  light: {
    primary: "bg-brand-50 text-brand-600 border border-brand-200/60",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
    error: "bg-rose-50 text-rose-700 border border-rose-200/60",
    info: "bg-sky-50 text-sky-700 border border-sky-200/60",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/60",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200/70",
  },
  solid: {
    primary: "bg-brand-500 text-white",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    error: "bg-rose-600 text-white",
    info: "bg-sky-500 text-white",
    purple: "bg-purple-600 text-white",
    neutral: "bg-gray-800 text-white",
  },
};

const dotColors = {
  primary: "bg-brand-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
  info: "bg-sky-500",
  purple: "bg-purple-500",
  neutral: "bg-gray-500",
};

export const Badge = ({
  children,
  variant = "light",
  color = "primary",
  size = "md",
  dot = false,
  icon = null,
  className = "",
}) => {
  const variantMap = colorStyles[variant] || colorStyles.light;
  const colorClass = variantMap[color] || variantMap.primary;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeClasses[size] || sizeClasses.md} ${colorClass} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[color] || "bg-current"}`}
        />
      )}
      {icon && <span className="shrink-0 text-[0.85em]">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
