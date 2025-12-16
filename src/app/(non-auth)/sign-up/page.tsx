"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async () => {
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.signUp(email, password, `${firstName} ${lastName}`);
      setEmailSent(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-[50px]">
        <h2 className={`${catamaran.className} text-20px font-bold mb-4`}>
          Confirm your email
        </h2>
        <p className="text-16px mb-4">
          A confirmation link has been sent to <b>{email}</b>. <br />
          Please check your inbox and click the link to activate your account.
        </p>
        <p className="text-14px text-gray-300">
          After confirmation, you will be redirected to sign in automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-[30px]">
      <h1
        className={`${catamaran.className} text-20px font-bold text-center text-dark-gray-text dark:text-white mb-[15px]`}
      >
        Create your account
      </h1>
      <p className="text-16px font-normal text-center text-input-text dark:text-input-border mb-[20px]">
        Hello there! Let’s create your account.
      </p>

      <div className="flex flex-col gap-[15px] mb-[20px] w-full max-w-[400px]">
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
        title={loading ? "Creating account..." : "Create my account"}
        onClick={onSubmit}
        disabled={
          !email.trim() ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword ||
          loading
        }
      />
    </div>
  );
}

export default SignUp;
