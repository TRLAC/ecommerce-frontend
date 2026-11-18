import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const MAX = 255;

export const RequestRefundDialog: React.FC<Props> = ({ isOpen, isLoading, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  if (!isOpen) return null;

  const trimmed = reason.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-1 text-lg font-semibold text-slate-800">Yêu cầu hoàn tiền</h3>
        <p className="mb-4 text-sm text-slate-500">
          Hệ thống hoàn tiền toàn bộ đơn hàng. Quản trị viên sẽ duyệt yêu cầu của bạn.
        </p>

        <label htmlFor="refund-reason" className="mb-1.5 block text-sm font-medium text-slate-700">
          Lý do hoàn tiền <span className="text-red-500">*</span>
        </label>
        <textarea
          id="refund-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, MAX))}
          rows={4}
          placeholder="Ví dụ: sản phẩm lỗi, không đúng mô tả..."
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {reason.length}/{MAX}
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Quay lại
          </button>
          <button
            onClick={() => onConfirm(trimmed)}
            disabled={isLoading || !trimmed}
            className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </div>
      </div>
    </div>
  );
};
