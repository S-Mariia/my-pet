"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabase-client";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { Catamaran } from "next/font/google";
import { showErrorToast } from "@/utils/tostify";
import { authService } from "@/services/auth-service";

const catamaran = Catamaran({ weight: ["700"], subsets: ["latin"] });

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    try {
      await authService.signUp(email, password, `${firstName} ${lastName}`);

      router.replace("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "An unknown error occurred";
      showErrorToast(errorMessage);
    }
  };

  return (
    <>
      <h1
        className={`${catamaran.className} text-20px font-bold text-center text-dark-gray-text dark:text-white mb-[15px]`}
      >
        Create your account
      </h1>
      <p className="text-16px font-normal text-center text-input-text dark:text-input-border mb-[10px]">
        Hello there! Let’s create your account.
      </p>

      <div className="flex flex-col gap-[15px] mb-[20px]">
        <div className="flex gap-[10px]">
          <CustomInput
            type="text"
            value={firstName}
            placeholder="First Name"
            setValue={setFirstName}
          />
          <CustomInput
            type="text"
            value={lastName}
            placeholder="Last Name"
            setValue={setLastName}
          />
        </div>
        <CustomInput
          type="email"
          value={email}
          placeholder="Email"
          setValue={setEmail}
        />
        <CustomInput
          type="password"
          value={password}
          placeholder="Password"
          setValue={setPassword}
        />
        <CustomInput
          type="password"
          value={confirmPassword}
          placeholder="Confirm password"
          setValue={setConfirmPassword}
        />
      </div>

      <CustomButton
        type="button"
        title="Create my account"
        onClick={onSubmit}
        disabled={
          !email.trim() ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword
        }
      />
    </>
  );
}

export default SignUp;
