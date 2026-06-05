import React from 'react';

interface Props {
  success: boolean;
  message?: string;
}

export const PaymentResult: React.FC<Props> = ({ success, message }) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-4 ${
        success ? 'bg-emerald-50' : 'bg-red-50'
      }`}
    >
      <span className="text-3xl">{success ? '✅' : '❌'}</span>
      <div>
        <p
          className={`text-sm font-semibold ${
            success ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {success ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
        </p>
        {message && (
          <p className="text-xs text-slate-500 mt-0.5">{message}</p>
        )}
      </div>
    </div>
  );
};
