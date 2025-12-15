"use client";

import React from "react";
import Image from "next/image";
import SidebarMenuItem from "@/components/common/SidebarMenuItem/SidebarMenuItem";
import dashboard from "../../../public/images/icons/Dashboard.svg";
import account from "../../../public/images/icons/Account.svg";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import out from "../../../public/images/icons/log-out.svg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import darkLogo from "../../../public/images/logo/dark-gorizontal-logo.svg";
import lightLogo from "../../../public/images/logo/light-gorizontal-logo.svg";
import userDark from "../../../public/images/icons/user-dark.svg";
import userIcon from "../../../public/images/icons/user.svg";
import { setUser } from "@/redux/slices/userAuth/userAuthSlice";
import { setLoading } from "@/redux/slices/loading/loadingSlice";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";


function Sidebar() {
  const { user } = useAppSelector((state) => state.user);
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logo = theme === "dark" ? darkLogo : lightLogo;
  const userImg = theme === "dark" ? userDark : userIcon;

  const handleSignOut = async () => {
    try {
      dispatch(setLoading(true));

      await authService.signOut();

      dispatch(setUser(null));

      localStorage.removeItem("sb-vowclvwvxuwshulffuhr-auth-token");
      router.replace("/sign-in");
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-w-[220px] mid:w-[220px] w-[100vw] mid:m-[20px] flex flex-col max-h-[100%] h-[95%] overflow-y-auto overflow-x-hidden mid:p-0 p-6">
      <Image
        src={logo}
        alt="Pow buddy"
        width={174}
        height={38}
        className="mb-[30px]"
      />
      <div className="w-full border-line-border dark:border-dark-gray-bg border border-solid" />
      <div className="flex-1 max-h-[100%] overflow-y-auto overflow-x-hidden">
        <div className="my-[30px] text-white dark:text-input-border flex flex-col ">
          <SidebarMenuItem
            src={dashboard}
            title={"Pets list"}
            link={"/pets-list"}
          />
          <SidebarMenuItem src={account} title={"Account"} link={"/account"} />
        </div>

        <div className="w-fit mb-[20px]">
          <ThemeSwitcher />
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 rounded-input bg-light-bg mt-[20px]">
        <div className="bg-white dark:bg-dark-gray-bg rounded-full w-[fit-content] max-w-[60px]">
          <Image
            src={user?.photoURL || userImg}
            alt="user"
            height={60}
            width={60}
            className="w-full aspect-square h-full object-cover rounded-full"
          />
        </div>
        <p className="text-16px font-600 text-white leading-144%">
          <span className="text-light-text text-14px font-400 leading-157%">
            hello
          </span>{" "}
          {user?.displayName}
        </p>
        <button
          className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] hover:scale-[1.05] transition duration-300 ease-in-out"
          onClick={handleSignOut}
        >
          <Image
            src={out}
            alt="log-out"
            height={20}
            width={20}
            className="w-full aspect-square h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
