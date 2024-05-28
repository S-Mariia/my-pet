import React, {useEffect, useState} from 'react';
import CustomButton from "@/components/common/CustomButton/CustomButton";
import AddEventModal from "@/components/modals/AddEventModal/AddEventModal";
import {noScroll} from "@/utils/noScroll";
import moment from "moment";
import {HealthEvent, PetData} from "@/types/petData";
import Image from "next/image";
import update from "../../../../../public/images/icons/update.svg";
import EditEventModal from "@/components/modals/EditEventModal/EditEventModal";
import deleteIcon from "../../../../../public/images/icons/delete.svg";
import DeleteEventModal from "@/components/modals/DeleteEventModal/DeleteEventModal";

type EventBlockProps = {
    // eslint-disable-next-line
    handleUpdatePet: (i: any) => void;
    pet: PetData;
    type: "health" | 'activity' | "nutrition"
};

function EventBlock({
                        handleUpdatePet, pet, type
                    }: EventBlockProps) {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<HealthEvent | null>(null);
    const [isDeleteEvent, setIsDeleteEvent] = useState<HealthEvent | null>(null);

    const currentArray = pet?.[`${type}Events`]?.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date();
        const dateB = b.date ? new Date(b.date) : new Date();
        return dateB.getTime() - dateA.getTime();
    });
    useEffect(() => {
        noScroll(isOpenModal)
    }, [isOpenModal]);
    return (
        <div
            className='mt-[30px] p-[15px] rounded-pet-card border border-solid border-light-text dark:border-dark-gray-bg shadow-md bg-white dark:bg-dark-gray-text'>
            <p className='text-dark-gray-text dark:text-white font-600 leading-136% text-16px mb-[20px] capitalize'>{type}</p>
            <div>
                {(currentArray?.length) ? currentArray.map(i => <div key={i.id}>
                        {type !== "nutrition" &&
                            <div className='flex gap-[30px] w-full justify-between items-center mt-[15px]'>
                                <div className='flex sm:gap-[20px] sm:flex-row flex-col'>
                                    <div><p
                                        className='text-input-border-dark dark:text-input-border font-400 text-16px leading-150%'>Date</p>
                                    </div>
                                    <div><p
                                        className='text-dark-gray-text dark:text-white font-600 text-16px leading-150%'>{moment(new Date(i.date as string)).format("MMM Do YY")}</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='w-[40px] h-[40px] hover:scale-[1.05] transition duration-300 ease-in-out'
                                        onClick={() => setIsEdit(i)}><Image src={update} alt="update" height={30}
                                                                            width={30}/>
                                    </button>
                                    <button
                                        className='ml-[30px] w-[40px] h-[40px] min-w-[30px] min-h-[30px] hover:scale-[1.05] transition duration-300 ease-in-out'
                                        onClick={() => {
                                            setIsDeleteEvent(i)
                                        }}><Image
                                        src={deleteIcon} alt="log-out" height={30} width={30}/></button>
                                </div>
                            </div>}
                        <div>
                            {type === "nutrition" && <div className='flex justify-between  mt-[10px] items-center'>
                                <div><p
                                    className='text-input-border-dark dark:text-input-border font-400 text-16px leading-150%'>Description</p>
                                </div>
                                <div className='w-full flex justify-end '>
                                    <button
                                        className='w-[40px] h-[40px] hover:scale-[1.05] transition duration-300 ease-in-out'
                                        onClick={() => setIsEdit(i)}><Image src={update} alt="update" height={30}
                                                                            width={30}/></button>
                                    <button
                                        className='w-[40px] ml-[30px] h-[40px] min-w-[30px] min-h-[30px] hover:scale-[1.05] transition duration-300 ease-in-out'
                                        onClick={() => {
                                            setIsDeleteEvent(i)
                                        }}><Image
                                        src={deleteIcon} alt="log-out" height={30} width={30}/></button>
                                </div>
                            </div>}
                            <p className='mb-[15px] pt-[15px] text-input-border-dark dark:text-input-border font-400 text-16px leading-150%'>{i.description}</p>
                        </div>
                        <div
                            className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>

                    </div>)
                    :
                    <p className='mb-[20px] text-input-border-dark dark:text-input-border text-center font-400 text-16px leading-150%'>No
                        events added</p>}
                <div className='w-[150px] mx-[auto] mt-[20px]'>
                    <CustomButton type="button" title={type === "nutrition" ? "+ Add info" : "+ Add event"}
                                  onClick={() => setIsOpenModal(true)}/>
                </div>
            </div>
            {isOpenModal &&
                <AddEventModal setIsOpenModal={setIsOpenModal} handleUpdate={handleUpdatePet}
                               events={currentArray || []} type={type}/>}
            {isEdit &&
                <EditEventModal setIsOpenModal={setIsEdit} handleUpdate={handleUpdatePet}
                                events={currentArray || []} type={type} event={isEdit}/>}
            {isDeleteEvent && <DeleteEventModal event={isDeleteEvent} type={type} events={currentArray || []}
                                                setIsOpenModal={setIsDeleteEvent} handleUpdate={handleUpdatePet}/>}
        </div>
    );
}

export default EventBlock;
