import React, {useState} from "react";
import Image from "next/image";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import Calendar from "@/components/common/Calendar/Calendar";
import {PetData} from "@/types/petData";
import ControlInput from "@/components/common/ControlInput/ControlInput";
import ControlSelect from "@/components/common/ControlSelect/ControlSelect";
import {petSexOptions, petSizeOptions} from "@/constans/selectOptions";
import {PetPayload} from "@/components/pages/add-pet/types";
import {schema} from "@/components/pages/add-pet/schema/addPet";
import plus from "../../../../public/images/icons/plusb-white.svg";
import dogsDark from "../../../../public/images/dashbord/dark-empty-db.svg";
import dogsLight from "../../../../public/images/dashbord/light-empty-db.svg";
import {useAppSelector} from "@/redux/hooks";
import {getDownloadURL, getStorage, ref as storageRefF, uploadBytes} from "firebase/storage";
import SmallLoader from "@/components/common/SmallLoader/SmallLoader";
import darkX from "../../../../public/images/icons/dark-close.svg";
import lightX from "../../../../public/images/icons/close.svg";
import moment from "moment/moment";

type EditPetModalProps = {
    setIsOpenModal: (i: boolean) => void;
    // eslint-disable-next-line
    handleUpdate: (i: any) => void;
    pet: PetData;

}

const EditPetModal: React.FC<EditPetModalProps> = ({setIsOpenModal, handleUpdate,pet}) => {
    const {theme} = useAppSelector((state) => state.theme);
    const logo = theme === 'dark' ? dogsDark : dogsLight;
    const x = theme === 'dark' ? darkX : lightX;
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [preview, setPreview] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    // eslint-disable-next-line
    const {petId,avatar, caretakers, healthEvents, activityEvents, nutritionEvents,...currentDefaultValues}=pet


    const methods = useForm({
        //@ts-ignore
        resolver: yupResolver(schema),
        //@ts-ignore
        defaultValues: currentDefaultValues,
    });
    const {
        handleSubmit, register, control,
        formState: {errors}
    } = methods;
    const handleCloseModal = () => {
        setIsOpenModal(false);
    };
    const uploadAvatar = async (payload: PetPayload) => {
        try {
            const storage = getStorage();
            const storageRef = storageRefF(storage, `pets/avatars/${newAvatar?.name}`);
            uploadBytes(storageRef, newAvatar as File).then((resp) => {
                getDownloadURL(resp.ref).then(res => {
                    setAvatarUrl(res)
                    handleUpdate({...pet,...payload, avatar: res})

                }).finally(()=> {
                    setLoading(false)
                    handleCloseModal()
                })
            });
        } catch (error) {
            console.error('Error uploading newAvatar:', error);
        }
    };
    const onSubmit = async (formData: {
        birthday?: string | undefined;
        petName?: string | undefined;
        size?: string | undefined;
        type?: string | undefined;
        sex?: string | undefined;
        weight?: string | undefined;
    }) => {
        const payload: PetPayload = {
            petName: formData.petName || '',
            type: formData.type || '',
            size: formData.size || '',
            sex: formData.sex || '',
            birthday: formData.birthday || '',
            weight: formData.weight || '',
        };

        setLoading(true);
        if (newAvatar) {
            await uploadAvatar(payload);
        } else {
            await handleUpdate({ ...pet, ...payload });
            await setLoading(false);
            await handleCloseModal();
        }
    };



    return (<>
            <div onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseModal()
            }}
                 className="z-[10000000] fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 h-[100%] w-[100%] bg-opacity-45 bg-black">
                {loading?<SmallLoader/>:<div
                    className="overflow-hidden relative w-[80%] max-w-[700px] min-h-[70%] py-6 rounded-2xl bg-white dark:bg-sidebar-bg">
                    <button
                        onClick={handleCloseModal}
                        className="absolute sm:right-[32px] z-[10000000] right-[24px] top-[24px] text-brown-500 font-semibold text-base leading-[11px] mb-4"
                    >
                        <Image src={x} alt={"Close"}
                               width={24} height={24}
                               className={"h-[24px] w-[24px]"}/>
                    </button>
                    <div className={"px-8 flex flex-col  justify-between"}>
                        <h2 className=' font-700 leading-136% text-28px mb-[20px] dark:text-white text-dark-gray-text'>Edit information
                            about {pet.petName}</h2>
                        <div
                            className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>
                        <div className='flex justify-center items-center'>
                            <div
                                className="mt-[20px] relative mr-[50px] bg-light-bg-md dark:bg-dark-gray-bg rounded-full w-[fit-content] h-[fit-content] p-[15px] shadow">
                                <div
                                    className="relative h-[120px] w-[120px]">
                                    <Image src={avatarUrl || pet.avatar || logo} alt="Pet" width={100} height={100}
                                           className="w-full h-full object-cover rounded-full"/>
                                    <div
                                        className='absolute top-[0px] h-[120px] w-[120px] flex items-center justify-center dark:bg-sidebar-bg-04 bg-black-bg-04 rounded-full border-[1.5px] border-solid border-circle-border'>
                                        {preview ? <Image src={preview} alt="add new" width={100} height={100}
                                                          className="w-full h-full object-cover rounded-full"/> :
                                            <Image src={plus} alt="add new" width={35} height={35}/>}
                                        <input
                                            className='cursor-pointer z-10000 absolute  x-0 y-0 h-[120px] w-[120px] opacity-[0] '
                                            type="file" accept='image/*' onChange={(e) => {
                                            //@ts-ignore
                                            const file = e.target?.files[0]
                                            setNewAvatar(file)
                                            if (file.type.startsWith('image')) {
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    setPreview(e.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}/>
                                    </div>
                                </div>

                            </div>
                            <div className='w-[50%]'>
                                <div className='flex w-full justify-between items-center my-[15px]'>
                                    <div><p className='text-input-border-dark dark:text-input-border font-400 text-16px leading-150%'>Pet name</p></div>
                                    <div><p className='text-dark-gray-text dark:text-white font-600 text-16px leading-150%'>{pet.petName}</p></div>
                                </div>
                                <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>
                                <div className='flex w-full justify-between items-center my-[15px]'>
                                    <div><p className='text-input-border-dark dark:text-input-border font-400 text-16px leading-150%'>Birth
                                        date</p></div>
                                    <div><p className='text-dark-gray-text dark:text-white font-600 text-16px leading-150%'>{moment(new Date(pet.birthday as string)).format("MMM Do YY")}</p></div>
                                </div>
                                <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>
                                <div className='flex w-full justify-between items-center my-[15px]'>
                                    <div><p className='text-input-border-dark dark:text-input-border font-400 text-16px leading-150%'>Type</p></div>
                                    <div><p className='text-dark-gray-text dark:text-white font-600 text-16px leading-150%'>{pet.type}</p></div>
                                </div>
                                <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>

                                <div className='flex w-full justify-between items-center my-[15px]'>
                                    <div><p className='text-input-border-dark dark:text-input-border font-400 text-16px leading-150%'>Sex</p></div>
                                    <div><p className='text-dark-gray-text dark:text-white font-600 text-16px leading-150%'>{pet.sex}</p></div>
                                </div>
                            </div>
                        </div>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='flex flex-wrap'>
                                    <div className='hidden'>
                                        <div className='w-[50%] pr-[10px]'>
                                            <div className='my-[20px]'>
                                                <p className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px '>
                                                    Pet name
                                                </p>
                                            </div>
                                            <ControlInput type="text" placeholder="Pet name" disabled
                                                          errorMessage={''} {...register('petName')}/>
                                        </div>
                                        <div className='min-w-[50%]  pl-[10px]'><p
                                            className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Birth
                                            date</p>
                                            <Calendar name={'birthday'} errorMessage={errors?.birthday?.message}
                                                      control={control} disabled/>
                                        </div>
                                        <div className='min-w-[50%] pr-[10px]'><p
                                            className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Type</p>
                                            <ControlInput type="text" placeholder="Type" disabled
                                                          errorMessage={errors?.type?.message} {...register('type')}/></div>
                                        <div className='min-w-[50%] pl-[10px]'><p
                                            className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Sex</p>
                                            <ControlSelect
                                                options={petSexOptions}
                                                disabled
                                                errorMessage={errors?.sex?.message}
                                                {...register('sex')}
                                            /></div>
                                    </div>
                                    <div className='min-w-[50%] pr-[10px]'><p
                                        className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Size</p>
                                        <ControlSelect
                                            options={petSizeOptions}
                                            disabled={false}
                                            errorMessage={errors?.size?.message}
                                            {...register('size')}
                                        /></div>
                                    <div className='min-w-[50%] pl-[10px]'><p
                                        className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Weight</p>
                                        <ControlInput type="text" placeholder="Weight"
                                                      errorMessage={errors?.weight?.message} {...register('weight')}/>
                                    </div>
                                </div>

                                <div className='w-[200px] mx-[auto] mt-[30px]'><CustomButton type="submit" title="Save"
                                                                         disabled={!!Object.values(errors)?.length}/>
                                </div>
                            </form>
                        </FormProvider>

                    </div>
                </div>}
            </div>

        </>
    );
}

export default EditPetModal;