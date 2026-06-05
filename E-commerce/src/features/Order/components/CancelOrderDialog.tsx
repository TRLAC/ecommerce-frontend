import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export const CancelOrderDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          Huỷ đơn hàng?
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          Bạn có chắc muốn huỷ đơn hàng này không? Hành động này không thể hoàn tác.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Lý do huỷ đơn (tuỳ chọn)..."
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none
            focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium
              text-slate-600 transition hover:bg-slate-50"
          >
            Quay lại
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white
              transition hover:bg-red-600 disabled:opacity-60"
          >
            {isLoading ? 'Đang huỷ...' : 'Xác nhận huỷ'}
          </button>
        </div>
      </div>
    </div>
  );
};
