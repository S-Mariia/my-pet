'use client'
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import userDark from "../../../../public/images/icons/user-dark.svg";
import userIcon from "../../../../public/images/icons/user.svg";
import update from "../../../../public/images/icons/update.svg";

import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";

import {
    onAuthStateChanged,
    updateProfile,
    // updateEmail,sendEmailVerification
} from 'firebase/auth';
import {ref, uploadBytes, getStorage, getDownloadURL} from 'firebase/storage';
import {auth} from "@/utils/firebase";
import {setLoading} from "@/redux/slices/loading/loadingSlice";
import plus from "../../../../public/images/icons/plusb-white.svg";
import {setUser} from "@/redux/slices/userAuth/userAuthSlice";
import InfoSideHeader from "@/components/common/InfoSideHeader/InfoSideHeader";
import {showSuccessToast} from "@/utils/tostify";

export default function AccountPage() {
    const {theme} = useAppSelector((state) => state.theme);
    const {user} = useAppSelector((state) => state.user);
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [preview, setPreview] = useState<string>('')
    const [isUpdate, setUpdate] = useState(false)

    const userImg = theme === 'dark' ? userDark : userIcon;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user) {
            setEmail(user.email)
            if (user.displayName) setFirstName(user.displayName.split(' ')[0])
            if (user.displayName) setLastName(user.displayName.split(' ')[1])
            if (user.photoURL) setAvatarUrl(user.photoURL)
        }
    }, [user])
    const handleUpdateUser = async (res: string) => {
        if (auth.currentUser) {
            const newUser = {
                displayName: `${firstName} ${lastName}`,
                photoURL: res || avatarUrl,
            }
            await updateProfile(auth.currentUser, newUser)
            await onAuthStateChanged(auth, (currentUser) => {
                if (currentUser) {
                    localStorage.setItem('user', 'true')
                    const {
                        displayName, email, phoneNumber, photoURL, uid, emailVerified,
                    } = currentUser;
                    dispatch(setUser({
                        displayName, email, phoneNumber, photoURL, uid, emailVerified,
                    }));
                }
            })

            // if(auth.currentUser.email!==email) {
            //   const current = {...auth.currentUser, email}
            //     try {
            //         await sendEmailVerification(current);
            //         await updateEmail(auth.currentUser, email);
            //         console.log('Email updated successfully!');
            //     } catch (error) {
            //         console.error('Error updating email:', error);
            //     }
            // }
            await dispatch(setLoading(false));
            showSuccessToast("Account has been successfully updated!")
        }
        setAvatar(null)
        setUpdate(false)
        setPreview('')
    }

    const uploadAvatar = async () => {

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `avatars/${avatar?.name}`);
            uploadBytes(storageRef, avatar as File).then((resp) => {
                getDownloadURL(resp.ref).then(res => {
                    setAvatarUrl(res)
                    handleUpdateUser(res)
                })
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    return (<>
            <InfoSideHeader title='Your account'/>
            <div className='mt-[50px] flex  gap-[20px]'>
                <div className='flex'>
                    <div
                        className="relative mr-[50px] bg-light-bg-md dark:bg-dark-gray-bg rounded-full w-[fit-content]  h-[fit-content] p-[15px] shadow">
                        <div
                            className="relative h-[120px] w-[120px] max-h-[120px] max-w-[120px]">
                            <Image src={avatarUrl || userImg} alt="user" width={100} height={100}
                                   className="w-full h-full object-cover rounded-full"/>
                            {isUpdate && <div
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
                            </div>}
                        </div>

                    </div>
                </div>

                <div className=' flex flex-wrap flex-col w-full gap-[20px]'>
                    {!isUpdate && <div className='flex w-full justify-end max-w-[400px]'>
                        <button className='mt-[-30px]' onClick={() => {
                            setUpdate(true)
                        }}><Image src={update} alt="update" height={40} width={40}/></button>
                    </div>
                    }
                    <div className='w-full  max-w-[400px]'><p
                        className='mb-[10px] text-dark-gray-text dark:text-white font-400 leading-136% text-16px'>First Name</p>
                        <CustomInput type="text" value={firstName} placeholder="First Name" setValue={setFirstName}
                                     disabled={!isUpdate}/></div>
                    <div className='w-full max-w-[400px] '><p
                        className='mb-[10px] text-dark-gray-text dark:text-white font-400 leading-136% text-16px'>Last Name</p>
                        <CustomInput type="text" value={lastName} placeholder="Last Name" setValue={setLastName}
                                     disabled={!isUpdate}/></div>
                    <div className='w-full max-w-[400px]'><p
                        className='mb-[10px] text-dark-gray-text dark:text-white font-400 leading-136% text-16px'>Email</p>
                        <CustomInput type="email" value={email} placeholder="Email" setValue={setEmail}
                                     disabled={true}/></div>
                    {isUpdate && <div className='flex w-full max-w-[400px]'>
                        <div className='w-[50%] pr-[15px]'><CustomButton type="button" title="Cancel" onClick={() => {
                            setUpdate(false)
                        }}/></div>
                        <div className='w-[50%] pl-[15px]'><CustomButton type="button" title="Update my account" onClick={async () => {
                            await dispatch(setLoading(true))
                            if (avatar) {
                                await uploadAvatar()
                            } else await handleUpdateUser('');
                        }}/></div>
                    </div>}

                </div>

            </div>
        </>
    );
}