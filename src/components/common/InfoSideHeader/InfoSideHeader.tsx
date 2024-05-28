'use client'
import React from 'react';
import Image from 'next/image';
import {useRouter} from "next/navigation";
import arrowDark from "@/../public/images/icons/arrow-left-dark.svg";
import arrowLight from "@/../public/images/icons/arrow-left-light.svg";
import menu from "@/../public/images/icons/menu.svg";
import menuDark from "@/../public/images/icons/menu-dark.svg"

import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setMobileMenu} from "@/redux/slices/mobileMenu/mobileMenu";

type InfoSideHeaderProps = {
    title: string;
    subtitle?: string;
    arrow?: boolean
};
function InfoSideHeader({
                          title, arrow = true, subtitle
                      }:InfoSideHeaderProps) {
    const {theme} = useAppSelector((state) => state.theme);
    const arrowImg = theme === 'dark' ? arrowDark : arrowLight;
    const menuIcon = theme === 'dark' ? menuDark : menu;

    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <div className='pt-[30px] mt-[-30px] sticky top-[-30px] bg-white dark:bg-sidebar-bg w-full z-10'>
            <div className='flex items-center mb-[20px] justify-between'>
               <div className='h-full flex items-center'>
                   {arrow&& <button onClick={() => {
                       router.back()
                   }}
                    className='mr-[30px] flex items-center min-h-[40px] pr-[15px] border-r-[1.5px] border-solid border-input-border dark:border-input-border-dark'>
                       <Image src={arrowImg} alt="back" height={20} width={20}/>
                   </button>}
                   <div className=' text-dark-gray-text dark:text-white'> <h2 className=' font-700 leading-136% sm:text-28px text-24px'>{title}</h2>
                       {!!subtitle&&<small>{subtitle}</small>}
                   </div>
               </div>
                <div className='flex items-center mid:hidden' onClick={()=>{dispatch(setMobileMenu(true))}}>
                    <Image src={menuIcon} alt={"Open menu"}
                           width={24} height={24}
                           className={"h-[24px] w-[24px]"}/>
                </div>
            </div>
            <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>
        </div>
    );
}

export default InfoSideHeader;
