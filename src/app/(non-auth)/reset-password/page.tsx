"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { showSuccessToast, showErrorToast } from "@/utils/tostify";
import { useAppDispatch } from "@/redux/hooks";
import { setLoading } from "@/redux/slices/loading/loadingSlice";
import { authService } from "@/services/auth-service";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const t = params.get("access_token") || params.get("token");
      if (t) {
        setToken(t);
      } else {
        showErrorToast("Invalid or expired link");
      }
    } else {
      showErrorToast("Invalid or expired link");
    }
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      showErrorToast("Invalid or expired link");
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
        {
          method: "PUT",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: data.newPassword }),
        }
      );

      const result = await response.json();
      if (result?.error)
        throw new Error(result.error_description || result.error.message);

      showSuccessToast("Password successfully changed!");
      await authService.signOut();
      router.replace("/sign-in");
      dispatch(setLoading(false))
    } catch (err: any) {
      showErrorToast(err.message || "Failed to reset password");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-[400px] mx-auto p-5 bg-white dark:bg-dark-gray-bg rounded-2xl shadow-lg">
      <h2 className="text-center font-bold text-20px mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="newPassword"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <CustomInput
              type="password"
              placeholder="New password"
              value={field.value || ""}
              setValue={field.onChange}
            />
          )}
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === newPassword || "Passwords do not match",
          }}
          render={({ field }) => (
            <CustomInput
              type="password"
              placeholder="Confirm password"
              value={field.value || ""}
              setValue={field.onChange}
            />
          )}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <CustomButton type="submit" title="Reset Password" disabled={!token} />
      </form>
    </div>
  );
}
