import React from "react";

type ErrorAlertProps = {
  message: string;
  className?: string;
};

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  className = "",
}) => {
  return (
    <div
      className={`text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
};