import React from 'react';

interface Props {
  isLoading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}

export const PlaceOrderButton: React.FC<Props> = ({
  isLoading,
  disabled,
  onClick,
  label = 'Đặt hàng',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5
        text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all
        hover:bg-violet-700 active:scale-95
        disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
    >
      {isLoading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
            <path
              d="M4 12a8 8 0 018-8"
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>
          Đang xử lý...
        </>
      ) : (
        <>
          <span>🛍️</span>
          {label}
        </>
      )}
    </button>
  );
};
