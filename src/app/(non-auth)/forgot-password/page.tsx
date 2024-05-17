'use client';

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/utils/firebase';
import CustomInput from '@/components/common/CustomInput/CustomInput';
import CustomButton from '@/components/common/CustomButton/CustomButton';
import { Catamaran } from 'next/font/google';

const catamaran = Catamaran({
  weight: ['700'],
  subsets: ['latin'],
});
function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [checkEmail, setCheckEmail] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setCheckEmail(true);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  return (checkEmail ? (
    <>
      <h1 className="text-white text-center text-2xl mb-5">
        An email for password reset has been successfully sent to your email address
        {email}
        . Please check your email and follow the instructions in the message to reset your password.
      </h1>
      <button
        type="button"
        onClick={() => router.push('/sign-in')}
        className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
      >
        Ready to log in
      </button>
    </>
  ) : (
    <>
      <h1 className={`${catamaran.className} text-34px font-bold leading-42px text-center text-dark-gray-text dark:text-white mb-[20px]`}>Forgot Password</h1>
      <div className="flex flex-col gap-[20px] mb-[30px]">
        <CustomInput type="email" value={email} placeholder="Email" setValue={setEmail} />
      </div>
      <CustomButton type="button" title="Reset Password" onClick={handleForgotPassword} />
      <div className="flex items-center gap-[10px] mb-[20px] my-[20px]">
        <div className="w-full border-input-border border border-solid" />
        <span className="text-16px font-normal leading-20px text-center text-input-text dark:text-input-border">or</span>
        {' '}
        <div className="w-full border-input-border border border-solid" />
      </div>
      <div className="flex gap-[10px] width-full justify-center mt-[20px]">
        <p className="text-14px text-500 leading-20px text-input-text dark:text-input-border">Joined us before and remember your password?</p>
        <button
          type="button"
          onClick={() => router.push('/sign-in')}
          className="text-14px text-500 text-btn-blue-bg leading-20px hover:underline dark:text-white"
        >
          Login
        </button>
      </div>
    </>
  )

  );
}

export default ForgotPassword;
