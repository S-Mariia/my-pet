'use client';

import React from 'react';
import Image from 'next/image';
import {useAppSelector} from "@/redux/hooks";
import dogsDark from "../../../../../public/images/dashbord/dark-empty-db.svg";
import dogsLight from "../../../../../public/images/dashbord/light-empty-db.svg";
import {useRouter} from "next/navigation";
import {PetData} from "@/types/petData";

type PetCardProps = {
    pet: PetData
};

function PetCard({pet}: PetCardProps) {
    const {theme} = useAppSelector((state) => state.theme);
    const logo = theme === 'dark' ? dogsDark : dogsLight;
    const router = useRouter();


    return (
        <div className='transition duration-300 ease-in-out hover:scale-[1.03] cursor-pointer xl:w-[25%] md:w-[33%] sm:w-[50%] w-full max-w-[300px] sm:max-w-[none]' key={pet.petId} onClick={()=>router.push(`/pets-list/${pet.petId}`)}>
            <div
                className='m-[10px]  aspect-[7/8] px-4 py-5 flex flex-col items-center justify-around rounded-pet-card border border-solid border-light-text dark:border-dark-gray-bg shadow-md bg-white dark:bg-dark-gray-text'>
                <p className='font-600 text-16px leading-150% text-dark-gray-text dark:text-white mb-[20px]'>{pet.petName}</p>
                <div
                    className="aspect-square relative bg-light-bg-md dark:bg-dark-gray-bg rounded-full lg:w-[80%] max:w-[90%] p-[15px] shadow aspect-square">
                    <div className='aspect-square  w-full'>
                        <Image src={pet.avatar || logo} alt={pet.petName || 'pet'} width={200} height={200}
                               className="w-full aspect-square h-full object-cover rounded-full"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetCard;
