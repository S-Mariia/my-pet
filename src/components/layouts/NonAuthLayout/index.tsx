"use client";

import React, { ReactNode, useEffect } from "react";
import MainWrapper from "@/components/common/wrappers/MainWrapper/MainWrapper";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import Image from "next/image";
import lightLogo from "../../../../public/images/logo/light-logo.svg";
import darkLogo from "../../../../public/images/logo/dark-logo.svg";
import userIcon from "../../../../public/images/icons/user.svg";
import userDark from "../../../../public/images/icons/user-dark.svg";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { setLoading } from "@/redux/slices/loading/loadingSlice";

type NonAuthLayoutProps = { children: ReactNode };

function NonAuthLayout({ children }: NonAuthLayoutProps) {
  const { user } = useAppSelector((state) => state.user);
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logo = theme === "dark" ? darkLogo : lightLogo;
  const userImg = theme === "dark" ? userDark : userIcon;

  useEffect(() => {
    const pathname = window.location.pathname;
    
    if (pathname.startsWith("/reset-password")) {
      dispatch(setLoading(false));
      return;
    }

    const token = localStorage.getItem("sb-vowclvwvxuwshulffuhr-auth-token");

    if (token) {
      dispatch(setLoading(true));
      router.replace("/");
      return;
    }

    dispatch(setLoading(false));
  }, [user, dispatch, router]);

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 dark:from-[#2A3240] dark:via-[#101113] dark:to-[#101113] transition duration-300 ease-in-out">
      <MainWrapper>
        <div className="h-full mid:flex-row flex-col flex items-center justify-between">
          <div className="mid:h-full h-[400px] min-h-[400px] mid:w-[50%] sm:w-[80%] w-full flex flex-col justify-between">
            <div className="h-[66px] w-[84px] max-h-[66px] max-w-[84px] mid:h-[94px] mid:w-[120px] mid:max-h-[94px] mid:max-w-[120px]">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={94}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-[-150px] mid:mt-[auto] w-full h-full mid:h-[70%] relative bg-[url(/images/auth/dog.png)] bg-no-repeat bg-contain bg-bottom mid:mb-[-40px]" />
          </div>
          <div className="mid:w-[50%] sm:w-[80%] w-full max-w-[500px] flex flex-col h-full z-[100] mt-[-300px] mid:mt-[auto]">
            <div className="flex justify-end">
              <ThemeSwitcher />
            </div>
            <div className="flex-1 max-h-[700px] mid:h-[auto] flex items-center mt-[10px] w-full">
              <div className="bg-white dark:bg-dark-gray-bg w-[100%] p-[20px] mid:ml-[50px] rounded-2xl shadow-xl">
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
