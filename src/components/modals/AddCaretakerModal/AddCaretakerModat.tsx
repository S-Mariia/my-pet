import React from "react";
import Image from "next/image";
import lightX from "@/../public/images/icons/close.svg"
import darkX from "@/../public/images/icons/dark-close.svg"

import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {defaultValues, schema} from "@/components/modals/AddCaretakerModal/schema/addCaremacer";
import ControlInput from "@/components/common/ControlInput/ControlInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {Caretaker} from "@/types/petData";
import {useAppSelector} from "@/redux/hooks";

type AddCaretakerModalProps = {
    setIsOpenModal: (i: boolean) => void;
    // eslint-disable-next-line
    handleUpdate:(i:any)=>void;
    caretakers: Caretaker[]
}

const AddCaretakerModal: React.FC<AddCaretakerModalProps> = ({ setIsOpenModal, handleUpdate, caretakers}) => {
    const {theme} = useAppSelector((state) => state.theme);
    const x = theme === 'dark' ? darkX : lightX;
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });
    const {
        handleSubmit, register,
        formState: {errors}
    } = methods;
    const handleCloseModal = () => {
        setIsOpenModal(false);
    };

    const onSubmit =async (payload:Caretaker) => {
        const newCaretakers = caretakers?[...caretakers, payload]:[payload]
        await handleUpdate({caretakers:newCaretakers})
        await handleCloseModal()
    };


    return (<>
            <div onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseModal()
            }}
                 className="z-[10000000] fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 h-[100%] w-[100%] bg-opacity-45 bg-black">
                <div
                    className="overflow-hidden relative w-[90%] max-w-[600px]  py-6 rounded-2xl bg-white dark:bg-sidebar-bg">
                    <button
                        onClick={handleCloseModal}
                        className="absolute sm:right-[32px] z-[10000000] right-[24px] top-[24px] text-brown-500 font-semibold text-base leading-[11px] mb-4"
                    >
                        <Image src={x} alt={"Close"}
                               width={24} height={24}
                               className={"h-[24px] w-[24px]"}/>
                    </button>
                    <div className={"px-8 flex flex-col  justify-between"}>
                        <h2 className=' font-700 leading-136% text-28px mb-[20px] dark:text-white text-dark-gray-text'>Add Caretaker</h2>
                        <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>

                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='min-w-[50%]'><p
                                    className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Name</p>
                                    <ControlInput type="text" placeholder="Name"
                                                  errorMessage={errors?.name?.message||''} {...register('name')}/></div>
                                <div className='min-w-[50%]'><p
                                    className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Email</p>
                                    <ControlInput type="text" placeholder="Email"
                                                  errorMessage={errors?.email?.message||''} {...register('email')}/></div>
                                <div className='mt-[30px] w-[200px] mx-[auto]'><CustomButton type="submit" title="Add"
                                                                         disabled={!!Object.values(errors)?.length}/>
                                </div>

                            </form>
                        </FormProvider>

                    </div>
                </div>
            </div>

        </>
    );
}

export default AddCaretakerModal;