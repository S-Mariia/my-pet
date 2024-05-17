'use client';

import React, {ReactNode, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {useRouter} from 'next/navigation';
import Sidebar from "@/components/Sidebar/Sidebar";
import {setLoading} from "@/redux/slices/loading/loadingSlice";


type AuthLayoutProps = {
    children: ReactNode
};

function AuthLayout({children}: AuthLayoutProps) {
    const {user} = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();


    const router = useRouter();

    useEffect(() => {
        if (!user&&localStorage.getItem("user")=='false') {
            dispatch(setLoading(true))
            router.push('/sign-in');
        }
        if(user)dispatch(setLoading(false))
    }, [user]);

    return (
        <div className='h-full backdrop-blur-[50px] bg-sidebar-bg dark:bg-black-bg p-[10px] flex'>
            {user && !(user.emailVerified)
                && (
                    <div className="fixed bg-orange-500 text-white text-center px-4 py-2  top-0 left-0 right-0 z-50">
                        Please check your email for verification. An email has been sent to{' '}{user.email}.
                    </div>
                )}

            <Sidebar/>

            <div id="main"
                className='w-full h-full bg-white dark:bg-sidebar-bg rounded-content-block py-[30px] px-[40px] ml-[10px] max-h-[100%] overflow-y-auto overflow-x-hidden relative'>
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;
