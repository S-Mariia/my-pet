'use client';

import React, {ReactNode, useEffect } from 'react';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {useRouter} from 'next/navigation';
import Sidebar from "@/components/Sidebar/Sidebar";
import {setLoading} from "@/redux/slices/loading/loadingSlice";
import Image from "next/image";
import darkX from "../../../../public/images/icons/dark-close.svg";
import lightX from "../../../../public/images/icons/close.svg";
import {setMobileMenu} from "@/redux/slices/mobileMenu/mobileMenu";


type AuthLayoutProps = {
    children: ReactNode
};

function AuthLayout({children}: AuthLayoutProps) {
    const {user} = useAppSelector((state) => state.user);
    const {theme} = useAppSelector((state) => state.theme);
    const {mobileMenu} = useAppSelector((state) => state.mobileMenu);

    const dispatch = useAppDispatch();
    const x = theme === 'dark' ? darkX : lightX;

    const router = useRouter();

    useEffect(() => {
        if (!user&&localStorage.getItem("user")=='false') {
            dispatch(setLoading(true))
            router.push('/sign-in');
        }
        if(user)dispatch(setLoading(false))
    }, [user]);

    const handleCloseMenu=()=>{
        dispatch(setMobileMenu(false))
    }

    return (
        <div className='h-full backdrop-blur-[50px] bg-sidebar-bg dark:bg-black-bg mid:p-[10px] flex'>
            {user && !(user.emailVerified)
                && (
                    <div className="fixed bg-orange-500 text-white text-center px-4 py-2  top-0 left-0 right-0 z-50">
                        Please check your email for verification. An email has been sent to{' '}{user.email}.
                    </div>
                )}
            <div className='h-full mid:block hidden'> <Sidebar/></div>
            {mobileMenu&&<div className='mid:hidden h-full mid:relative fixed z-[1000000] backdrop-blur-[40px] bg-black-bg-04 mobile'><Sidebar/>
                <button
                    onClick={handleCloseMenu}
                    className="absolute sm:right-[32px] z-[10000000] right-[35px] top-[35px] text-brown-500 font-semibold text-base leading-[11px] mb-4 mid:hidden"
                >
                    <Image src={x} alt={"Close"}
                           width={24} height={24}
                           className={"h-[24px] w-[24px]"}/>
                </button>
            </div>}

            <div id="main"
                className='w-full h-full bg-white dark:bg-sidebar-bg mid:rounded-content-block py-[30px] md:px-[40px] px-[25px] mid:ml-[10px] max-h-[100%] overflow-y-auto overflow-x-hidden relative'>
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;
