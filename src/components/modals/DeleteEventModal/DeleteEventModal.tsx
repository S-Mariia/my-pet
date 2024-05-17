import React, {useEffect} from "react";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {HealthEvent} from "@/types/petData";
import {useAppSelector} from "@/redux/hooks";
import darkX from "../../../../public/images/icons/dark-close.svg";
import lightX from "../../../../public/images/icons/close.svg";

type DeleteEventModalProps = {
    setIsOpenModal: (i: HealthEvent | null) => void;
    // eslint-disable-next-line
    handleUpdate:(i:any)=>void;
    event: HealthEvent;
    events: HealthEvent[];
    type: "health" | 'activity' | "nutrition"

}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ setIsOpenModal, handleUpdate, event,events, type}) => {
    const {theme} = useAppSelector((state) => state.theme);
    const x = theme === 'dark' ? darkX : lightX;
    useEffect(() => {
        // eslint-disable-next-line
        const mainBlock = document.getElementById("main") as any;
        if (event) {
            mainBlock?.classList.add("max-h-[100vh]");
            mainBlock?.classList.add("overflow-hidden");
        } else {
            mainBlock?.classList.remove("max-h-[100vh]");
            mainBlock?.classList.remove("overflow-hidden");
        }
    }, [event]);

    const handleCloseModal = () => {
        setIsOpenModal(null);
    };

    const onSubmit =async () => {
        const newEvents = (events?.length)?events.filter(i=>i.id!==event.id):[];
        await handleUpdate({[type + "Events"]: newEvents})
        await handleCloseModal()
    };


    return <>
            <div onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseModal()
            }}
                 className="z-[10000000] fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 h-[100%] w-[100%] bg-opacity-45 bg-black">
                <div
                    className="overflow-hidden relative w-[70%] max-w-[600px]  py-6 rounded-2xl bg-white dark:bg-sidebar-bg">
                    <button
                        onClick={handleCloseModal}
                        className="absolute sm:right-[32px] z-[10000000] right-[24px] top-[24px] text-brown-500 font-semibold text-base leading-[11px] mb-4"
                    >
                        <Image src={x} alt={"Close"}
                               width={24} height={24}
                               className={"h-[24px] w-[24px]"}/>
                    </button>
                    <div className={"px-8 flex flex-col  justify-between"}>
                        <h2 className=' font-700 leading-136% text-28px mb-[20px] dark:text-white text-dark-gray-text'>Delete event</h2>
                        <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>
                        <p className='text-24px my-[60px] font-600 text-center text-dark-gray-text dark:text-white leading-144%'>Do you want to delete this event?</p>


                        <div className='w-[200px] mx-[auto]'><CustomButton type="button" title="Delete" onClick={onSubmit}/></div>

                    </div>
                </div>
            </div>

        </>;
}

export default DeleteEventModal;