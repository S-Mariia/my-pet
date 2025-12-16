"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { showSuccessToast, showErrorToast } from "@/utils/tostify";
import { useAppDispatch } from "@/redux/hooks";
import { setLoading } from "@/redux/slices/loading/loadingSlice";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

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
  }, [dispatch]);

  const handleReset = async () => {
    if (!token) {
      showErrorToast("Invalid or expired link");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    setLoading(true);
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
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const data = await response.json();

      if (data?.error)
        throw new Error(data.error_description || data.error.message);

      showSuccessToast("Password successfully changed!");
      router.replace("/sign-in");
    } catch (err: any) {
      showErrorToast(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto p-5 bg-white dark:bg-dark-gray-bg rounded-2xl shadow-lg">
      <h2 className="text-center font-bold text-20px mb-4">Reset Password</h2>
      <div className="flex flex-col gap-4">
        <CustomInput
          type="password"
          value={newPassword}
          placeholder="New password"
          setValue={setNewPassword}
        />
        <CustomInput
          type="password"
          value={confirmPassword}
          placeholder="Confirm password"
          setValue={setConfirmPassword}
        />
        <CustomButton
          type="button"
          title={"Reset Password"}
          onClick={handleReset}
          disabled={!newPassword || !confirmPassword || !token}
        />
      </div>
    </div>
  );
}
