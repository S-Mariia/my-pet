'use client';

import React, { ReactNode, useEffect } from 'react';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import MainWrapper from '@/components/common/wrappers/MainWrapper/MainWrapper';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import Image from 'next/image';
import lightLogo from '../../../../public/images/logo/light-logo.svg';
import darkLogo from '../../../../public/images/logo/dark-logo.svg';
import userIcon from '../../../../public/images/icons/user.svg';
import userDark from '../../../../public/images/icons/user-dark.svg';
import {setLoading} from "@/redux/slices/loading/loadingSlice";

type NonAuthLayoutProps = {
  children: ReactNode
};

function NonAuthLayout({ children }:NonAuthLayoutProps) {
  const { user } = useAppSelector((state) => state.user);
  const { theme } = useAppSelector((state) => state.theme);
  const logo = theme === 'dark' ? darkLogo : lightLogo;
  const userImg = theme === 'dark' ? userDark : userIcon;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      dispatch(setLoading(true))
      router.push('/');
    }else {
      dispatch(setLoading(false))
    }
  }, [user]);
  return (
    <div className="h-full bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 dark:from-[#2A3240] dark:via-[#101113] dark:to-[#101113] dark:bg-[black] transition duration-300 ease-in-out">
      <MainWrapper>
        <div className="h-full flex items-center justify-between ">
          <div className="h-full w-[50%] flex flex-col justify-between">
            <Image src={logo} alt="Pow buddy" width={120} height={94} />
            <div
              className="w-full h-[70%] mt-[auto] relative bg-[url(/images/auth/dog.png)] bg-no-repeat bg-contain bg-bottom mb-[-40px]"
            />
          </div>
          <div className="w-[50%] flex flex-col h-full">
            <div className="flex justify-end"><ThemeSwitcher /></div>
            <div className="flex-1 flex items-center mt-[10px] w-full">
              <div className="bg-white dark:bg-dark-gray-bg w-[100%] p-[20px]  ml-[50px] rounded-2xl shadow-xl">
                <div className="bg-white dark:bg-dark-gray-bg rounded-full mx-[auto] w-[fit-content] mt-[-50px] p-[10px]">
                  <Image src={userImg} alt="user" height={50} width={50} />
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
}

export default NonAuthLayout;
