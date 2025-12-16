"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabase-client";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { Catamaran } from "next/font/google";
import { showSuccessToast, showErrorToast } from "@/utils/tostify";

const catamaran = Catamaran({
  weight: ["700"],
  subsets: ["latin"],
});

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [checkEmail, setCheckEmail] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email.trim()) return;
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password",
      });

      if (error) throw error;

      showSuccessToast("Check your email for password reset instructions!");
      setCheckEmail(true);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Failed to send reset email."
      );
    }
  };

  return checkEmail ? (
    <>
      <h1 className="text-white text-center text-2xl mb-5">
        A password reset email has been sent to <strong>{email}</strong>. <br />
        Please check your inbox and follow the instructions to reset your
        password.
      </h1>
      <button
        type="button"
        onClick={() => window.location.href = "/sign-in"}
        className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
      >
        Ready to log in
      </button>
    </>
  ) : (
    <>
      <h1
        className={`${catamaran.className} text-34px font-bold leading-42px text-center text-dark-gray-text dark:text-white mb-[20px]`}
      >
        Forgot Password
      </h1>
      <div className="flex flex-col gap-[20px] mb-[30px]">
        <CustomInput
          type="email"
          value={email}
          placeholder="Email"
          setValue={setEmail}
        />
      </div>
      <CustomButton
        type="button"
        title="Reset Password"
        onClick={handleForgotPassword}
      />
      <div className="flex items-center gap-[10px] mb-[20px] my-[20px]">
        <div className="w-full border-input-border border border-solid" />
        <span className="text-16px font-normal leading-20px text-center text-input-text dark:text-input-border">
          or
        </span>{" "}
        <div className="w-full border-input-border border border-solid" />
      </div>
      <div className="flex gap-[10px] width-full justify-center mt-[20px]">
        <p className="text-14px text-500 leading-20px text-input-text dark:text-input-border">
          Remember your password?
        </p>
        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="text-14px text-500 text-btn-blue-bg leading-20px hover:underline dark:text-white"
        >
          Login
        </button>
      </div>
    </>
  );
}

export default ForgotPassword;
