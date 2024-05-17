'use client';

import React, { useState } from 'react';
import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import CustomInput from '@/components/common/CustomInput/CustomInput';
import { Catamaran } from 'next/font/google';
import CustomButton from '@/components/common/CustomButton/CustomButton';
import {handleCreateUserCard} from "@/utils/createUserInDatabase";
import {showErrorToast} from "@/utils/tostify";

const catamaran = Catamaran({
  weight: ['700'],
  subsets: ['latin'],
});
function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const router = useRouter();

  const onSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      if (user) {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        await sendEmailVerification(user);
        await handleCreateUserCard(user)
      }

      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        const errorMessage = (typeof error === 'object' && 'message' in error) ? error.message : "An error occurred. Please try again later.";
        showErrorToast((errorMessage.includes('email-already-in-use') ? "An account with this mail already exists" : errorMessage) as string);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };
  return (
    <>
      <h1 className={`${catamaran.className} text-20px font-bold leading-150% text-center text-dark-gray-text dark:text-white mb-[15px]`}>Create your account</h1>
      <p className="text-16px font-normal leading-150% text-center text-input-text dark:text-input-border mb-[10px] ">Hello there! Let’s create your account.</p>
      <div className="flex flex-col gap-[15px] mb-[20px]">
        <div className="flex">
          <div className="w-[50%] pr-[10px]">
            <CustomInput type="text" value={firstName} placeholder="First Name" setValue={setFirstName} />
          </div>
          <div className="w-[50%] pl-[10px]">
            <CustomInput type="text" value={lastName} placeholder="Last Name" setValue={setLastName} />
          </div>
        </div>
        <CustomInput type="email" value={email} placeholder="Email" setValue={setEmail} />
        <CustomInput type="password" value={password} placeholder="Password" setValue={setPassword} />
        <CustomInput type="password" value={confirmPassword} placeholder="Confirm password" setValue={setConfirmPassword} />

      </div>
      <CustomButton type="button" title="Create my account" onClick={onSubmit} disabled={!email.trim() || !password || !confirmPassword || password !== confirmPassword} />
      <div className="flex gap-[10px] width-full justify-center mt-[15px]">
        <p className="text-14px text-500 leading-20px text-input-text dark:text-input-border">Joined us before?</p>
        <button
          type="button"
          onClick={() => router.push('/sign-in')}
          className="text-14px text-500 text-btn-blue-bg leading-20px hover:underline dark:text-white"
        >
          Login
        </button>
      </div>

    </>
  );
}

export default SignUp;
