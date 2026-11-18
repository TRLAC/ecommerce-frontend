import { useState } from "react";
import type { FormEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Modal, fieldCls } from "./AdminUI";
import { useAllCategories, useSaveProduct } from "../hooks/useAdmin";
import { useBrands } from "@/features/Product/hooks/useBrand";
import type { ProductResponse, ProductStatus } from "@/features/Product/types";
import type { ProductPayload } from "../types";

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: "ACTIVE", label: "Đang bán" },
  { value: "INACTIVE", label: "Đã ẩn" },
  { value: "OUT_OF_STOCK", label: "Hết hàng" },
  { value: "DISCONTINUED", label: "Ngừng kinh doanh" },
];

const toStr = (n?: number | null) => (n == null ? "" : String(n));
const toNum = (s: string): number | undefined => (s.trim() === "" ? undefined : Number(s));

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

interface Props {
  open: boolean;
  product: ProductResponse | null; // null = tạo mới
  onClose: () => void;
}

export default function ProductFormDialog({ open, product, onClose }: Props) {
  // key={product?.productId} ở nơi gọi → mỗi lần mở là form mới, không cần useEffect reset
  const isEdit = product !== null;
  const { brands } = useBrands();
  const cats = useAllCategories();
  const save = useSaveProduct();

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(toStr(product?.price));
  const [stock, setStock] = useState(toStr(product?.stockQuantity ?? 0));
  const [brandId, setBrandId] = useState(toStr(product?.brandId));
  const [categoryId, setCategoryId] = useState(toStr(product?.categoryId));
  const [ram, setRam] = useState(toStr(product?.ram));
  const [storage, setStorage] = useState(toStr(product?.storage));
  const [battery, setBattery] = useState(toStr(product?.battery));
  const [screen, setScreen] = useState(toStr(product?.screenSize));
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "ACTIVE");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onPickFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    if (picked.some((f) => f.size > 5 * 1024 * 1024)) return setError("Mỗi ảnh tối đa 5MB");
    if (picked.some((f) => !f.type.startsWith("image/"))) return setError("Chỉ nhận file ảnh");
    setError(null);
    setFiles(picked);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const p = Number(price);
    const s = Number(stock);
    if (!name.trim()) return setError("Nhập tên sản phẩm");
    if (!Number.isFinite(p) || p < 1) return setError("Giá phải từ 1 VND");
    if (!Number.isInteger(s) || s < 0) return setError("Tồn kho phải là số nguyên ≥ 0");
    if (!brandId || !categoryId) return setError("Chọn thương hiệu và danh mục");
    setError(null);

    const body: ProductPayload = {
      name: name.trim(),
      price: p,
      stockQuantity: s,
      brandId: Number(brandId),
      categoryId: Number(categoryId),
      ram: toNum(ram),
      storage: toNum(storage),
      battery: toNum(battery),
      screenSize: toNum(screen),
      ...(isEdit ? { status } : {}),
    };
    save.mutate({ id: product?.productId, body, files }, { onSuccess: onClose });
  };

  return (
    <Modal open={open} title={isEdit ? `Sửa sản phẩm #${product?.productId}` : "Thêm sản phẩm"} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Tên sản phẩm *">
          <input className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={255} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Giá (VND) *">
            <input className={fieldCls} type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} />
          </Field>
          <Field label="Tồn kho *">
            <input className={fieldCls} type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} />
          </Field>
          <Field label="Thương hiệu *">
            <select className={fieldCls} value={brandId} onChange={(e) => setBrandId(e.target.value)}>
              <option value="">— Chọn —</option>
              {brands.map((b) => (
                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
              ))}
            </select>
          </Field>
          <Field label="Danh mục *">
            <select className={fieldCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">— Chọn —</option>
              {(cats.data ?? [])
                .filter((c) => c.status === "ACTIVE" || String(c.categoryId) === categoryId)
                .map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="RAM (GB)">
            <input className={fieldCls} type="number" min={1} value={ram} onChange={(e) => setRam(e.target.value)} />
          </Field>
          <Field label="Bộ nhớ (GB)">
            <input className={fieldCls} type="number" min={1} value={storage} onChange={(e) => setStorage(e.target.value)} />
          </Field>
          <Field label="Pin (mAh)">
            <input className={fieldCls} type="number" min={1} value={battery} onChange={(e) => setBattery(e.target.value)} />
          </Field>
          <Field label="Màn hình (inch)">
            <input className={fieldCls} type="number" step="0.1" min={0} value={screen} onChange={(e) => setScreen(e.target.value)} />
          </Field>
        </div>
        {isEdit && (
          <p className="-mt-2 text-[11px] text-slate-400">Để trống = giữ nguyên giá trị cũ (BE chưa hỗ trợ xoá thông số đã có).</p>
        )}

        {isEdit && (
          <Field label="Trạng thái">
            <select className={fieldCls} value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Ảnh sản phẩm" hint={isEdit ? "Ảnh mới sẽ được THÊM vào ảnh hiện có (tối đa 5MB/ảnh)." : "Tối đa 5MB/ảnh, chọn được nhiều ảnh."}>
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-3">
            <ImagePlus size={20} className="text-slate-400" />
            <input type="file" accept="image/*" multiple onChange={(e) => onPickFiles(e.target.files)} className="text-xs text-slate-500" />
          </div>
          {isEdit && product && product.images.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {product.images.map((src) => (
                <img key={src} src={src} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-slate-100 object-cover" />
              ))}
            </div>
          )}
        </Field>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
            Huỷ
          </button>
          <button
            type="submit"
            disabled={save.isPending}
            className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {save.isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}