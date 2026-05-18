// ProfilePage.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

type ProfileFormValues = {
  fullName: string;
  phone: string;
  avatar?: FileList;
};
export default function ProfilePage() {
  const { data, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
     formState: { errors },
  } = useForm<ProfileFormValues>();

  const avatarFile = watch("avatar")?.[0];

  useEffect(() => {
    if (data) {
      setValue("fullName", data.fullName);
      setValue("phone", data.phone ?? "");
      setPreview(data.avatar ?? null);
    }
  }, [data, setValue]);

 useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [avatarFile]);

  const onSubmit = async (formData: ProfileFormValues) => {
   try {
      await updateProfile.mutateAsync({
        fullName: formData.fullName,
        phone: formData.phone,
        avatar: formData.avatar?.[0] ?? null,
      });
    } catch (error) {
      console.error("Update profile failed:", error);
    }
  };

   if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Profile
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your account information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="h-28 w-28 rounded-full border-4 border-slate-100 object-cover shadow-sm"
                onError={(e) => {          // ✅ fallback nếu URL vẫn lỗi
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-violet-500 text-4xl font-bold text-white shadow-sm">
                {data?.fullName?.charAt(0)}
              </div>
            )}

            <label className="mt-5 cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                {...register("avatar")}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500"
              placeholder="Enter your full name"
            />
            {/* ✅ Fix #6: Hiển thị lỗi validation */}
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              value={data?.email || ""}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              {...register("phone", {
                pattern: {
                  value: /^\+?[0-9]{9,11}$/,
                  message: "Invalid phone number format",
                },
              })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500"
              placeholder="Enter your phone number"
            />
            {/* ✅ Fix #6: Hiển thị lỗi validation */}
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full rounded-xl bg-violet-600 py-3 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}