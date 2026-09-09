import React from "react";

export const ComponentCard = ({
  title,
  desc,
  description,
  children,
  headerAction,
  className = "",
  bodyClassName = "",
}) => {
  const cardDesc = desc || description;

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs transition-all ${className}`}
    >
      {(title || cardDesc || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
          <div>
            {title && (
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
                {title}
              </h3>
            )}
            {cardDesc && (
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {cardDesc}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2 shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default ComponentCard;
