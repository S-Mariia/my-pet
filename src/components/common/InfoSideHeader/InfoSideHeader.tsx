'use client'
import React from 'react';
import Image from 'next/image';
import {useRouter} from "next/navigation";
import arrowDark from "@/../public/images/icons/arrow-left-dark.svg";
import arrowLight from "@/../public/images/icons/arrow-left-light.svg";
import {useAppSelector} from "@/redux/hooks";

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
    const router = useRouter();

    return (
        <div className='pt-[30px] mt-[-30px] sticky top-[-30px] bg-white dark:bg-sidebar-bg w-full z-10'>
            <div className='flex items-center mb-[20px]'>
                {arrow&& <button onClick={() => {
                    router.back()
                }}
                >
                    <Image src={arrowImg} alt="back" height={20} width={20}/>
                </button>}
                <div className='ml-[30px] pl-[15px] border-l-[1.5px] border-solid border-input-border dark:border-input-border-dark text-dark-gray-text dark:text-white'> <h2 className=' font-700 leading-136% text-28px'>{title}</h2>
                    {!!subtitle&&<small>{subtitle}</small>}
                </div>
            </div>
            <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>
        </div>
    );
}

export default InfoSideHeader;
