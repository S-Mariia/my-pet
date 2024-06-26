import React from 'react';
import Image from 'next/image';
import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/redux/hooks";
import {setMobileMenu} from "@/redux/slices/mobileMenu/mobileMenu";

type SidebarMenuItemProps = {
    src: string,
    title: string,
    link: string
};

function SidebarMenuItem({
                             src, title, link,
                         }: SidebarMenuItemProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleClick = () => {
        router.push(link)
        dispatch(setMobileMenu(false))
    }

    return (
        <div className='flex gap-[12px] p-[12px] cursor-pointer hover:scale-[1.05] transition duration-300 ease-in-out'
             onClick={handleClick}>
            <Image src={src} alt={title} width={20} height={20}/> <p
            className='text-16px font-500 leading-125% text-input-text-dark'>{title}</p></div>

    );
}

export default SidebarMenuItem;
