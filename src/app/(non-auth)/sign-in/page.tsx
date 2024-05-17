'use client';

import React, {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {
    auth, signInWithSocialPopup, google, ProviderType,
} from '@/utils/firebase';
import CustomInput from '@/components/common/CustomInput/CustomInput';
import {Catamaran} from 'next/font/google';
import CustomButton from '@/components/common/CustomButton/CustomButton';
import {setLoading} from "@/redux/slices/loading/loadingSlice";
import {useAppDispatch} from "@/redux/hooks";
import {showErrorToast} from "@/utils/tostify";

const catamaran = Catamaran({
    weight: ['700'],
    subsets: ['latin'],
});

function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('user', 'true');
            setEmail('');
            setPassword('');
            dispatch(setLoading(true))
            router.push('/');
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                const errorMessage = (typeof error === 'object' && 'message' in error) ? error.message : "An error occurred. Please try again later.";
                showErrorToast((errorMessage.includes('invalid-credential') ? "Incorrect login or password" : errorMessage) as string);
            } else {
                console.error('An unknown error occurred:', error);
            }
        }
    };

    const logGoogleUser = async (type: ProviderType) => {
        try {
            await signInWithSocialPopup(type);
            localStorage.setItem('user', 'true');
            router.push('/');
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                const errorMessage = (typeof error === 'object' && 'message' in error) ? error.message : "An error occurred. Please try again later.";
                showErrorToast((errorMessage) as string);
            } else {
                console.error('An unknown error occurred:', error);
            }
        }
    };

    return (
        <>
            <h1 className={`${catamaran.className} text-20px font-bold leading-150% text-center text-dark-gray-text dark:text-white mb-[10px]`}>Login</h1>
            <p className="text-16px font-normal leading-150% text-center text-input-text dark:text-input-border mb-[15px] ">Welcome
                back! Please enter your details.</p>
            <div className="flex flex-col gap-[15px] mb-[15px]">

                <CustomInput type="email" value={email} placeholder="Email" setValue={setEmail}/>
                <CustomInput type="password" value={password} placeholder="Password" setValue={setPassword}/>
            </div>
            <CustomButton type="button" title="Login" onClick={handleSignIn} disabled={!email.trim() || !password}/>
            <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="w-full p-[10px] my-[5px] text-14px text-500 text-btn-blue-bg leading-20px hover:underline dark:text-white"
            >
                Forgot password?
            </button>
            <div className="flex items-center gap-[10px] mb-[20px]">
                <div className="w-full border-input-border border border-solid"/>
                <span
                    className="text-16px font-normal leading-20px text-center text-input-text dark:text-input-border">or</span>
                {' '}
                <div className="w-full border-input-border border border-solid"/>
            </div>
            <CustomButton type="button" title="Login with Google" onClick={() => logGoogleUser(google)} google/>
            <div className="flex gap-[10px] width-full justify-center mt-[20px]">
                <p className="text-14px text-500 leading-20px text-input-text dark:text-input-border">First time
                    here?</p>
                <button
                    type="button"
                    onClick={() => router.push('/sign-up')}
                    className="text-14px text-500 text-btn-blue-bg leading-20px hover:underline dark:text-white"
                >
                    Sign up for free
                </button>
            </div>
            {/* <button */}
            {/*  type="button" */}
            {/*  onClick={() => logGoogleUser(facebook)} */}
            {/*  className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500" */}
            {/* > */}
            {/*  By Facebook */}
            {/* </button> */}
        </>
    );
}

export default SignIn;
