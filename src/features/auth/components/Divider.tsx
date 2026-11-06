import React from "react";

type DividerProps = {
  label?: string;
  className?: string;
};

export const Divider: React.FC<DividerProps> = ({
  label = "hoặc",
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 my-5 ${className}`}>
      <div className="flex-1 h-px bg-gray-200" />
      
      <span className="text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </span>

      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
};