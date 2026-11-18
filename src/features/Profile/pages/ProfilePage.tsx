import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { Field } from "@/features/auth/components/Field";
import { btnCls } from "@/shared/components/Button";
import { toast } from "@/shared/lib/toast";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // BE: multipart max-file-size=5MB

const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

export default function ProfilePage() {
  const { data, isLoading, isError, refetch } = useProfile();
  const update = useUpdateProfile();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgBroken, setImgBroken] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ defaultValues: { email: "", fullName: "", phone: "", address: "" } });

  // Nạp dữ liệu từ BE vào form
  useEffect(() => {
    if (!data) return;
    reset({ email: data.email, fullName: data.fullName, phone: data.phone ?? "", address: data.address ?? "" });
    setAvatarFile(null);
    setImgBroken(false);
  }, [data, reset]);

  // Preview ảnh mới chọn (ưu tiên) hoặc avatar hiện tại
  useEffect(() => {
    if (!avatarFile) {
      setPreview(data?.avatar ?? null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setPreview(url);
    setImgBroken(false);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile, data?.avatar]);

  const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Vui lòng chọn file ảnh");
    if (file.size > MAX_AVATAR_BYTES) return toast.error("Ảnh tối đa 5MB");
    setAvatarFile(file);
  };

  const onSubmit = (v: FormValues) => {
    update.mutate({
      fullName: v.fullName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      address: v.address.trim(),
      avatar: avatarFile,
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-4 px-4 py-8">
        <div className="h-40 rounded-3xl bg-slate-100" />
        <div className="h-80 rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center" role="alert">
        <p className="mb-4 text-sm text-slate-500">Không tải được hồ sơ.</p>
        <button onClick={() => void refetch()} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
          Thử lại
        </button>
      </div>
    );
  }

  const initial = data.fullName?.charAt(0).toUpperCase() || "?";
  const canSave = (isDirty || !!avatarFile) && !update.isPending;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        {/* Banner + avatar */}
        <div className="h-28 bg-gradient-to-r from-violet-600 to-fuchsia-500" />
        <div className="-mt-14 flex flex-col items-center px-6">
          <div className="relative">
            {preview && !imgBroken ? (
              <img
                src={preview}
                alt="Ảnh đại diện"
                className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-md"
                onError={() => setImgBroken(true)}
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-violet-500 text-4xl font-bold text-white shadow-md">
                {initial}
              </div>
            )}
            <label
              className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white shadow transition hover:bg-violet-700"
              title="Đổi ảnh đại diện"
            >
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
            </label>
          </div>
          <h1 className="mt-3 text-xl font-bold text-slate-900">{data.fullName}</h1>
          <p className="text-sm text-slate-500">{data.email}</p>
          {avatarFile && <p className="mt-1 text-xs text-violet-600">Ảnh mới: {avatarFile.name} (bấm Lưu để áp dụng)</p>}
        </div>

        {/* Fields */}
        <div className="space-y-5 p-6 sm:p-8">
          <Field label="Email" htmlFor="email" error={errors.email?.message} hint="Email cũng là tên đăng nhập của bạn">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`${inputCls} pl-10`}
                {...register("email", {
                  required: "Vui lòng nhập email",
                  maxLength: { value: 255, message: "Tối đa 255 ký tự" },
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ" },
                })}
              />
            </div>
          </Field>

          <Field label="Họ và tên" htmlFor="fullName" error={errors.fullName?.message}>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="fullName"
                className={`${inputCls} pl-10`}
                placeholder="Nhập họ và tên"
                {...register("fullName", {
                  required: "Vui lòng nhập họ và tên",
                  minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
                  maxLength: { value: 100, message: "Tối đa 100 ký tự" },
                })}
              />
            </div>
          </Field>

          <Field label="Số điện thoại" htmlFor="phone" error={errors.phone?.message}>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="phone"
                inputMode="tel"
                className={`${inputCls} pl-10`}
                placeholder="VD: 0901234567"
                {...register("phone", {
                  pattern: { value: /^\+?[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ (9–11 chữ số)" },
                })}
              />
            </div>
          </Field>

          <Field label="Địa chỉ nhận hàng" htmlFor="address" error={errors.address?.message} hint="Dùng làm địa chỉ mặc định khi đặt hàng">
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <textarea
                id="address"
                rows={2}
                className={`${inputCls} h-auto resize-none py-3 pl-10`}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                {...register("address", { maxLength: { value: 255, message: "Tối đa 255 ký tự" } })}
              />
            </div>
          </Field>

          <button type="submit" disabled={!canSave} className={btnCls}>
            {update.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
