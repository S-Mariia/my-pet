import React, {useEffect, useState} from "react";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { PetData} from "@/types/petData";
import { getPetList} from "@/utils/createUserInDatabase";
import {useAppSelector} from "@/redux/hooks";
import {getDatabase, ref, set} from "@firebase/database";
import {useRouter} from "next/navigation";
import {showErrorToast, showSuccessToast} from "@/utils/tostify";
import darkX from "../../../../public/images/icons/dark-close.svg";
import lightX from "../../../../public/images/icons/close.svg";

type DeletePetModalProps = {
    isOpenModal: boolean;
    setIsOpenModal: (i: boolean) => void;
    pet: PetData
}

type obgType={
    [key:string]:PetData
}

const DeletePetModal: React.FC<DeletePetModalProps> = ({isOpenModal, setIsOpenModal, pet}) => {
    const [petsList, setPetsList] = useState<PetData[]>([])
    const {user} = useAppSelector((state) => state.user);
    const {theme} = useAppSelector((state) => state.theme);
    const x = theme === 'dark' ? darkX : lightX;
    const router = useRouter();
    const db = getDatabase();


    useEffect(() => {
        if (user) {
            getPetList(user, setPetsList)
        }
    }, [user])

    useEffect(() => {
        // eslint-disable-next-line
        const mainBlock = document.getElementById("main") as any;
        if (isOpenModal) {
            mainBlock?.classList.add("max-h-[100vh]");
            mainBlock?.classList.add("overflow-hidden");
        } else {
            mainBlock?.classList.remove("max-h-[100vh]");
            mainBlock?.classList.remove("overflow-hidden");
        }
    }, [isOpenModal]);
    const handleDeletePet = async (payload: obgType) => {
        if (user) {
            try{const starCountRef = ref(db, 'users/' + user.uid + '/pets' );
            await set(starCountRef, payload);
            await router.push('/pets-list') ;
            await showSuccessToast(`${pet.petName} has been deleted from your pets list.`)
            } catch (error){
                if (error instanceof Error) {
                    console.error(error);
                    const errorMessage = (typeof error === 'object' && 'message' in error) ? error.message : "An error occurred. Please try again later.";
                    showErrorToast(errorMessage);
                } else {
                    console.error('An unknown error occurred:', error);
                }
            }
        }
    }
    const handleCloseModal = () => {
        setIsOpenModal(false);
    };

    const onSubmit =async () => {
        const newPets = (petsList?.length)?petsList.filter(i=>i.petId!==pet.petId):[];
        const obg: obgType = {}
        newPets.map((pet)=>(obg[pet.petId as string]={...pet}))
        await handleDeletePet(obg)
        await handleCloseModal()
    };


    return <>
            <div onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseModal()
            }}
                 className="z-[10000000] fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 h-[100%] w-[100%] bg-opacity-45 bg-black">
                <div
                    className="overflow-hidden relative sm:w-[70%] w-full  max-w-[600px]  py-6 rounded-2xl bg-white dark:bg-sidebar-bg">
                    <button
                        onClick={handleCloseModal}
                        className="absolute sm:right-[32px] z-[10000000] right-[24px] top-[24px] text-brown-500 font-semibold text-base leading-[11px] mb-4"
                    >
                        <Image src={x} alt={"Close"}
                               width={24} height={24}
                               className={"h-[24px] w-[24px]"}/>
                    </button>
                    <div className={"px-8 flex flex-col  justify-between"}>
                        <h2 className=' font-700 leading-136% sm:text-28px text-20px mb-[20px] dark:text-white text-dark-gray-text'>Delete Profile</h2>
                        <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid"/>
                        <p className='text-24px my-[60px] font-600 text-center text-dark-gray-text dark:text-white leading-144%'>Do you want to delete {pet.petName} from your pets list?<br/><small className='text-[red] ml-[15px]'>A deleted pet profile cannot be restored.</small></p>

                        <div className='w-[200px] mx-[auto]'><CustomButton type="button" title="Delete" onClick={onSubmit}/></div>
                    </div>
                </div>
            </div>

        </>;
}

export default DeletePetModal;