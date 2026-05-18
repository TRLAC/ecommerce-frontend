import React from "react";

type FieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export const Field: React.FC<FieldProps> = ({
  label,
  children,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {children}
    </div>
  );
};