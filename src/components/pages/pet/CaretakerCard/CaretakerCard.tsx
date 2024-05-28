import React from 'react';
import Image from 'next/image';
import deleteIcon from "../../../../../public/images/icons/delete.svg";
import userDark from "../../../../../public/images/icons/user-dark.svg";
import userIcon from "../../../../../public/images/icons/user.svg";
import {useAppSelector} from "@/redux/hooks";
import {Caretaker} from "@/types/petData";

type CaretakerCardProps = {
    onClick: (i: Caretaker) => void;
    caretaker: Caretaker
};

function CaretakerCard({
                           onClick, caretaker
                       }: CaretakerCardProps) {
    const {theme} = useAppSelector((state) => state.theme);
    const userImg = theme === 'dark' ? userDark : userIcon;
    return (
        <div className='flex items-center gap-3  rounded-input mt-[20px] max-w-[300px]'>
            <div className="bg-white dark:bg-dark-gray-bg rounded-full md:h-[70px] md:w-[70px] md:min-h-[70px] md:min-w-[70px] h-[50px] w-[50px] min-h-[50px] min-w-[50px]">
                <Image src={userImg} alt="user" height={80} width={80}
                       className="w-full aspect-square h-full object-cover rounded-full"/>
            </div>
            <div className='flex-1'>
                <p className='text-16px font-600 text-dark-gray-text dark:text-white leading-144%'>{caretaker?.name}</p>
                <span className=' text-14px font-400 leading-157% w-[60%] text-dark-gray-text dark:text-white'>{caretaker?.email}</span>
            </div>
            <button className='w-[40px] h-[40px] min-w-[40px] min-h-[40px] hover:scale-[1.05] transition duration-300 ease-in-out'
                    onClick={() => onClick(caretaker)}><Image
                src={deleteIcon} alt="log-out" height={20} width={20}/></button>
        </div>
    );
}

export default CaretakerCard;
