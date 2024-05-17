'use client'
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from 'react';
//form
import {yupResolver} from "@hookform/resolvers/yup";
import {FormProvider, useForm} from "react-hook-form";
import {defaultValues, schema} from "@/components/pages/add-pet/schema/addPet";
//redux
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setLoading} from "@/redux/slices/loading/loadingSlice";
import {setPetsListA} from "@/redux/slices/petsList/petsListSlice";
//components
import Calendar from "@/components/common/Calendar/Calendar";
import ControlInput from "@/components/common/ControlInput/ControlInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import ControlSelect from "@/components/common/ControlSelect/ControlSelect";
import InfoSideHeader from "@/components/common/InfoSideHeader/InfoSideHeader";
//types
import {PetPayload, PetPayloadA} from "@/components/pages/add-pet/types";
import {PetData} from "@/types/petData";
//firebase
import {auth} from "@/utils/firebase";
import {ref as storageRefF} from 'firebase/storage';
import {getDatabase, ref, set} from "@firebase/database";
import {getDownloadURL, getStorage, uploadBytes} from "firebase/storage";
//images
import plus from "../../../../public/images/icons/plusb-white.svg";
import dogsDark from "../../../../public/images/dashbord/dark-empty-db.svg";
import dogsLight from "../../../../public/images/dashbord/light-empty-db.svg";

import {petSexOptions, petSizeOptions} from "@/constans/selectOptions";
import {getPetList} from "@/utils/createUserInDatabase";
import {showErrorToast, showSuccessToast} from "@/utils/tostify";

export default function AddPetPage() {
    const {theme} = useAppSelector((state) => state.theme);
    const {user} = useAppSelector((state) => state.user);
    const {petsList} = useAppSelector((state) => state.petsList);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [preview, setPreview] = useState<string>('')

    const logo = theme === 'dark' ? dogsDark : dogsLight;
    const db = getDatabase();
    const router = useRouter();

    const dispatch = useAppDispatch();
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });
    const {
        handleSubmit, register, control, watch,
        formState: {errors}
    } = methods;
    const petNameWatch= watch('petName')
    const uniquenessCheck = petsList?.some(i=>i.petName===petNameWatch.trim())?'You already have a pet with this name in your pet list.':''
    useEffect(() => {
        if (user) {
            getPetList(user, (list:PetData[])=>dispatch(setPetsListA(list)));
        }
    }, [user])
    const handleAddPet = async (payload: PetPayloadA) => {
        const user = auth.currentUser
        if (user) {
            const newPetId=payload.petName?.split(' ').join('-')
            const starCountRef = ref(db, 'users/' + user.uid + '/pets/'+newPetId);

            await set(starCountRef, {
                ...payload,
                petId: newPetId,
            });
            await dispatch(setLoading(false));
            showSuccessToast("Pet profile has been successfully added!")
        }
        setAvatar(null)
        setPreview('')
        router.back()
    }

    const uploadAvatar = async (payload: PetPayload) => {
        try {
            const storage = getStorage();
            const storageRef = storageRefF(storage, `pets/avatars/${avatar?.name}`);
            uploadBytes(storageRef, avatar as File).then((resp) => {
                getDownloadURL(resp.ref).then(res => {
                    setAvatarUrl(res)
                    handleAddPet({...payload, avatar: res})
                })
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                const errorMessage = (typeof error === 'object' && 'message' in error) ? error.message : "An error occurred. Please try again later.";
                showErrorToast(errorMessage);
            } else {
                console.error('An unknown error occurred:', error);
            }
        }
    };
    const onSubmit = async (payload: PetPayload) => {
        await dispatch(setLoading(true))
        if (avatar) {
            await uploadAvatar(payload)
        } else await handleAddPet({...payload, avatar:''});
    }
    return (<>
            <InfoSideHeader title='Add Pet Profile'/>

            <div className='mt-[30px] flex flex-col  gap-[20px]'>
                <div className='flex justify-center'>
                    <div
                        className="relative  bg-light-bg-md dark:bg-dark-gray-bg rounded-full w-[fit-content] p-[15px] shadow">
                        <div
                            className="relative h-[120px] w-[120px]">
                            <Image src={avatarUrl || logo} alt="Pet" width={100} height={100}
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
                                    setAvatar(file)
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
                </div>

                <div className='flex flex-col  gap-[20px] w-full'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className='flex flex-wrap'>
                                <div className='w-full pr-[10px]' >
                              <div className='my-[20px]'>
                                  <p className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px '>
                                      Pet name                                   <small className='ml-[15px] text-[red] max-w-[200px] leading-[0.5] '>Attention! It is not possible to change the pet's name in the future.</small>
                                  </p>
                              </div>
                                    <ControlInput type="text" placeholder="Pet name"
                                                  errorMessage={uniquenessCheck||errors?.petName?.message} {...register('petName')}/>
                                </div>
                                <div className='min-w-[50%]  pr-[10px]'><p
                                    className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Birth
                                    date</p>
                                    <Calendar name={'birthday'} errorMessage={errors?.birthday?.message} control={control}/>
                                </div>
                                <div className='min-w-[50%] pl-[10px]'><p
                                    className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Type</p>
                                    <ControlInput type="text" placeholder="Type"
                                                  errorMessage={errors?.type?.message} {...register('type')}/></div>
                                <div className='min-w-[50%] pr-[10px]'><p
                                    className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Sex</p>
                                    <ControlSelect
                                        options={petSexOptions}
                                        disabled={false}
                                        errorMessage={errors?.sex?.message}
                                        {...register('sex')}
                                    /></div>
                                <div className='min-w-[50%] pl-[10px]'><p
                                    className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Size</p>
                                    <ControlSelect
                                        options={petSizeOptions}
                                        disabled={false}
                                        errorMessage={errors?.size?.message}
                                        {...register('size')}
                                    /></div>
                                <div className='min-w-[50%] pr-[10px]'><p
                                    className='text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]'>Weight</p>
                                    <ControlInput type="text" placeholder="Weight"
                                                  errorMessage={errors?.weight?.message} {...register('weight')}/></div>


                            </div>

                            <div className='mt-[30px]'><CustomButton type="submit" title="Create" disabled={!!uniquenessCheck||!!Object.values(errors)?.length}/></div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </>
    );
}