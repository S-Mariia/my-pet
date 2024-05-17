import React from 'react';
import Image from 'next/image';
import SidebarMenuItem from "@/components/common/SidebarMenuItem/SidebarMenuItem";
import dashboard from "../../../public/images/icons/Dashboard.svg";
import account from "../../../public/images/icons/Account.svg";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import out from "../../../public/images/icons/log-out.svg";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import darkLogo from "../../../public/images/logo/dark-gorizontal-logo.svg";
import lightLogo from "../../../public/images/logo/light-gorizontal-logo.svg";
import userDark from "../../../public/images/icons/user-dark.svg";
import userIcon from "../../../public/images/icons/user.svg";
import {signOut} from "firebase/auth";
import {auth} from "@/utils/firebase";
import {setUser} from "@/redux/slices/userAuth/userAuthSlice";

function Sidebar() {
    const {user} = useAppSelector((state) => state.user);
    const {theme} = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();

    const logo = theme === 'dark' ? darkLogo : lightLogo;
    const userImg = theme === 'dark' ? userDark : userIcon;


    return (
        <div className='min-w-[220px] w-[220px] m-[20px] flex flex-col max-h-[100%] overflow-y-auto overflow-x-hidden'>
            <Image src={logo} alt="Pow buddy" width={174} height={38} className='mb-[30px]'/>
            <div className="w-full border-line-border dark:border-dark-gray-bg border border-solid"/>
            <div className='flex-1 max-h-[100%] overflow-y-auto overflow-x-hidden'>
                {/*<div className='my-[30px] text-white dark:text-input-border'>*/}
                {/*    <p className='text-16px font-500 leading-22px'>Your pets</p>*/}
                {/*    <button type='button'*/}
                {/*            className='h-[60px] w-[60px] flex items-center justify-center dark:bg-sidebar-bg bg-black-bg rounded-full border-[1.5px] border-solid border-circle-border my-[12px]'>*/}
                {/*        <Image src={plus} alt="add new" width={24} height={24}/></button>*/}
                {/*    <p className='text-14px font-400 leading-22px text-circle-border'>add new</p>*/}
                {/*</div>*/}

                {/*<div className="w-full border-line-border dark:border-dark-gray-bg border border-solid"/>*/}

                <div className='my-[30px] text-white dark:text-input-border flex flex-col '>
                    <SidebarMenuItem src={dashboard} title={'Pets list'} link={'/pets-list'}/>
                    {/*<SidebarMenuItem src={contacts} title={'Contacts'} link={'/'}/>*/}
                    <SidebarMenuItem src={account} title={'Account'} link={'/account'}/>
                    {/*<SidebarMenuItem src={calendar} title={'Calendar'} link={'/'}/>*/}
                </div>

                <div className='w-fit mb-[20px]'><ThemeSwitcher/></div>
            </div>
            <div className='flex items-center gap-3 p-3 rounded-input bg-light-bg mt-[20px]'>
                <div className="bg-white dark:bg-dark-gray-bg rounded-full w-[fit-content] ">
                    <Image src={user?.photoURL||userImg} alt="user" height={80} width={80} className="w-full aspect-square h-full object-cover rounded-full"/>
                </div>
                <p className='text-16px font-600 text-white leading-144%'><span className='text-light-text text-14px font-400 leading-157% '>hello</span> {user?.displayName}</p>
                <button className='w-[40px] h-[40px] hover:scale-[1.05] transition duration-300 ease-in-out' onClick={() => {
                    localStorage.setItem('user', 'false');
                    signOut(auth);
                    dispatch(setUser(null));
                }}><Image
                    src={out} alt="log-out" height={20} width={20}/></button>
            </div>
        </div>

    );
}

export default Sidebar;
